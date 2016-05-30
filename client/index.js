function validateForm() {
    var lzt = ["age", "fullname"]
    for (var i in lzt){
	var x = document.forms["loginForm"][lzt[i]].value;
	if (x == null || x == "") {
            alert('Please enter you name and age before going to a presentation.');
            return false;
	}
    }
    return true
}
