var _init = [];
var _initd = false;
var _g = function(name) {
    var value=localStorage.getItem(name);
    return  ( value && (value != 'undefined') ) ? value : '';
}
var _s = function(n,v) {
    localStorage.setItem(n,v);
}
var _unique = function(a){
    var r = [],
        h={},
        i=0;
    for(;a[i];i+=1){
        if(!h[a[i]]){
           h[a[i]] = true;
           r[r.length] = a[i];
       }
    }
    return r;
}
var _getcookie = function(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return "";
}

var _QueryString = function()
{
    var res = {};
    var name,value,i;
    var str=location.href;
    var num=str.indexOf("?")
    str=str.substr(num+1);
    var arrtmp=str.split("&");
    for(i=0;i < arrtmp.length;i++){
        num=arrtmp[i].indexOf("=");
        if(num>0){
            name=arrtmp[i].substring(0,num);
            value=arrtmp[i].substr(num+1);
            res[name]=value;
        }
    }
    return res;

}

var _cache = {};
_tmpl = function(str, data){
    var fn = !/\W/.test(str) ? _cache[str] = _cache[str] || _tmpl(document.getElementById(str).innerHTML) :
    new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        "with(obj){p.push('" +
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
        + "');}return p.join('');");
    return data ? fn( data ) : fn;
};
(function() {
    var _arr = eval(_g('m_code'));

    var _result = [];
    var _push = function(i){
        if( i >= _result.length ){
            return;
        }
        var h = document.getElementsByTagName("head")[0] || document.documentElement;
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.textContent = _g("m_"+_result[i]);
        h.appendChild( s );

        if( _result[i] == 'jq' ){
            setTimeout(function(){
                _push(i+1);
            },120);
        }else{
            _push(i+1);
        }

    }
    for(var i=0;i<_arr.length;i++)
    {
        if(window.location.href.indexOf(_arr[i].t) > -1)
        {
            _result = _arr[i].s.split(".");
            break;
        }
    }

    _push(0);


})();