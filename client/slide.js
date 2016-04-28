function slide_ex(){ //extracts and returns the slide number
    var z = document.URL.split("/")
    return parseInt(z[z.length-1].split(".")[0].substring(1))
}

function forward_direct(max){ //max # of slides 
    var pot = slide_ex()+1
    if (pot < max) return 
