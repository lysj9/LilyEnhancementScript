Date.prototype.format = function(format){
    /*
    * format="yyyy-MM-dd hh:mm:ss";
    */
    var o = {
        "M+" : this.getMonth() + 1,
        "d+" : this.getDate(),
        "h+" : this.getHours(),
        "m+" : this.getMinutes(),
        "s+" : this.getSeconds(),
        "q+" : Math.floor((this.getMonth() + 3) / 3),
        "S" : this.getMilliseconds()
    }

    if (/(y+)/.test(format)){
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4- RegExp.$1.length));
    }

    for (var k in o){
        if (new RegExp("(" + k + ")").test(format)){
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}




var TimeLine = function(){

    var DOM = {
        body : jq('#timeline'),
        next : jq("#next"),
        header : jq('#header'),
        spinner : jq('#Spinner')
    }
    var CFG = {
        src : 'http://zhainan.lightory.net/'
    }
    var VAR = {
        usr : 'Warrior',
        laststamp : '',
        count : 0
    }
    var DATA = {
        item : {d:"",v:0}
    }

    var cache = {};
    var tmpl = function(str, data){
        var fn = !/\W/.test(str) ? _cache[str] = _cache[str] || tmpl(document.getElementById(str).innerHTML) :
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
    var sexytime = function(timestamp){
        var now = +new Date() / 1000;
        var diff = now - timestamp;
        if(diff < 60){
            return Math.floor(diff)+'秒 前';
        }else if(diff < 3600){
            return Math.floor(diff/60)+'分钟 前';
        }else if(diff < 3600*24){
            return Math.floor(diff/3600)+'小时 前';
        }else{
            return new Date(timestamp*1000).format("MM-dd hh:mm");
        }
    }
    var getcookie = function(c_name){
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
    var template = ['<li class="<%=direction%>"><i class="pointer"></i><div class="unit">',
                    '<div class="storyUnit"><div class="imageUnit">',
                    //'<a href="#"><img src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-snc4/186035_897940273_1597318_q.jpg" width="32" height="32" alt=""></a>',
                    '<div class="imageUnit-content"><h4><a href="#"><%=title%></a></h4><p><%=time%></p></div>',
                    '</div><%=content%></div><% if(op!= ""){%><ol class="storyActions">',
                    '<li><a href="#"><%=op%></a></li>',
                    '</ol><%}%></div></li>'].join('');


    var build_template = function(data,i){
        var VARS = {
            direction: (VAR.count %2 == 0) ? 'left' : 'right',
            //title : VAR.usr,
            //desc: build_title(data[i]['item']),
            time: sexytime(data[i]['stamp'])
        };


        if( /[a-zA-Z_0-9]+\d{10}/.test(data[i]['item']) ){
            //thread
            var arr = /([a-zA-Z_0-9]+)(\d{10})/.exec(data[i]['item']);
            VARS['title'] = ['我觉得 ',arr[1],' 版的这个帖子不错'].join('');
            VARS['content'] = ( data[i].hasOwnProperty('content') && data[i]['content'] != "" ) ? data[i]['content'] : "";
            VARS['content'] += "....";
            VARS['op'] = ['<a target="_blank" href="../../../bbscon?board=',arr[1],'&file=M.',arr[2],'.A">帖子正文</a>'].join('');
        }else{
            VARS['title'] = VAR.usr;
            if( data[i]['item'] == 'ragnarokthenighttool' ){
                VARS['content'] = '<p>我觉得 时间轴 挺靠谱</p>';
                VARS['op'] = "";
            }else{
                VARS['content'] = ['<p>我觉得 ',data[i]['item'],' 挺靠谱</p>'].join('');
                VARS['op'] = ['<a target="_blank" href="../../../bbsqry?userid=',data[i]['item'],'">用户资料</a>'].join('');
            }

        }


        return tmpl(template,VARS);
    }
    var loadPage = function(){
        if( VAR.usr == '' ){
            return;
        }
        var url = CFG.src + 'usr?u=' + VAR.usr;

        jq(window).unbind('scroll.posts');
        DOM.spinner.show();

        if( VAR.laststamp != '' ){
            url += '&t=' + VAR.laststamp;
        }
        jq.ajax({
             url: url,
             dataType:"jsonp",
             jsonp:"jsonpcallback",
             success:function(data){
                for(var i=0;i<data.length;i++){
                    var html = build_template(data,i);
                    DOM.body.append(html);
                    VAR.count += 1;
                    VAR.laststamp = data[i]['stamp'];
                }

                if(data.length == 20){
                    DOM.spinner.hide();
                    jq(window).bind('scroll.posts',scrollEvent);
                }else{
                    DOM.spinner.html('<p>没有更多的内容啦</p>');
                }

             }
        });
    }


    var build_tid_like_desc = function(item){

        if( item['d'] == "" ){
            return '';
        }
        var arr = item['d'].split(',');
        if( item['v'] == 1 ){
            for(var i=0;i<arr.length;i++){
                if(arr[i] == VAR.usr){
                    arr.splice(i,1);
                    break;
                }
            }
            switch(arr.length){
                case 0:
                    return '我觉得这个功能还行';
                case 1:
                    return tmpl( '我和 <%=u1%> 都觉得这个功能还行', {u1:arr[0]} );
                default:
                    return tmpl( '我和其他 <a href="###" onclick="return false;" class="like_style" title="<%=title%>"><%=count%>人</a> 都觉得这个功能还行', {count:arr.length,title:item['d']} );
            }
        }
        switch(arr.length){
            case 0:
                return '';
            case 1:
                return tmpl( '<%=u1%> 觉得这个功能还行', {u1:arr[0]} );
            case 2:
                return tmpl( '<%=u1%> 和 <%=u2%> 都觉得这个功能还行', {u1:arr[0],u2:arr[1]} );
            default:
                return tmpl( '<%=u1%> 等 <a href="###" onclick="return false;" class="like_style" title="<%=title%>"><%=count%>人</a> 都觉得这个功能还行', {u1:arr[0],count:arr.length,title:item['d']} );
        }
    }
    var get_like_detail = function(){
        jq.ajax({
             url: [CFG.src,'sgr?u=',VAR.usr,'&i=ragnarokthenighttool'].join(''),
             dataType:"jsonp",
             jsonp:"jsonpcallback",
             success:function(data){
                if( data.length > 0 ){
                    DATA.item = data[0];
                    update_like_status();
                }
             }
        });
    }
    var update_like_status = function(){

        var like_button = jq(".like_button:eq(0)");
        var like_desc = jq(".like_desc:eq(0)");

        like_button.show();
        if( DATA.item['v'] == 1 ){
            like_button.addClass('liked');
            like_button.html('<i class="sp_like"></i>已赞');
            like_desc.html(build_tid_like_desc(DATA.item));
        }else{
            like_button.removeClass('liked');
            like_button.html('<i class="sp_like"></i>赞一个');
            like_desc.html(build_tid_like_desc(DATA.item));
        }

    }
    var togglelike = function(e){
        var t = jq(e);
        var action = 'like';


        if( VAR.usr == "" ){
            return;
        }

        if( t.hasClass('liked') ){
            action = 'dislike';
        }

        jq.ajax({
         url: [CFG.src,'gr?a=',action,'&i=ragnarokthenighttool&u=',VAR.usr].join(''),
         dataType:"jsonp",
         jsonp:"jsonpcallback",
         success:function(data){
            if( action == 'like' ){
                DATA.item['v'] = 1;
                if( DATA.item['d'] == '' ){
                    DATA.item['d'] = VAR.usr;
                }else{
                    var arr = DATA.item['d'].split(',');
                    arr.push(DATA.usr);
                    DATA.item['d'] = arr.join(',');
                }
            }else{
                DATA.item['v'] = 0;
                var arr = DATA.item['d'].split(',');
                for(var i=0;i<arr.length;i++){
                    if(arr[i] == VAR.usr){
                        arr.splice(i,1);
                        break;
                    }
                }
                DATA.item['d'] = arr.join(',');
            }
            update_like_status();

         }});

    }



    var init = function(){
        VAR.usr = getcookie('_U_UID');
        DOM.spinner.hide();
        DOM.header.html(VAR.usr + ' 的时间轴');
        jq(window).bind('scroll.posts',scrollEvent);
        loadPage();
        get_like_detail();

    }






    var scrollEvent = function(){
        var wintop = jq(window).scrollTop(),
            docheight = jq(document).height(),
            winheight = jq(window).height();
        var  scrolltrigger = 0.95;

        if  ((wintop/(docheight-winheight)) > scrolltrigger)  loadPage();
    }















    return {init:init,togglelike:togglelike}
}

jq(function(){
    var tl = new TimeLine();
    tl.init();
    window.tl = tl;
})
