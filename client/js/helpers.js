function checkHowManyThings(el,maxLength) {
    var ml = maxLength || 25;
    if(el.innerHTML.length > ml) {
        var br = document.createElement("br");
        insertAfter(br, el);
        var placeH = emptyPlaceholder(el.dataset.placeholder);
        insertAfter(placeH,br);
        var newL = newLine(el.dataset.placeholder);
        insertAfter(newL,placeH);
        newL.focus();
    }
    console.log(el.innerHTML.length);
}

function emptyPlaceholder(txt) {
    var temp = document.createElement("span");
    temp.innerHTML = txt;
    temp.className="titlething";
    temp.style.color="#A1C9E4";
    temp.style.userSelect="none";
    return temp;
}

function newLine(placeholder) {
    var temp = document.createElement("span");
    temp.className = "new_input";
    temp.setAttribute("contenteditable","true");
    temp.setAttribute("onkeyup","checkHowManyThings(this)");
    temp.setAttribute("data-placeholder",placeholder);
    return temp;
}