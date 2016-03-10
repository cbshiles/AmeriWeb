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

//function to begin a header maybe?

	readF = function(err, data) {
	    res.write('<!DOCTYPE html>')
	    res.write('<head><link rel="stylesheet" type="text/css" href="slide.css"></head>')
	    include('http://code.jquery.com/jquery-1.11.1.min.js')
	    if (! isNaN(parseInt(name.substring(1)))){/*name is parseable into a number*/
		console.log("yoo doo loo loo")
		//have the first character of the name be a letter denoting which set it belongs to
		//have this letter determine the css (look up some good free css pages you can use)
//		include('slide.css') //is this the right way to include css? check
		
		//the rest of the name is a number that says which slide in the order it is
		var nnum = 0//parsed value, name num
		if (nnum > 0)
		    ;//have a back redirect

		pages = 10 //# need to remove later
		if (nnum < pages) // need to actually set pages (max # of pages) above
		    ;//have a forward redirect

//		include('slideA.js') //js prep, defintions etc
		res.write(data) //write actual text file's content
//		include('slideB.js') //js execution, after setting of variables in data
	    }
	    else {
		include(name+'.js')
//		include('home.css') //is this the right way to include css? check
		res.write(data)
	    }
	    res.end
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
