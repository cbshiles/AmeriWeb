function validateForm() {
    var lzt = ["I can now easily identify ways to save energy in my daily life.", "I understand and can explain how saving energy can reduce my environmental footprint.", "I am more likely to modify my behavior to improve energy efficiency.", "Being environmentally conscious improves the environment."]
    for (var i in lzt){
	var x = document.forms["surveyForm"][lzt[i]].value;
	if (x == null || x == "") {
            alert('Form is incomplete. Please answer all questions up to the "optional" header');
            return false;
	}
    }
    return true
}


