//This is for creating all the websites, besides the hard coded page material

//Client side js is for sending requests back to this router, or dynamically chaning the view

var sys = require('sys')

var exec = require('child_process').exec;

function puts(error, stdout, stderr) { sys.puts(stdout) }

function date_string(dt){
    console.log(typeof dt)
    return dt.getFullYear() +"/"+ ("0" + (dt.getMonth()+1)).slice(-2) +"/"+
    ("0" + dt.getDate()).slice(-2)
}


var http = require('http'),
    url = require('url'),
    fs = require('fs');

function cat(lzt){
    var str = lzt[0]
    for (var i=1; i<lzt.length; i++){
	str = str.concat(lzt[i])
    }
    return str
}

function prall(obj){
    for (var pName in obj){
	console.log(pName, obj[pName])
    }
}

function Que(q, ops){
	var butts = ""//button code
	for (var i=0; i<ops.length; i++){
	    butts = butts.concat(cat(["<input type=\"radio\" name=\"", q, "\" value=\"", ops[i], "\"> ", ops[i],
				     "<br>"]))
	}
    var retstr = cat([q, "<br>", butts,"<br>"])
    return retstr
}

function f_append(fname){
    return function(str){
	exec("echo '"+str+"' >> "+fname, puts);
    }
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

    //American themed! - actually might make things alot easier

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
	    var pages = e? 4:3 //4 energy slides, 3 housing
	    if (isSlide) seize(id+".css") //each slide show has own css, each slide corresponds to a letter
	    else seize('home.css')

	    res.write('</head>')
	    include('http://code.jquery.com/jquery-1.11.1.min.js')

	    res.write("<div>")
	    
	    if (isSlide){
		if (slideNum > 0){
		        var sn = (slideNum-1).toString()
		    res.write(cat(["<a class='right_butt' href='", id, sn, ".html'"+'><img src="left_arrow.jpg"></a>']));//have a back redirect


		}

		var page
		if (slideNum < pages){
		    var sn = (slideNum+1).toString()
		    page = ""+id+sn
		    res.write(cat(["<a class='left_butt' href='", page, ".html'"+'><img src="right_arrow.jpg"></a>']));//have a forward redirect		    
		}
		else {page = "info"
		      var letta = e?"e":"h"
		      res.write(cat(["<a class='left_butt' href='", page, '.html?letter='+ letta+ "'><img src="+'"right_arrow.jpg"></a>']));//have a forward redirect		    
		     }

		res.write("</div>")

		res.write("<div class='main'>")
		res.write("<img src='left_banner.jpg' class='l_banner' >")

		
		res.write("<div class='text'>")
		res.write(data)
		res.write("</div>")

		res.write("<img src='right_banner.jpg' class='r_banner' >")
		
		res.end("</div></html>")
		return
	    }

	    else if (name.substring(1).localeCompare("survey") == 0){

		var queryData = url.parse(req.url, true).query;

		f_append("infos.txt")(queryData.fullname+" "+queryData.age+" "+queryData.letter+" "+queryData.date)//flashy

		var yni = ["Yes", "No", "Indifferent"];

		function qw(a, b){//Que write
		    var strrl = Que(a,b)
		    res.write(strrl)
		}

		// function qwo(a, b){//optional version of qw
		//     b.push("I prefer not to answer.")
		//     qw(a, b)
		// }
  
		res.write('<form action="survey_form.html" method="get"><fieldset><legend>Evaluation Survey</legend>') //open form

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

		res.write("<input type='submit' value='Submit'></fieldset></form>")

	    }
	    
	    /* The reception office --- */
	    else if (name == 'survey_form'){

		var pend = f_append("surveys.txt")
		var queryData = url.parse(req.url, true).query;
		var arr = Object.keys(queryData)

		for (var i=0; i<arr.length; i++){
		    var k = arr[i]
		    pend(k+"~"+queryData[k])
		}
		pend("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
	    }
	    else if (name == 'info'){
		var lett = url.parse(req.url, true).query.letter
		res.write('<form action="'+lett+'survey.html" method="get">')
	    }

	/* ----The reception office */
	    
	    res.write(data)
	    if (name == 'info'){
		var lett = url.parse(req.url, true).query.letter
		res.write('<input type="hidden" name="letter" value="' + lett  + '">')
		res.write('<input type="hidden" name="date" value="'
			  + date_string(new Date())  + '"></form>')
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
