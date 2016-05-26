function validateForm() {
    var lzt = ["I have an increased knowledge and/or ability to access appropriate housing.", "I am more likely to pursue services and support available to me.", "I have a better understanding of how to manage resources."]
    for (var i in lzt){
	var x = document.forms["surveyForm"][lzt[i]].value;
	if (x == null || x == "") {
            alert('Form is incomplete. Please answer all questions up to the "optional" header');
            return false;
	}
    }
    return true
}
