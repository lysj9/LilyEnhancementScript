var p;
var _sd;
var HasNew = false;
init = function()
{

    var h = document.getElementsByTagName("head")[0] || document.documentElement;
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src="http://bbs.nju.edu.cn/file/W/Warrior/playmp3.js";
    h.appendChild(s);
    p = document.getElementsByTagName("td")[0];
    if( _getcookie('_U_UID') != '' ){
        p.innerHTML += "  [<a target='f3' href='file/W/Warrior/timeline.html'>时间轴(<font color='#FF4700'>new</font>)</a>]";
    }
    p.innerHTML += "  [<a target='f3' href='file/W/Warrior/review.htm'>回帖预定</a>";
    if(_g("m_info")!='')
    {
        HasNew = true;
        _sd=eval(_g("m_info"));
        setTimeout(function(){getAjax(0)},100);
    }else
    {
        p.innerHTML += "]";
    }
}
rem = function(e,i)
{
    e.parentNode.removeChild(e);
}
rewrite = function()
{
    var tmp="";
    if(_sd.length!=0)
    {
        var tmp="[";
        var jian  = (new Date()).getTime() - 1000*60*60*24*3;
        for(var i=0;i<_sd.length;i++)
        {
            if( !_sd[i].hasOwnProperty('tl') ){
                _sd[i].tl = '';
            }
            if(_sd[i].r == 1 || _sd[i].t > jian)
            {tmp+="{u:'"+_sd[i].u+"',c:"+_sd[i].c+",r:"+_sd[i].r+",t:"+_sd[i].t+",tl:'"+_sd[i].tl+"'},";}
        }
        if(tmp.length != 1)
        {tmp = tmp.substring(0,tmp.length-1)+"]";}
        else
        {tmp="";}
        _s("m_info",tmp);
    }
}
_SHO =function()
{
    rewrite();
    var newMessage = false;
    if(HasNew)
    {
        for(var i=0;i<_sd.length;i++)
        {
            if(_sd[i].r==1)
            {p.innerHTML += "<a target='f3' href='"+_sd[i].u+"&start=-1' class='FontStyle3' onclick='rem(this,"+i+")'> 帖子"+i+"</a>";newMessage=true;}
        }
    }
    p.innerHTML += "]";
    var d = document.createElement("div");
    d.id='play';
    d.style="display:inline;width:10px;position:absolute;"
    d.innerHTML += " ";
    document.getElementsByTagName("td")[0].appendChild(d);
    if(newMessage)
    {
        _notify();
        playmp3(d);
    }
}
getAjax = function(current)
{
    if(current >= _sd.length)
    {_SHO();return;}
    try
    {
        request = new XMLHttpRequest();
        request.overrideMimeType('text/xml');
        request.open('GET', _sd[current].u, true);
        request.send(null);
        request.onreadystatechange = function()
        {
            if (request.readyState == 4)
            {
                if(request.status == 200)
                {
                    var str = request.responseText;
                    try
                    {
                        var st = parseInt((str.match(/本主题共有 (.*?) 篇文章./))[1]);
                        if(st > _sd[current].c)
                        {
                            _sd[current].c = st;
                            _sd[current].r = 1;
                        }
                    }
                    catch (err)
                    {
                        _sd[current].t = 0;//帖子被删除了
                        _sd[current].r = 0;
                    }

                }
                request.onreadystatechange = null;
                setTimeout(function(){getAjax(current+1)},200);
            }
        };
    }
    catch (error)
    {}
}

var _notify = function(){
    if(window.webkitNotifications){
      if (window.webkitNotifications.checkPermission() > 0) {
        _requestPermission(_notify);
      } else {
        var notification=webkitNotifications.createNotification(
            'http://bbs.nju.edu.cn/images/bbs.gif',
            '小百合BBS',
            '新回复！'
        );
        notification.show();
      }
    }
}

var _requestPermission = function(callback) {
  window.webkitNotifications.requestPermission(callback);
}
init();