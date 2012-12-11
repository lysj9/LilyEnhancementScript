var Colors = new Array("Black","Red","Green","Yellow","Blue","Purple","Indigo");
var BColors = new Array("000000","ff0000","008000","ffff00","0000ff","800080","4b0082");
var CColors = new Array("","1;31","1;32","1;33","1;34","1;35","1;36");
var emotion = [{"t":"2.gif","s":"[:s]" },{"t":"0.gif","s":"[:O]" },{"t":"3.gif","s":"[:|]" },{"t":"6.gif","s":"[:$]" },{"t":"7.gif","s":"[:X]" },{"t":"9.gif","s":"[:'(]" },{"t":"10.gif","s":"[:-|]" },{"t":"11.gif","s":"[:@]" },{"t":"12.gif","s":"[:P]" },{"t":"13.gif","s":"[:D]" },{"t":"14.gif","s":"[:)]" },{"t":"15.gif","s":"[:(]" },{"t":"18.gif","s":"[:Q]" },{"t":"19.gif","s":"[:T]" },{"t":"20.gif","s":"[;P]" },{"t":"21.gif","s":"[;-D]" },{"t":"26.gif","s":"[:!]" },{"t":"27.gif","s":"[:L]" },{"t":"32.gif","s":"[:?]" },{"t":"16.gif","s":"[:U]" },{"t":"25.gif","s":"[:K]" },{"t":"29.gif","s":"[:C-]" },{"t":"34.gif","s":"[;X]" },{"t":"36.gif","s":"[:H]" },{"t":"39.gif","s":"[;bye]" },{"t":"4.gif","s":"[;cool]" },{"t":"40.gif","s":"[:-b]" },{"t":"41.gif","s":"[:-8]" },{"t":"42.gif","s":"[;PT]" },{"t":"43.gif","s":"[;-C]" },{"t":"44.gif","s":"[:hx]" },{"t":"47.gif","s":"[;K]" },{"t":"49.gif","s":"[:E]" },{"t":"50.gif","s":"[:-(]" },{"t":"51.gif","s":"[;hx]" },{"t":"52.gif","s":"[:B]" },{"t":"53.gif","s":"[:-v]" },{"t":"54.gif","s":"[;xx]" }];
var UploadURL = "bbsupload?ptext=text&board=FOOD";
var FaceURL = "/editor/face.htm?ptext=text";
var Box = null;
var Editor = null;
var Conta,Contas;
var norep="";
var isEditor = false;
var Sys = {};
var ua = navigator.userAgent.toLowerCase();
var re =/(msie|firefox|chrome|opera|version).*?([\d.]+)/;
var m = ua.match(re);
var configs = null;
var reply_name = '';
var user_name = '';
var reply_borad = '';

Sys.firefox = m[1].replace(/version/, "'safari") == 'firefox';
fomt = function()
{
    var str = translate( jq(Editor.document).find("body").html() );

    var pics = [];
    jq("#drag_body .drag_item").each(function(i,k){
        pics.push( jq(k).find(".drag_hidden_url").val() );
        pics.push( jq(k).find("textarea").val() );
    });
    pics.push("");
    str = pics.join("\n\r") + str;
    str = paiban(str);
    jq("textarea").val(str);
    jq("textarea").text(jq("textarea").val());
}
Ret = function()
{
    isEditor = false;
    jq("tbody").find("tr:eq(3),tr:eq(4),tr:eq(5)").show();
    Conta.hide();
    Contas.hide();
    jq("input[name='autocr']").attr("checked","true");
    jq("textarea").attr("wrap","hard");
    fomt();
}
DiaClose = function(e)
{
    Box.remove();
    Box = null;
}
SelPanel = function(e,d)
{
    var Box = jq(e).parents(".bBox");
    Box.find(".bBoxTag").removeClass("bBoxTagS");
    jq(e).addClass("bBoxTagS");
    Box.find(".bBoxCT").hide();
    Box.find(".bBoxCT").eq(d).show();
}
AddPicture = function(e)
{
    AddFilter(jq(e).prev().val());
}
AddInfo = function(e,tag)
{
    format("InsertHTML", "["+tag+"]"+jq(e).prev().val()+"[/"+tag+"]");
}
AddFilter = function(str)
{
    str = str.replace(/\n/g,"");
    if(str.search(/http:\/\/(.*)(?:png|jpg|gif|jpeg)$/i)!=-1)
        format("InsertImage", str);
    else if(str.search(/http:\/\/(.*)(?:wma)$/i)!=-1)
        format("InsertHTML", "<br>[wma]"+str+"[/wma]");
    else if(str.search(/http:\/\/(.*)(?:swf)$/i)!=-1)
        format("InsertHTML", "<br>[flash]"+str+"[/flash]");
    else
        format("InsertHTML", str);
}
function format(type, para){
    var f = Editor;
    f.focus();
    if(!para)
        f.document.execCommand(type,false,false)
    else
        f.document.execCommand(type,false,para)
    f.focus();
}
init = function()
{
    isEditor = true;
    UploadURL = jq("a[href*=bbsupload]").attr("href");
    var str=jq("textarea").val();
    var st=str.search(/【 在 (.*?) 的大作中提到: 】/);
    norep = str.substring(st,str.length);
    reply_borad = jq("a[href*='board?board=']").text();
    //alert(norep);
    if(norep != '')
    {
        //alert(reply_borad);
        norep.replace(/ ([a-zA-Z0-9]*)? /,function(w,w1){
            reply_name = w1;
            return w;
        });

        user_name = jq("a[href*='board?board=']").parent("form").text();
        user_name = user_name.split("").reverse().join("");
        user_name.replace(/[a-zA-Z0-9]+/i,function(w){
            //user_name = w1;
            user_name = w;
            return w;
        });
        user_name = user_name.split("").reverse().join("");
        if(reply_name!= '' && reply_name != user_name)
        {
            var strc ="";
            if(configs['send'] == 1)
            {
                strc = "checked='true'";
            }
            jq("<span style='color:#ff0000'><input type=checkbox id=autoreply "+strc+">站内信通知 "+reply_name+"  </span>").insertBefore("input[type=submit]");
        }
    }

    jq("input[name='autocr']").removeAttr("checked");
    jq("textarea").attr("wrap","soft");
    jq("head").append("<link rel='stylesheet' type='text/css' href='http://bbs.nju.edu.cn/file/W/Warrior/style.css' />")
    jq("head").append("<script src='http://bbs.nju.edu.cn/file/W/Warrior/encode.js'></script>")
    jq("tbody").find("tr:eq(3),tr:eq(4),tr:eq(5)").hide();
    Contas = jq("<tr><td id='drag_body'><div id='drag_container' class='drag_container'>将本地图片从我的电脑或者桌面拖到浏览器中空白位置试试！</div></td></tr>");
    Contas.insertAfter(jq("tbody tr:eq(5)"));
    Conta = jq("<tr><td><div id='mF'><div id='mFL' class='bS'></div><div id='mFM'><div id='tB'><div class='btn'><div class='bS bBtn bBold' title='加粗'></div></div><div class='btn'><div class='bS bBtn bColor' more='true' title='文字颜色'></div><div class='BOnColor'></div></div><div class='btn'><div class='bS bBtn bClear' title='清除格式'></div></div><div class='btn'><div class='bS bBtn bSmile' title='添加表情'></div></div><div class='btn'><div class='bS bBtn bPic' title='插入图片'></div></div><div class='btn'><div class='bS bBtn bMusic' title='插入音乐'></div></div><div class='btn'><div class='bS bBtn bFlash' title='插入Flash'></div></div><div class='btn'><div class='bS bBtn bUser' title='链接用户'></div></div><div class='btn'><div class='bS bBtn bBoard' title='链接版面'></div></div><div class='bS bBack'></div></div></div><div id='mFR' class='bS'></div><div id='mFF'><div id='mFFF'></div></div></div></td></tr>");
    Conta.insertAfter(jq("tbody tr:eq(6)"));

    var ed=jq("<iframe frameborder=\"0\" id=\"WebEditor\" style=\"height: 320px;width:488px;background:#fff;\"></iframe>");
    jq("#mFFF")[0].appendChild(ed[0]);

    var maddF = Net.Form.addText;
    var maddS = Net.Form.clckcntr;
    function adT(a,b)
    {
        if(isEditor)
        {
            if(a=="text")
            {
                b = b.replace(/\n/g,"");
                if(b.indexOf('[')==0)
                    Editor.document.execCommand("insertImage", false, "/images/face/"+findEmotion(b,1,emotion));
                else
                {
                    AddFilter(b);
                }
            }else
                maddF(a,b);
            Editor.document.focus();
        }else
        {
            maddF(a,b);
        }
        return;
    }
    var deencode = function(gbk){
        if(!gbk){return '';}
        var utf8 = [];
        for(var i=0;i<gbk.length;i++){
            var s_str = gbk.charAt(i);
            if(!(/^%u/i.test(escape(s_str)))){utf8.push(s_str);continue;}
            var s_char = gbk.charCodeAt(i);
            var b_char = s_char.toString(2).split('');
            var c_char = (b_char.length==15)?[0].concat(b_char):b_char;
            var a_b =[];
            a_b[0] = '1110'+c_char.splice(0,4).join('');
            a_b[1] = '10'+c_char.splice(0,6).join('');
            a_b[2] = '10'+c_char.splice(0,6).join('');
            for(var n=0;n<a_b.length;n++){
                utf8.push('%'+parseInt(a_b[n],2).toString(16).toUpperCase());
            }
        }
        return utf8.join('');
    };
    function clkR()
    {   if(isEditor)
        {
            fomt();
        }
        if(norep!= '' && reply_name != '')
        {
            if(jq("#autoreply")[0].checked)
            {
                var title = user_name + UrlEncode('回复了您在[')+''+reply_borad+UrlEncode(']版发表的帖子');
                var content = user_name + UrlEncode('回复了您在[[brd]')+reply_borad+UrlEncode('[/brd]]')+UrlEncode('版发表的帖子:\n\r[')+UrlEncode(jq('input[name="title"]').val())+UrlEncode(']\n\r')+UrlEncode(jq('textarea[name="text"]').val())+'\r\r'+UrlEncode('站内信由百合辅助脚本自动发送 仅作提醒 毋回 谢谢～')+'\r';
                jq.ajax({
                    type:"POST",
                    async:false,
                    url: "bbssndmail?pid=0&userid=",
                    data: "title="+title + "&userid="+reply_name + "&signature=1&text="+content,
                    success: function(data, textStatus){
                        //alert(data);
                        return;
                    }
                });
            }
        }
        return;
    }
    Net.Form.addText = adT;
    Net.Form.clckcntr = clkR;
    jq(".bBtn").hover(function(){
        jq(this).addClass("bSelect");
    },function(){
        jq(this).removeClass("bSelect");
    });

    jq(".bBtn[more='true']").click(function()
    {
        releaseAll();
        jq(this).addClass("bOn").click(releaseAll).next().show();
    });
    jq(".bBold").click(function(){
        format("bold");
    });
    jq(".bSmile").click(function(){
        makeDialog("<div class='bBoxTT'><div class='close' onclick='DiaClose(this)'>[关闭面板 X]</div>"
        +"<div class='bBoxTag bBoxTagS' onclick='SelPanel(this,0)'>表情添加</div><div class='bBoxTag' onclick='SelPanel(this,1)' style='color:#ff0000'>兔斯基表情</div>"+
        "</div><div class='bBoxCT'><iframe name=\"fontpanel\" frameborder=\"0\" width=\"100%\" height=\"90\" src=\""+FaceURL+"\"/></div><div class='bBoxCT' style='display:none'><iframe name=\"fontpanel\" frameborder=\"0\" width=\"100%\" height=\"180\" src=\"http://bbs.nju.edu.cn/file/W/Warrior/tusiji.htm\"/></div>");
    });
    jq(".bClear").click(function(){
        format("RemoveFormat");
    });
    jq(".bPic").click(function(){
        makeDialog("<div class='bBoxTT'><div class='close' onclick='DiaClose(this)'>[关闭面板 X]</div>"
        +"<div class='bBoxTag bBoxTagS' onclick='SelPanel(this,0)'>上传图片</div><div class='bBoxTag' onclick='SelPanel(this,1)'>外网图片</div>"+
        "</div><div class='bBoxCT'><iframe name=\"fontpanel\" frameborder=\"0\" width=\"100%\" height=\"90\" src=\""+UploadURL+"\"/></div><div class='bBoxCT' style='display:none'>JPG,GIF,PNG格式！<input name=exp maxlength=80 size=50><input type=submit value='添加' onClick='AddPicture(this)'></div>");
    });
    jq(".bMusic").click(function(){
        makeDialog("<div class='bBoxTT'><div class='close' onclick='DiaClose(this)'>[关闭面板 X]</div>"
        +"<div class='bBoxTag bBoxTagS' onclick='SelPanel(this,0)'>上传音乐</div><div class='bBoxTag' onclick='SelPanel(this,1)'>外网音乐</div>"+
        "</div><div class='bBoxCT'><iframe name=\"fontpanel\" frameborder=\"0\" width=\"100%\" height=\"90\" src=\""+UploadURL+"\"/></div><div class='bBoxCT' style='display:none'>WMA,MP3格式！<input name=exp maxlength=80 size=50><input type=submit value='添加' onClick='AddPicture(this)'></div>");
    });
    jq(".bFlash").click(function(){
        makeDialog("<div class='bBoxTT'><div class='close' onclick='DiaClose(this)'>[关闭面板 X]</div>"
        +"<div class='bBoxTag bBoxTagS' onclick='SelPanel(this,0)'>上传Swf</div><div class='bBoxTag' onclick='SelPanel(this,1)'>外网文件</div>"+
        "</div><div class='bBoxCT'><iframe name=\"fontpanel\" frameborder=\"0\" width=\"100%\" height=\"90\" src=\""+UploadURL+"\"/></div><div class='bBoxCT' style='display:none'>SWF格式！<input name=exp maxlength=80 size=50><input type=submit value='添加' onClick='AddPicture(this)'></div>");
    });
    jq(".bBack").click(function(){
        Ret();
    });
    jq(".bUser").click(function(){
        makeDialog("<div class='bBoxTT'><div class='close' onclick='DiaClose(this)'>[关闭面板 X]</div>"
        +"<div class='bBoxTag bBoxTagS' onclick='SelPanel(this,0)'>用户ID</div>"+
        "</div><div class='bBoxCT'>输入用户ID！<input name=exp maxlength=80 size=30><input type=submit value='添加' onClick=\"AddInfo(this,'uid')\"></div>");
    });
    jq(".bBoard").click(function(){
        makeDialog("<div class='bBoxTT'><div class='close' onclick='DiaClose(this)'>[关闭面板 X]</div>"
        +"<div class='bBoxTag bBoxTagS' onclick='SelPanel(this,0)'>版面ID</div>"+
        "</div><div class='bBoxCT'>输入版面ID！<input name=exp maxlength=80 size=30><input type=submit value='添加' onClick=\"AddInfo(this,'brd')\"></div>");
    });
    for(var i=0;i<Colors.length;i++)
    {
        var s = jq("<div class='colorBox' style='background:"+Colors[i]+"' cl='"+Colors[i]+"'></div>");
        jq(".bColor").first().next().append(s);
        s.click(function(){
            releaseAll();
            format("ForeColor",jq(this).attr("cl"));
        });
    }
    Editor=ed[0].contentWindow;
    Editor.document.designMode = "on";
    Editor.document.open();
    Editor.document.write("<html><head><style type=\"text/css\">*{margin:0;font-size:14px;font-family:宋体;line-height:18px;}</style></head><body topmargin='0px' leftmargin='0' rightmargin='0' bottommargin='0' style='word-wrap:break-word;word-break:break-all;'></body></html>");
    Editor.document.close();
}
paiban = function(str)
{
    var maxLength = 77;
    var escape = 'iwf';
    var es2 = ':;cb';
    var sz=0;
    var newStr="";
    var isIn = 0;
    var flag = true;
    var ot = true;
    var isURL = true;
    for(var i=0;i<str.length;i++)
    {
        if(flag && isURL && sz>maxLength)
        {
            newStr+='\r';
            sz=0;
        }
        if(str[i]=='[')
        {
            if(escape.indexOf(str[i+1])!=-1)
            {
                flag = false;
                newStr+=str[i];
                isIn++;
                i++;
                ot = false;
            }else if(es2.indexOf(str[i+1])!=-1)
            {
                var fg = str[i+1] != 'c';
                while(str[i]!=']')
                {
                    newStr += str[i];
                    if(fg)
                        sz++;
                    i++;
                }
            }else if(str[i+1]=="/")
            {
                isIn--;
                newStr+=str[i];
                i++;
                ot = false;
            }
        }else if(str[i]==']')
        {
            if(isIn==0)
                flag = true;
            ot = true;
        }else if(str[i]== '\n' || str[i]=='\r')
        {
            sz=0;
            isURL = true;
        }else if(str[i]=='h' && str[i+1]=='t' && str[i+2]=='t' && str[i+3]=='p')
        {
            if(i!=0 && str[i-1]!='\r' && str[i-1]!=']')
            {
                newStr+='\r';
                sz=0;
            }
            newStr+="http";
            i+=4;
            isURL = false;
        }else if(str[i] ==' ')
        {
            isURL = true;
        }
        if(ot)
            sz+= (str[i].replace(/[^\x00-\xff]/g, "** ").length >1 ? 2:1);
        newStr+=str[i];
    }
    if(!isURL)
        newStr += '\r';
    newStr = newStr.replace(/\[c=(.*?)\]/gi,function(w,w1){
        w1 = w1.toLowerCase();
        for(var i=0;i<Colors.length;i++)
        {
            if(w1 == Colors[i].toLowerCase())
            {
                return "\033["+CColors[i]+"m";
            }
        }
        return w;
    });
    newStr = newStr.replace(/\[\/c\]/gi,"\033[m");

    if(true)
    {
        var inB = 0;
        var aNew = '';
        for(var i=0;i<newStr.length;i++)
        {
            if(newStr[i] == '[' )
            {
                aNew+=newStr[i];
                if(newStr[i+1] == 'b')
                {
                    inB = inB + 1;
                }
                else if(newStr[i+1] == '\\' || newStr[i+1] == '/')
                    inB = inB - 1;
                i++;
                aNew+=newStr[i];
            }else if(newStr[i] == '\r')
            {
                if(inB > 0)
                {
                    aNew += '[\/b]\r[b]';
                }else
                    aNew += newStr[i];
            }else
            {
                aNew += newStr[i];
            }
        }
        newStr = aNew;
    }
    newStr = newStr.replace(/[\r]*\[\/b\]/gi,"[\/b]");
    newStr = newStr.replace(/\[b\]\[\/b\]/gi,"");
    newStr = newStr.replace(/\[img\]/gi,"").replace(/\[\/img\]/gi," ");
    if(norep!="")
    {
        if(configs['reply'] == 0)
        {
            newStr += "\n" + norep;
            return newStr;
        }
        if(newStr.charAt(newStr.length) == " " || newStr.charAt(newStr.length) == "\n")
            newStr = newStr.substring(0,newStr.length);
        if(sz <= 48)
            newStr += (" " +norep);
        else
            newStr += "\n " + norep;
    }
    return newStr;
}
releaseAll = function()
{
        jq(".bOn").each(function(i){
            jq(this).next().hide();
            jq(this).removeClass("bSelect").removeClass("bOn");
            jq(this).click(function()
            {
                releaseAll();
                jq(this).addClass("bOn").click(releaseAll).next().show();
            });
        });
};
makeDialog = function(Str)
{
        if(Box != null)
        {
            Box.remove();
        }
        Box = jq("<div class='bBox'>"+Str+"</div>");
        Box.css("top","30%");
        Box.css("left","50%");
        jq("body").append(Box);
        Box.css("margin-top",- Box[0].offsetHeight / 2 + "px");
        Box.css("margin-left",- Box[0].offsetWidth / 2 + "px");

        Box.draggable({handle:'.bBoxTT'});
};
translate = function(bbcodetext)
{
    bbcodetext = bbcodetext.replace(/&nbsp;/gi, " ");
    bbcodetext =  bbcodetext.replace(/<img src=\"\/images\/face\/([^\"]*)\">/g,function(w,w1){
        emo = findEmotion(w1,0,emotion);
        if(emo!=w1)
            return emo;
        return w;
    });

    bbcodetext = bbcodetext.replace(/ = /gi, "=");
    bbcodetext = bbcodetext.replace(/=\"/gi, "=");
    bbcodetext = bbcodetext.replace(/=\'/gi, "=");
    if(!Sys.firefox)
    {
        bbcodetext = bbcodetext.replace(/<([^ ]*?)span([^<>]*)>/gi,"");
        bbcodetext = bbcodetext.replace(/ style=[^\"]*\"/gi, "");
    }
    else
    {
        var spanF = new Array();
        bbcodetext = bbcodetext.replace(/<([^ >]*?)span([^>]*?)>/gi, function(w,w1,w2)
        {
            try
            {
                if(w1 == "/"){return spanF.pop();}
                else
                {
                    var s1="",s2="";
                    if(w2.indexOf("bold")!=-1)
                    {
                        s1+="[b]";s2+="[/b]";
                    }
                    if(w2.indexOf("color")!=-1)
                    {
                        s1+= "[c="+(w2.match(/color: (.*?);/i))[1]+"]";s2 = "[/c]"+s2;
                    }
                    spanF.push(s2);
                    return s1;
                }
            }
            catch (e)
            {return w}
        });
    }
    bbcodetext = bbcodetext.replace(/<BR>/gi, "\r");
    bbcodetext = bbcodetext.replace(/<BR(.*?)\/>/gi, "\r");
    bbcodetext = bbcodetext.replace(/<P>/gi, "\r");
    bbcodetext = bbcodetext.replace(/<P [^>]*>/gi, "\r");
    bbcodetext = bbcodetext.replace(/<DIV>/gi, "\r");
    bbcodetext = bbcodetext.replace(/<DIV [^>]*>/gi, "\r");
    bbcodetext = bbcodetext.replace(/<IMG[\s\S]*?SRC=([\s\S]*?)\"[\s\S]*?>/gi, "[img]$1[\/img]");
    bbcodetext = bbcodetext.replace(/<IMG[\s\S]*?SRC=([\s\S]*?)'[\s\S]*?>/gi, "[img]$1[\/img]");
    bbcodetext = bbcodetext.replace(/<BIG>/gi, "[b]");
    bbcodetext = bbcodetext.replace(/<\/BIG>/gi, "[/b]");
    bbcodetext = bbcodetext.replace(/<STRONG>/gi, "[b]");
    bbcodetext = bbcodetext.replace(/<\/STRONG>/gi, "[/b]");
    bbcodetext = bbcodetext.replace(/<B>/gi, "[b]");
    bbcodetext = bbcodetext.replace(/<\/B>/gi, "[/b]");
    bbcodetext = bbcodetext.replace(/<FONT(.*?)color=/gi, "[c=");
    bbcodetext = bbcodetext.replace(/ STYLE=[^\'\">]*[\'\">]/gi, "");
    bbcodetext = bbcodetext.replace(/ color=/gi, "][c=");
    bbcodetext = bbcodetext.replace(/<\/FONT>/gi, "[/c]");


    bbcodetext = bbcodetext.replace(/<TR[^>]*>/gi, "\r");
    bbcodetext = bbcodetext.replace(/<TD[^>]*>/gi, " ");
    bbcodetext = bbcodetext.replace(/<TH[^>]*>/gi, " ");

    bbcodetext = bbcodetext.replace(/<\/TR>/gi, " ");
    bbcodetext = bbcodetext.replace(/<\/TD>/gi, " ");
    bbcodetext = bbcodetext.replace(/<\/TH>/gi, " ");

    bbcodetext = bbcodetext.replace(/<[^>]*>/g, "");
    bbcodetext = bbcodetext.replace(/;\">/g, "]");
    bbcodetext = bbcodetext.replace(/>/g, "]");
    bbcodetext = bbcodetext.replace(/\'>/g, "]");
    bbcodetext = bbcodetext.replace(/\">/g, "]");
    bbcodetext = bbcodetext.replace(/\']/g, "]");
    bbcodetext = bbcodetext.replace(/\"]/g, "]");

    if(Sys.firefox)
    {

        var colorF = new Array();
        var lastF = "";
        bbcodetext = bbcodetext.replace(/\[([^c]{0,1})c(.*?)\]/gi, function(w,w1,w2)
        {
            if(w1=="/")
            {
                if(colorF.length>0)
                    w+= colorF.pop();
                else
                    lastF="";
                return w;
            }else
            {
                var tmp = w;;
                if(lastF!="" || colorF.length!=0)
                {
                    tmp =  "[/c]"+tmp;
                }
                if(lastF!="")
                {
                    colorF.push(lastF);
                }
                lastF = w;
                return tmp;
            }
        });

        bbcodetext = bbcodetext.replace(/\[c=([^\]]*?)\]\[\/c\]/gi, "");
        bbcodetext = bbcodetext.replace(/<\/SPAN>/gi, "[/c]");
    }

    bbcodetext = bbcodetext.replace(/\[c(.*?)\]/gi,function(w,w1){
        if(w1.indexOf("#")==-1)
            return w;
        else
        {

            w1 = w1.toLowerCase();
            for(var i=0;i<BColors.length;i++)
            {
                if(w1.indexOf(BColors[i]) != -1)
                {
                    return "[c="+Colors[i]+"]";
                }
            }
            return w;
        }
    });
    return bbcodetext;
}
function findEmotion(c,od,e)
{
    if(od==1)
        for(i=0;i<e.length;i++)
        {
            if(e[i].s == c)
                return e[i].t;
        }
    else
        for(i=0;i<e.length;i++)
        {
            if(e[i].t == c)
                return e[i].s;
        }
    return c;
}


var DragClass = function(){
    var DOM = {
        'body' : jq("#drag_body"),
        'container' : jq("#drag_container"),
        'hand' : jq(document.body)
    }

    var FileLists = [];
    var FileCount = 0;
    var FileInUpload = false;

    var dropHandler = function(e) {
        //将本地图片拖拽到页面中后要进行的处理都在这
        e.preventDefault();
        //获取文件列表
        var fileList = e.dataTransfer.files;
        //检测是否是拖拽文件到页面的操作
        if (fileList.length == 0) {return;};
        for (var i = 0, f; f = fileList[i]; i++) {
            //检测文件是不是图片
            if (fileList[i].type.indexOf('image') === -1) {continue;}
            FileLists.push(fileList[i]);
        }
        if(!FileInUpload){
            processFile();
        }


    }



    var processFile = function(){
        FileInUpload = true;
        if( FileCount >= FileLists.length ){
            FileInUpload = false;
            return;
        }

        //实例化file reader对象
        var reader = new FileReader();
        var fcount = FileCount;

        FileCount++;

        var item = jq('<div class="drag_item" id="'+FileCount+'"><input type="hidden" class="drag_hidden_url"/><img src="" width=80 height=80/><textarea placeholder="在这里输入对图片的描述" class="drag_text"></textarea><div class="drag_right_ctrl"><p><span class="drag_status">[上传中]</span></p><span><a href="###" onclick="return mbbs_drag.deletes(this);">[删除]</a></span></div></div>');

        item.insertBefore(DOM['container']);

        reader.onload = function(e) {
            item.find("img")[0].src= this.result;
        }

        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && xhr.status == 200) {
                var content = xhr.responseText.replace(/[\n\r]/ig,'');
                var arr = /url=([^\']*)/ig.exec(content);
                if( arr ){
                    jq.get(arr[1],function(data){
                        data = data.replace(/[\n\r]/ig,'');
                        var arr = /name=([^\']*)/ig.exec(data);
                        if(arr){
                            item.find(".drag_hidden_url").val('http://bbs.nju.edu.cn/file/'+reply_borad+'/'+ arr[1])
                            item.find(".drag_status").html('<a href="'+'http://bbs.nju.edu.cn/file/'+reply_borad+'/'+ arr[1]+'" target=_blank>[预览]</a>');
                        }else{
                            item.find(".drag_status").text("上传失败！");
                        }
                    })
                }else{
                    item.find(".drag_status").text("上传失败！");
                }
            }else{
            }
        };
        xhr.open("post", "bbsdoupload", true);
        //异步请求
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        //上传完毕事件

        xhr.addEventListener("load",
            function(e) {
                processFile();
            },
        false);

        var fd = new FormData();
        fd.append('up', FileLists[fcount]);
        fd.append('exp', "");
        fd.append('ptext', "");
        fd.append('board', reply_borad);


        reader.readAsDataURL(FileLists[fcount]);



        xhr.send(fd);
    }

    var dragleaveHandler = function(e){

    }
    var init = function(){

        //拖进
        DOM['hand'][0].addEventListener('dragenter', function(e) {
            e.preventDefault();
        }, false);

        //拖离
        DOM['hand'][0].addEventListener('dragleave', function(e) {
            dragleaveHandler(e);
        }, false);

        DOM['hand'][0].addEventListener('dragover', function(e) {
            e.preventDefault();
        }, false);

        //扔
        DOM['hand'][0].addEventListener('drop', function(e) {
            dropHandler(e);
        }, false);


        DOM['body'].sortable({ items: '.drag_item' });
    }
    var deletes = function(e){
        jq(e).parents(".drag_item").remove();
    }

    return {
        init : init,
        deletes : deletes
    }
}








var post_init = function(){
    c = _g('m_configs');
    configs = jq.extend({},{'gender':1,'menu':1,'reply':1,'send':0},eval(c!='' ? '('+c+')' : ''));
    init();

    dg = new DragClass();
    dg.init();

    window.mbbs_drag = dg;
}
//if( _initd ){
    post_init();
//}else{
//    _init.push(function(){
//       post_init();
//   })
//}