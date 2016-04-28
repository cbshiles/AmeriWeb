//This is for creating all the websites, besides the hard coded page material

//Client side js is for sending requests back to this router, or dynamically chaning the view

var sys = require('sys')

var exec = require('child_process').exec;

function puts(error, stdout, stderr) { sys.puts(stdout) }


var http = require('http'),
    url = require('url'),
    fs = require('fs');

function cat(lzt){
    var str = lzt[0]
    for (var i=1; i<lzt.length; i++){
	str = str.concat(lzt[i])
    }
    console.log("str: "+str)
    return str
}

function prall(obj){
    for (var pName in obj){
	console.log(pName, obj[pName])
    }
}

function Que(q, ops){
    console.log("q: "+q)
    console.log("ops: "+ops)
	var butts = ""//button code
	for (var i=0; i<ops.length; i++){
	    butts = butts.concat(cat(["<input type=\"radio\" name=\"", q, "\" value=\"", ops[i], "\"> ", ops[i]]))
	}
    var retstr = cat([q, butts])
    console.log("____++_>"+ retstr + " "+typeof retstr)
    return retstr
}

function route(req, res){ //route various requests to their proper functions

    var home = 'index.html'
    
    console.log(req.method)

    var path = url.parse(req.url).pathname

    if (path == '/') path += home //if main address, redirect to homepage

    var xten_pos = path.search(/\.[a-z]+$/) //last period, or something (look it up)
    var name = path.substring(path.lastIndexOf('/')+1, xten_pos) //file name w/o extension
    var xten = path.substring(xten_pos+1) //extension aka file type

    var readF //this function will be set as the appropriate read function for the file

    console.log(name)

    function basic(err, data) { //most simple reader function
	if (err) return console.log(err)
	res.end(data)
    }

    //standard treatment
    readF = basic
    final_path = './client'+path    

    //special treatment

    if (xten == 'js'){
	if (name == 'info_form'){
	    var queryData = url.parse(req.url, true).query;
	    exec("echo '"+queryData.fullname+" "+queryData.age+"' > infos/"+queryData.fullname+".txt", puts);
	    return
	}
	else if (name == 'survey_form'){
	    console.log("burritoes")
	}
    }

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
		if (slideNum > 0){
		        var sn = (slideNum-1).toString()
		        res.write(cat(["<a href='", id, sn, "'>Back</a>"]));//have a back redirect
		    }

		pages = 10 //# need to remove later, or just make them equal
// need to actually set pages (max # of pages) above
		if (slideNum < pages){
		    var sn = (slideNum+1).toString()
		    res.write(cat(["<a href='", id, sn, "'>Next</a>"]));//have a forward redirect
		}


		//		include('slideA.js') //js prep, defintions etc
		res.write(data) //write actual text file's content
		//		include('slideB.js') //js execution, after setting of variables in data
	    }

	    else if (name.substring(1).localeCompare("survey") == 0){
		//doesnt include a client side javascript page yet

		var yni = ["Yes", "No", "Indifferent"];

		function qw(a, b){//Que write
		    var strrl = new Que(a,b)
		    console.log("THIS IS STRR: "+typeof strrl+"\n")
		    res.write(""+strrl)
		}

		res.write('<form action="survey_form.js" method="get">') //open form

		if (e){
		    //energy
		    qw("I can now easily identify ways to save energy in my daily life.", yni)
		    qw("I understand and can explain how saving energy can reduce my environmental footprint.", yni)
		    qw("I am more likely to modify my behavior to improve energy efficiency.", yni)
		    qw("Being environmentally conscious improves the environment.", yni)
		} else {
		    //housing
		    qw("I have an increased knowledge and/or ability to access appropriate housing.", yni)
		    qw("I am more likely to pursue services and support available to me.", yni)
		    qw("I have a better understanding of how to manage resources.", yni)
		}

		//about yourself (optional) (and the same for each survey)
		qw("Gender:", ["Female", "Male"])
		qw("I live in a:", ["Rural Area", "Urban Area"])
		qw("Income Level:", ["Low", "Moderate", "High"])
		qw("Education Level:", ["Did Not Graduate High School",
					     "High School Graduate / GED", 
					     "College Degree or Higher"])

		res.write("</form>")

	    }
	    
	    else { //other non sequential pages all have their own js

		include(name+'.js')
		res.write(data)
	    }

	    res.end("</html>")
	}
    }

    //test this
    if (/(jpg|jpeg|png)/.test(xten))
	final_path = "./img"+path
    
    fs.readFile(final_path, readF)
}

function launch(port){
    http.createServer(route).listen(port) //, 'localhost')
    console.log('Server running on '+port+'.')
}

launch(8888)
