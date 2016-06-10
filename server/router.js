//This is for creating all the websites, besides the hard coded page material

//Client side js is for sending requests back to this router, or dynamically chaning the view

var sys = require('sys')

var exec = require('child_process').exec;

function puts(error, stdout, stderr) { sys.puts(stdout) }

function date_string(dt){
    return dt.getFullYear() +"/"+ ("0" + (dt.getMonth()+1)).slice(-2) +"/"+
	("0" + dt.getDate()).slice(-2)
}

var http = require('http'),
    url = require('url'),
    fs = require('fs');

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
    
    console.log('\n'+name)

    function basic(err, data) { //most simple reader function
	if (err) return console.log(err)

	if (typeof(data) != "undefined")
	    res.end(data)
    }

    //standard treatment
    readF = basic
    final_path = './client'+path    

    //special treatment
    if (name+'.'+xten == 'beginSlides.x'){

	var queryData = url.parse(req.url, true).query;
	var file
	if (queryData['energy'] == '' || queryData['energy'] == null){
	    file = 'h'
	} else {
	    file = 'e'
	}

	f_append("data/infos.txt")(queryData.fullname+" "+queryData.age+" "+file+" "+queryData.date)//flashy

	name = file+'0'
	xten = 'html'
	var fname = name+'.'+xten
	final_path = "client/"+fname
	res.setHeader("Location", fname)
    }

    if (xten == 'html'){

	function include(url) { //function to include a script to the html file
	    res.write('<script src="'+url+'"> </script>')
	}

	function seize(url) { //function to include a css file to the html
	    res.write('<link rel="stylesheet" type="text/css" href="'+url+'">')
	}

	readF = function(err, data) { //the official html reader function
	    var id = name.substring(0,1)
	    var rest = name.substring(1) //name(minus 1st char) 
	    var slideNum = parseInt(rest) //is parseable into a number
	    var isSlide = ! isNaN(slideNum)

	    res.writeHead(200, { 'Content-Type': "text/html" });
	    res.write('<!DOCTYPE html>')
	    var targ = (name == 'index' || rest == 'survey')?'_self':'_blank'
	    res.write('<html><head><base href="/" target="'+targ+'">')

	    if (rest == "source"){
		slideNum = -1
		isSlide = true
		var sources
		if (id == 'e'){
		    sources = ["http://www.kub.org/wps/portal/Customers/Home/MoneySavingTips", "http://www.data360.org/dsg.aspx?Data_Set_Group_Id=757","http://energy.gov/energysaver/adding-insulation-existing-home",  "https://www.energystar.gov/"]
		} else {
		    sources = ["http://www.futureinhumanity.org/homeless-facts/?gclid=CLeZmPGn9swCFVclgQodPlcL_g", "http://portal.hud.gov/hudportal/HUD?src=/program_offices/comm_planning/affordablehousing/", "https://www.hudexchange.info/programs/home/home-laws-and-regulations/", "http://www.ebho.org/resources/looking-for-housing/steps-to-find-affordable-housing"]
		}

		data = "<h2> Sources: </h2><br/><p>"
		var src
		for (var i in sources){
		    src = sources[i]
		    data += '<a href="'+src+'">'+src+"</a><br/><br/>"
		}
		data += "</p>"
	    }

	    

	    var e = (id.localeCompare("e") == 0) //is it an energy slide?

	    var l_arrow
	    var r_arrow
	    var l_banner
	    var r_banner
	    if (e){
		l_arrow = "'left_arrow.jpg'"
		r_arrow = "'right_arrow.jpg'"
		l_banner = "'left_banner.jpg'"
		r_banner = "'right_banner.jpg'"
	    } else {
		l_arrow = "'turq_left.png'"
		r_arrow = "'turq_right.png'"
		l_banner = r_banner = "'blurk.png'"
	    }

	    var pages = e? 4:4 //energy slides, housing
	    if (isSlide) seize(id+".css") //each slide show has own css, each slide corresponds to a letter
	    else seize('home.css') //# needz to change

	    res.write('</head><body><title>Americore Education Program</title>')
	    //	    include('http://code.jquery.com/jquery-1.11.1.min.js')

	    if (isSlide){ 

		//LEFT!!!
	    	var murl //for the back arrow

	    	if (slideNum > 0){
	    	    murl = id + (slideNum-1).toString()
	    	} else if (slideNum == 0){
	    	    murl = 'index'
	    	} else { //source page
		    murl = id + pages.toString()
	    	}
	    	res.write("<div class='left'>")
	    	res.write("<a  href='" + murl + ".html'"+' target="_self"><img class="left_butt" src='+l_arrow+"></a>");//have a back redirect
		res.write("<img src="+l_banner+" class='l_banner' >")
		res.write("</div>")

		//RIGHT!!!

		if (slideNum == -1){ //source
		    murl = id+"survey.html"
		} else if (slideNum < pages) {
		    murl = id + (slideNum+1).toString() + '.html'
		} else {
		    murl = id+"source.html"
		}

		res.write("<div class='right'>")
		res.write('<a  href="' + murl + '" target="_self"><img class="right_butt" src='+r_arrow+'></a>');//have a forward redirect		    
		res.write("<img src="+r_banner+" class='r_banner' >")
		res.write("</div>")

		//MIDDLE!!! (content)
		res.write("<div class='text'>")
		if (typeof(data) == "undefined")
		    data = "<h3> Problem loading page. </h3>"
		else
		    res.write(data)
		res.write("</div>")
		res.end("</body></html>")
		return
	    }

	    else if (name.substring(1).localeCompare("survey") == 0){

		var yni = ["Yes", "No", "Indifferent"];

		function qw(q, ops){//Que write
		    var butts = ""//button code
		    for (var i=0; i<ops.length; i++){
			butts = butts.concat("<input type=\"radio\" name=\"" + q + "\" value=\"" + ops[i] + "\"> " + ops[i] + "<br>")
		    }
		    var retstr = "<p class=\"surv\">" + q + '<br>' + butts + "</p>"
		    res.write(retstr)
		    return
		}
		
		res.write('<form name="surveyForm" action="survey_form.html" method="get" onsubmit="return validateForm()" ><fieldset><legend>Evaluation Survey</legend>') //open form

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

		res.write("<h3> The remaining questions are optional: </h3>")

		//about yourself (optional) (and the same for each survey)
		qw("Gender:", ["Female", "Male"])
		qw("I live in a:", ["Rural Area", "Urban Area"])
		qw("Income Level:", ["Low", "Moderate", "High"])
		qw("Education Level:", ["Did Not Graduate High School",
					"High School Graduate / GED", 
					"College Degree or Higher"])

		res.write('<input type="hidden" name="lett" value='+id+'>')
		res.write("<input type='submit' value='Submit'></fieldset></form>")
	    }
	    
	    else if (name == 'survey_form'){

		var pend = f_append("data/surveys.txt")
		var queryData = url.parse(req.url, true).query;
		var arr = Object.keys(queryData)

		for (var i=0; i<arr.length; i++){
		    var k = arr[i]
		    pend(k+"~"+queryData[k])
		}
		pend("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

	    }
	    
	    if (name.substring(1).localeCompare("survey") != 0) {
		if (typeof(data) == "undefined")
		    data = "<h3> Problem loading page. </h3>"
		else
		    res.write(data)
	    } //ugggleh
	    if (name == 'index'){
		res.write('<input type="hidden" name="date" value="'
			  + date_string(new Date())  + '"></form></div>')
	    }

	    else if (name == 'survey_form'){
		var queryData = url.parse(req.url, true).query;
		var lett = (queryData['lett']=='e')?'h':'e'
		var tx = (lett=='e')?'Energy conservation':'Affordable housing'
		res.write('<br><button type="button" onClick="window.location = '+"'"+lett+"0.html'"+'"> Start </button>'+
			  tx +' presentation</p>')
	    }
			    
	    if (rest == 'survey')
		include(name+'.js')

	    else if (name == 'index')
		include('index.js')
	    
	    res.end("</body></html>")
	}
    }

    if (xten == 'css')
	res.writeHead(200, { 'Content-Type': "text/css" });

    //test this
    if (/(jpg|jpeg|png|gif)/.test(xten))
	final_path = "./img"+path
    
    fs.readFile(final_path, readF)
}

function launch(port){
    http.createServer(route).listen(port) //, 'localhost')
    console.log('Server running on '+port+'.')
}

launch(8888)
