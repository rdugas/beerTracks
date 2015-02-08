function beer(name, abv, breweryName,id) {
	this.name = name;
	this.abv = abv;
	this.breweryName = breweryName;
	this.id = id;
}

function getAbv(beerItem){
	console.log("getAbv Called");
}