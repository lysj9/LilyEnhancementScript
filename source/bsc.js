var isNew = true;
var isIn = -1;
var p = document.getElementsByTagName("hr")[0];
var _sd;
var thisURL;
var nowC;
rewrite = function(str)
{
    var tmp="[";
    for(var i=0;!isNew && i<_sd.length;i++)
    {
        if( !_sd[i].hasOwnProperty('tl') ){
            _sd[i].tl = '';
        }
        tmp+="{u:'"+_sd[i].u+"',c:"+_sd[i].c+",r:"+_sd[i].r+",t:"+_sd[i].t+",tl:'"+_sd[i].tl+"'},";
    }
    if(str!="")
        tmp += str+",";
    if(tmp.length != 1)
    {tmp = tmp.substring(0,tmp.length-1)+"]";_sd = eval(tmp);isNew=false;}
    else
    {tmp="";isNew=true;}
    _s("m_info",tmp);
}
init_addThis = function()
{
    nowC = document.getElementsByTagName("center")[0].innerHTML;
    nowC = parseInt((nowC.match(/本主题共有 (.*?) 篇文章./))[1]);
    var tmp = _g("m_info");
    var Request=_QueryString();
    thisURL = "bbstcon?board="+Request["board"]+"&file="+Request["file"];
    if(tmp != '')
    {
        isNew = false;
        _sd = eval(tmp);
        for(var i=0;i<_sd.length;i++)
        {
            if(_sd[i].u==thisURL)
            {
                isIn = i;
                break;
            }
        }
        if(isIn!=-1)
        {
            _sd[isIn].c = nowC;
            _sd[isIn].r = 0;
            rewrite("");
        }
    }
    var td= document.createElement("a");
    td.href="javascript:;";
    if(isIn==-1)
    {
        td.innerHTML = "[回帖预定]";
        td.setAttribute("onclick","addThis(this)");
    }else
    {
        td.innerHTML = "[取消预定]";
        td.setAttribute("onclick","remThis(this)");
    }
    p.parentNode.insertBefore(td,p);
}
addThis = function(e)
{
    var _title = "";
    try{
        _title = bds_config['bdText'].replace('[From LilyBBS]','').replace('标 题: ','');
    }catch(e){}
    rewrite("{u:'"+thisURL+"',tl:'"+_title+"',c:"+nowC+",r:0,t:"+(new Date()).getTime()+"}");
    isIn = isIn==-1 ? -1 : _sd.length-1;
    e.innerHTML = "[取消预定]";
    e.setAttribute("onclick","remThis(this)");
}
remThis = function(e)
{
    _sd.splice(isIn,1);
    isIn = -1;
    rewrite("");
    e.innerHTML = "[回帖预定]";
    e.setAttribute("onclick","addThis(this)");
}
init_addThis();