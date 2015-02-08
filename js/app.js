$(document).ready(function() {
    $('.unanswered-getter').submit(function(event) {
        // zero out results if previous search has run
        $('.results').html('');
        // get the value of the tags the user submitted
        var searchString = $(this).find("input[name='tags']").val();
        getBeersByName(searchString);
    });

    $('.inspiration-getter').submit(function(event) {
        // zero out results if previous search has run
        $('.results').html('');
        // get the value of the tags the user submitted
        var abvValue = $(this).find("input[name='answerers']").val();
        console.log("abvvalue: " + abvValue);
        getBeersByAbv(abvValue);
    });
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showBeer = function(beerResult) {

    // clone our result template code
    var result = $('.templates .question').clone();

    // Set the question properties in result
    var beerElem = result.find('.question-text a');
    beerElem.attr('href', beerResult.link);
    beerElem.text(beerResult.name);

    // set the date asked property in result
    var asked = result.find('.asked-date');
    // var date = new Date(1000*question.creation_date);
    var date = new Date(1000 * beerResult.updated_at);
    asked.text(date.toString());

    // set the #views for question property in result
    var abvValue = result.find('.viewed');
    abvValue.text(beerResult.abv);

    // set some properties related to asker
    var breweryName = result.find('.asker');
    breweryName.html('<p>Name: <a target="_blank" href=' + beerResult.brewery.name + ' >' +
        beerResult.brewery.name +
        '</a>' +
        '</p>' +
        '<p>Reputation: ' + beerResult.brewery.name + '</p>'
    );

    return result;
};

var showAnswerer = function(answerer) {

    // clone our result template code
    var result = $('.templates .answerer').clone();

    var answererElem = result.find('.answerer-name a');
    answererElem.attr('href', answerer.user.link);
    answererElem.text(answerer.user.display_name);

    var reputation = result.find('.reputation');
    reputation.text(answerer.user.reputation);

    var score = result.find('.score');
    score.text(answerer.score);

    var postCount = result.find('.postCount');
    postCount.text(answerer.post_count);

    return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
    var results = resultNum + ' results for <strong>' + query;
    return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error) {
    var errorElem = $('.templates .error').clone();
    var errorText = '<p>' + error + '</p>';
    errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow


var getAllBeers = function() {
    // the parameters we need to pass in our request to StackOverflow's API
    console.log("get all beers called");

    var request = {
        order: 'name DESC'
    };

    // http://api.openbeerdatabase.com/v1/beers.json?query=ale
    var result = $.ajax({
            url: "http://api.openbeerdatabase.com/v1/beers.json",
            data: request,
            dataType: "jsonp",
            type: "GET",
        })
        .done(function(result) {
            return result;
        })

    .fail(function(jqXHR, error, errorThrown) {
        console.log(error);
        console.log(errorThrown);
    });
};

var getBeersByName = function(searchQuery) {
    // the parameters we need to pass in our request to StackOverflow's API
    var request = {
        query: searchQuery,
        order: 'name DESC'
    };

    // http://api.openbeerdatabase.com/v1/beers.json?query=ale
    var result = $.ajax({
            url: "http://api.openbeerdatabase.com/v1/beers.json",
            data: request,
            dataType: "jsonp",
            type: "GET",
        })
        .done(function(result) {
            var searchResults = showSearchResults(request.query, result.beers.length);

            $('.search-results').html(searchResults);

            $.each(result.beers, function(i, item) {
                var beerResult = showBeer(item);
                $('.results').append(beerResult);
            });
        })
        .fail(function(jqXHR, error, errorThrown) {
            var errorElem = showError(error);
            $('.search-results').append(errorElem);
        });
};

var getBeersByAbv = function(abvValue) {

console.log("getBeersByAbv Called for: " + abvValue);

var request = {
    per_page: '500'
};

// http://api.openbeerdatabase.com/v1/beers.json?query=ale
var result = $.ajax({
        url: "http://api.openbeerdatabase.com/v1/beers.json",
        data: request,
        dataType: "jsonp",
        type: "GET",
    })
    .done(function(result) {

            console.log(result.beers.length);
            
            $.each(result.beers, function(i, item) {
                    
                    console.log(item);
                    console.log(item.name + " abvValue: " + item.abv);
                    console.log("comparing beer: " + item.name + " with abv: " + item.abv + "to abv: " + abvValue);
                    
                    if (item.abv >= 0) {
                        console.log("abv greater or equal - stays in results");
                        console.log("items left: " + result.beers.length);
                    }
                    else{
                        console.log("abv less, removing " + item.name + "from results");
                        result.beers.splice(i-1, 1);
                        console.log("items left: " + result.beers.length);
                    } 
                    });

                var searchResults = showSearchResults("Abv value at or above: " + abvValue, result.beers.length); 
                $('.search-results').html(searchResults);
            })
    .fail(function(jqXHR, error, errorThrown) {
        var errorElem = showError(error);
        $('.search-results').append(errorElem);
    });
};


