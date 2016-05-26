function validateForm() {
    var lzt = ["age", "fullname"]
    for (var i in lzt){
	var x = document.forms["infoForm"][lzt[i]].value;
	if (x == null || x == "") {
            alert('Form is incomplete. Please fill out entirely');
            return false;
	}
    }
    return true
}
