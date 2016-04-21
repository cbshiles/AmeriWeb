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
	    if (isSlide) seize(name.substring(0,1)+".css") //each slide show has own css, each slide corresponds to a letter
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
