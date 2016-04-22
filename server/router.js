var http = require('http'),
url = require('url'),
fs = require('fs');

function route(req, res){ //route various requests to their proper functions
    
    console.log(req.method) // probably remove

    var path = url.parse(req.url).pathname

    var home = 'index.html'
    if (path == '/') path += home //if main address, redirect to homepage

    var xten_pos = path.search(/\.[a-z]+$/) //last period, or something (look it up)
    var name = path.substring(path.lastIndexOf('/')+1, xten_pos) //file name w/o extension
    var xten = path.substring(xten_pos+1) //extension aka file type

    var readF //this function will be set as the appropriate read function for the file

    function basic(err, data) { //most simple reader function
	if (err) return console.log(err)
	res.end(data)
    }

    //standard treatment
    readF = basic
    final_path = './client'+path    

    //special treatment
    if (xten == 'html'){

	function include(url) { //function to include a script to the html file
	    res.write('<script src="'+url+'"> </script>')
	}

	function seize(url) { //function to include a css file to the html
	    res.write('<link rel="stylesheet" type="text/css" href="'+url+'">')
	}

	readF = function(err, data) { //the official html reader function
	    res.write('<!DOCTYPE html>')
	    res.write('<html><head>')

	    var slideNum = parseInt(name.substring(1))/*name(minus 1st char) is parseable into a number*/
	    var isSlide = ! isNaN(slideNum) 
	    var id = name.substring(0,1)
	    var e = (id.localeCompare("e") == 0) //is it an energy slide?
	    if (isSlide) seize(id+".css") //each slide show has own css, each slide corresponds to a letter
	    else seize('home.css')

	    res.write('</head>')
	    include('http://code.jquery.com/jquery-1.11.1.min.js')
	    
	    if (isSlide){
		if (slideNum > 0)
		    ;//have a back redirect

		pages = 10 //# need to remove later, or just make them equal
		if (slideNum < pages) // need to actually set pages (max # of pages) above
		    ;//have a forward redirect

//		include('slideA.js') //js prep, defintions etc
		res.write(data) //write actual text file's content
//		include('slideB.js') //js execution, after setting of variables in data
	    }

	    else if (name.substring(1).localeCompare("survey") == 0){
//doesnt include a client side javascript page yet


		function cat(lzt){
		    var str = lzt[0]
		    for (var i=1; i<lzt.length; i++){
			str = str.concat(lzt[i])
		    }
		    return str
		}

		function Que(q, ops){
		    this.q = q;
		    this.ops = ops;

		    this.text = function(){
			var butts = ""//button code
			for (var i=0; i<this.ops.length; i++){
			    butts = butts.concat(cat(["<input type=\"radio\" name=\"", this.q, "\" value=\"", this.ops[i], "\"> ", this.ops[i]]))
			}
			return cat(["<form>", this.q, butts, "\n</form>"])
		    }

		    res.write(this.text())
		}

		var yni = ["Yes", "No", "Indifferent"];


		if (e){
		    //energy
		    new Que("I can now easily identify ways to save energy in my daily life.", yni)
		    new Que("I understand and can explain how saving energy can reduce my environmental footprint.", yni)
		    new Que("I am more likely to modify my behavior to improve energy efficiency.", yni)
		    new Que("Being environmentally conscious improves the environment.", yni)
		} else {
		    //housing
		    new Que("I have an increased knowledge and/or ability to access appropriate housing.", yni)
		    new Que("I am more likely to pursue services and support available to me.", yni)
		    new Que("I have a better understanding of how to manage resources.", yni)
		}

		//about yourself (optional) (and the same for each survey)
		new Que("Gender:", ["Female", "Male"])
		new Que("I live in a:", ["Rural Area", "Urban Area"])
		new Que("Income Level:", ["Low", "Moderate", "High"])
		new Que("Education Level:", ["Did Not Graduate High School",
					     "High School Graduate / GED", 
					     "College Degree or Higher"])

		}
	    
	    else { //non sequential pages all have their own js

		include(name+'.js')
		res.write(data)
	    }

	    res.end("</html>")
	}
    }

    if (4 < 2 /* xten == jpg or png or etc..*/)
	final_path = "./img"+path
    
    fs.readFile(final_path, readF)
}

function launch(port){
    http.createServer(route).listen(port) //, 'localhost')
    console.log('Server running on '+port+'.')
}


launch(8888)
