function yHandler(){
    var wrap = document.getElementById('wrap');
    var contentHeight = wrap.offsetHeight;
    var yOffset = window.pageYOffset;
    var y = yOffset + window.innerHeight;

        if (y >= contentHeight){
            wrap.innerHTML +='<div class = "newData"></div>'
        }
        var status = document.getElementById('status');
        status.innerHTML = contentHeight + " | " + y;
}
window.onscroll = yHandler;