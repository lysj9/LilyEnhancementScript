(function() {
    try{
        if(_dontNeedCheck){
            return;
        }
    }catch(e){}

    var _file="[{t:'bbstcon?',s:'jq.share.view.bsc'},{t:'bbscon?',s:'jq.share'},{t:'bbspst?',s:'jq.bbstd'},{t:'bbsfoot',s:'ft'},{t:'bbsleft',s:'left'},{t:'bbsqry?',s:'jq.bbsqry'}]";
    var _arr = eval(_file);
    var _v = '20120908';
    var _download = [];

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

    var _startall = function(){
        var h = document.getElementsByTagName("head")[0] || document.documentElement;
        var s = document.createElement("script");
        s = document.createElement("script");
        s.type = "text/javascript";
        s.textContent = _g("m_start");
        h.appendChild( s );
    }

    var _up = function(i)
    {
        if(i>=_download.length)
        {
            _s('m_v',_v);
            _s('m_t',+new Date());
            _startall();
            return;
        }
        request = new XMLHttpRequest();
        request.overrideMimeType('text/xml');
        request.open('GET', "http://bbs.nju.edu.cn/file/W/Warrior/"+_download[i]+".min.js", true);
        request.setRequestHeader("If-Modified-Since","0");
        request.setRequestHeader("Cache-Control","no-cache");
        request.send(null);
        request.onreadystatechange = function(){
            if (request.readyState == 4){
                if(request.status == 200){
                    _s("m_"+_download[i],request.responseText);
                }
                request.onreadystatechange = null;
                setTimeout(function(){
                    _up(i+1);
                },100);
            }
        };
    }

    _download.push('start');
    for(var id=0; id < _arr.length; id++)
    {
        var ar = _arr[id].s.split(".");
        for(var ic=0; ic < ar.length ; ic++)
        {
            _s('m_'+ar[ic],'');
            _download.push(ar[ic]);
        }
    }
    _s('m_v','');
    _s('m_t','');
    _s('m_code',_file);
    _download = _unique(_download);
    _up(0);

})();

