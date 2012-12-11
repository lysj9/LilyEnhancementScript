(function() {
    var name = _getcookie('_U_UID');
    if( name ){
        var h = document.getElementsByTagName("head")[0] || document.documentElement;
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "http://zhainan.lightory.net/count?n="+name;
        h.appendChild( s );
    }
})();
