var BBSViwer = function(){
    var DOM = {
        posts : jq("table.main")
    };
    var CFG = {
        'gender' : 1,
        'menu' : 1,
        'src' : 'http://zhainan.lightory.net/',
        'nextpage' : false
    };
    var DATA = {
        posts : [],
        tids : {},
        base : 0,
        userdesc: {},
        ips : {},
        baseurl : "",
        read_count :30,
        board : ''
    }

    var get_local_user_tag = function(key){
        var t = [], tmp = _g('d_'+key);
        if (tmp != '')
            t = tmp.split(",");
        return t
    }

    var add_local_user_tag = function(key, tagtoadd){
        var t = [], tmp = _g('d_'+key);
        if (tmp == ''){
            _s('d_'+key, tagtoadd);
        }else{
            t = tmp.split(",");
            t.push(tagtoadd);
            t = _unique(t);
            _s('d_'+key, t.join(','));
        }
    }
    var add_net_user_tag = function(key, tagtoadd){
        var c_name = _getcookie("_U_UID");
        if(c_name=="")
            c_name = "guest";
        jq.ajax({
             url:[CFG.src,'gp?u=',c_name,'&d=',encodeURI(tagtoadd),'&k=',key].join(''),
             dataType:"jsonp",
             jsonp:"jsonpcallback",
             success:function(data){}
        });
    }
    var delete_net_user_tag = function(key, todelete){
        jq.ajax({
             url:[CFG.src,'d?d=',encodeURI(todelete),'&k=',key].join(''),
             dataType:"jsonp",
             jsonp:"jsonpcallback",
             success:function(data){}
        });
    }
    var update_net_user_batch = function(){
        jq(DOM.posts).each(function(k,i){
            var uname = DATA.posts[k].uname;

            if( jq(i).attr("usdone") != "1" && DATA.userdesc.hasOwnProperty(uname) && DATA.userdesc[uname] !="" ){

                var _art = DATA.userdesc[uname].split(',')
                for(var j=0;j<_art.length;j++){
                    if( jq(i).find("a[tgn='"+_art[j]+"']").size()==0 ){
                        jq(['<a class="mDec mTag" href="javascript:;" title="网络上别人共享的标签" tgn="',_art[j],'">',_art[j],'</a>'].join('')).insertBefore(jq(i).find(".mAdd"));
                    }
                }
                jq(i).attr("usdone","1");
            }
        });
    }
    var delete_local_user_tag = function(key, todelete){
        var t = [], tmp = _g('d_'+key);
        if (tmp == ''){
            return;
        }else{
            t = tmp.split(",");
            var temp = [];
            for(var i=0;i<t.length;i++){
                if(t[i] == todelete){
                    continue;
                }
                temp.push(t[i]);
            }
            _s('d_'+key, temp.join(','));
        }
    }
    var get_net_user_batch = function(users,start){
        if( start >= users.length ){
            update_net_user_batch();
            return;
        }
        jq.ajax({
             url:CFG.src+'gd?ip='+users.slice(start,30).join('-'),
             dataType:"jsonp",
             jsonp:"jsonpcallback",
             success:function(data){
                for(var i=0;i<data.length;i++){
                    DATA.userdesc[data[i]['u']] = data[i]['d'];
                }
                get_net_user_batch(users,start+30);
             }
        });
    }
    var update_ip_addr_batch = function(){
        jq(DOM.posts).each(function(k,i){
            var ip = DATA.posts[k].ip;
            if( jq(i).attr("ipdone") != "1" && DATA.ips.hasOwnProperty(ip) && DATA.ips[ip].length > "" ){
                var dom = jq(i).find("tr:eq(0) .mOp:eq(0)");
                jq('<a class="mDec" href="javascript:;" title="'+DATA.ips[ip].join(' ')+'">'+DATA.ips[ip][0]+'</a>').insertBefore(dom);
                jq(i).attr("ipdone","1");
            }
        });
    }

    var get_ip_addr_batch = function(ips,start){
        if( start >= ips.length ){
            update_ip_addr_batch();
            return;
        }
        jq.ajax({
             url:CFG.src+'?ip='+ips.slice(start,30).join('o'),
             dataType:"jsonp",
             jsonp:"jsonpcallback",
             success:function(data){
                var i=0,j=0;
                for(i=start; j < data.length && i < ips.length;i++,j++){
                    DATA.ips[ips[i]] = new Array(decodeURI(data[j].c),decodeURI(data[j].a));
                }
                get_ip_addr_batch(ips,start+30);
             }
        });
    }




    var build_tid_like_desc = function(item,floor){

        if( item['d'] == "" ){
            return '';
        }
        var arr = item['d'].split(',');
        var uname = _getcookie('_U_UID');
        if( item['v'] == 1 ){
            for(var i=0;i<arr.length;i++){
                if(arr[i] == uname){
                    arr.splice(i,1);
                    break;
                }
            }
            switch(arr.length){
                case 0:
                    return _tmpl( '我觉得<%=type%>不错', {type:floor==0?'这篇帖子':'这个回复'} );
                case 1:
                    return _tmpl( '我和 <%=u1%> 觉得<%=type%>不错', {u1:arr[0],type:floor==0?'这篇帖子':'这个回复'} );
                default:
                    return _tmpl( '我和其他 <a href="###" onclick="return false;" class="like_style" title="<%=title%>"><%=count%>人</a> 觉得<%=type%>不错', {count:arr.length,type:floor==0?'这篇帖子':'这个回复',title:item['d']} );
            }
        }
        switch(arr.length){
            case 0:
                return '';
            case 1:
                return _tmpl( '<%=u1%> 觉得<%=type%>不错', {u1:arr[0],type:floor==0?'这篇帖子':'这个回复'} );
            case 2:
                return _tmpl( '<%=u1%> 和 <%=u2%> 觉得<%=type%>不错', {u1:arr[0],u2:arr[1],type:floor==0?'这篇帖子':'这个回复'} );
            default:
                return _tmpl( '<%=u1%> 等 <a href="###" onclick="return false;" class="like_style" title="<%=title%>"><%=count%>人</a> 觉得<%=type%>不错', {u1:arr[0],count:arr.length,type:floor==0?'这篇帖子':'这个回复',title:item['d']} );
        }
    }

    var update_tid_like_batch = function(){

        var button_template = ['<span class="like_button <% if(liked==1){ %>liked<% } %>" onclick="mbbs.togglelike(this)" >',
                                '<i class="sp_like"></i><% if(liked==1){ %>已赞<% }else{ %>赞一个<% } %></span>',
                                '<span class="like_desc"><%=desc%></span>'].join('');

        jq(DOM.posts).each(function(k,i){
            var tid = DATA.posts[k].tid;
            if( jq(i).attr("tiddone") != "1" && DATA.tids.hasOwnProperty(tid) && DATA.tids[tid] != "" ){
                var _item = DATA.tids[tid];
                var dom = jq(i).find("tr:eq(1) td:eq(0)");
                dom.append(_tmpl(button_template,{desc:build_tid_like_desc(_item,DATA.posts[k]['floor']),liked:_item['v']}));
                jq(i).attr("tiddone","1");
            }
        });
    }






    var get_tid_like_batch = function(tids,start){
        if( start >= tids.length ){
            update_tid_like_batch();
            return;
        }
        var user = _getcookie('_U_UID');
        jq.ajax({
             url: [CFG.src,'sgr?b=',DATA.board,'&u=',user,'&i=',tids.slice(start,30).join('*')].join(''),
             dataType:"jsonp",
             jsonp:"jsonpcallback",
             success:function(data){
                var i=0,j=0;
                for(i=start; j < data.length && i < tids.length;i++,j++){
                    DATA.tids[tids[i]] = data[j];
                }
                get_tid_like_batch(tids,start+30);
             }
        });
    }

    var join_top_menu = function(uname){
        var html = [];
        var tags = get_local_user_tag(uname);
        html.push('<tr><td colspan=2>');

        html.push('<span style="float:right">');
        html.push('<a class="mDec mOp" href="javascript:;" onClick="mbbs.highlight(this)">跟踪</a>');
        html.push('<a class="mDec mOp" href="javascript:;" onClick="mbbs.toggle(this)">折叠</a>');
        html.push('<a class="mDec mGender" href="javascript:;" onclick="mbbs.getgender(this)"> ?</a>');
        html.push('</span>');
        jq(tags).each(function(k,i){
            html.push('<a class="mDec mTag" href="javascript:;" title="我添加的标签" onClick="mbbs.deltag(this)" tgn="');
            html.push(i);
            html.push('">');
            html.push(i);
            html.push(" X</a>");
        });
        html.push('<a class="mDec mAdd" href="javascript:;"" onClick="mbbs.addtag(this)">添加标签</a>');
        html.push('</td></tr>');
        return html.join('');

    }

    var extract = function(data,start){
        var user_names = [];
        var user_ips = [];
        var user_tids = [];
        jq(data).each(function(k,i){
            var t = jq(i);
            var text = jq.trim(t.text()).split('\n');
            var rt = /\[FROM: ([\d\.]*)\]/ig.exec(text[text.length-1]);
            var floor = parseInt(jq.trim(t.find("td[align=right]").text()));
            var uname = jq.trim(t.find("tr td a:eq(2)").text());
            var ip = rt ? rt[1] : false;
            var tid = jq.trim(t.find("tr td a:eq(1)").attr("href"));

            var tid_exec = /board=([^&]+)&file=M.([\d]+).A/.exec(tid)

            if( tid_exec && tid_exec.length == 3 ){
                tid = tid_exec[2];
                DATA.board = tid_exec[1]
            }else{
                tid = ''
            }
            k = k + start;
            if( k == 0 ){
                DATA.base = floor;
                DATA.read_count = DATA.base+30;
            }
            DATA.posts.push({
                'uname' : uname,
                'floor' : floor,
                'ip' :  ip ? ip : '888.888.888.888',
                'tid' : tid
            });

            if( ! DATA.userdesc.hasOwnProperty(uname) ){
                user_names.push(uname);
                DATA.userdesc[uname] = "";
            }
            if(ip && !DATA.ips.hasOwnProperty(ip) ){
                user_ips.push(ip);
                DATA.ips[ip] = new Array();
            }

            if(tid && !DATA.tids.hasOwnProperty(tid) ){
                user_tids.push(tid);
                DATA.tids[tid] = "";
            }

            var ex = t.find("tr:eq(0) td:eq(0)");
            ex.html(ex.html().replace(/本篇(作者|人气)/g,'$1'));

            t.prepend(join_top_menu(uname));
            t.attr("fid",k);

        });

        user_ips = _unique(user_ips);
        user_names = _unique(user_names);
        user_tids = _unique(user_tids);

        get_net_user_batch(user_names,0);
        get_ip_addr_batch(user_ips,0);
        get_tid_like_batch(user_tids,0);

    }




    var init = function(){

        var QS = _QueryString();
        DATA.baseurl = ["bbstcon?board=",QS['board'],"&file=",QS['file'],"&start="].join("");
        jq.extend(CFG,jq.parseJSON(_g('m_configs')));

        extract(DOM.posts,0);

        //get_first_user
        show_gender_from_user(DATA.posts[0].uname);



        var css = ['<style type="text/css">',
                    'a.mDec {background:#eee;border-radius:3px;display:inline-block;font-size:12px;color:#700B97;border:0;margin-right:10px;padding:4px;}a.mDec:hover{color:#ff0000;}a.mAdd{color:#666;}a.mOp{}a.mLine{background:#eee;color:#666;}a.mTag{color:#A02482}a.mGender{background: #E088BD;color: white;margin:0;}a.mGender.GG{background: #9389FF}a.mGender.XD{background: #B3B3B3}',
                    '.like_desc{margin-left:5px;}',
                    '.like_button{margin-left:5px;background: #ECEEF5;border-radius: 3px;border: 1px solid #CAD4E7;cursor: pointer;padding: 2px 2px 2px;white-space: nowrap;color: #3B5998;}',
                    '.like_button:hover{border-color:#9dacce}',
                    '.like_button.liked{background-color: #EEE;border-color: #DDD;color: #AAA;}',
                    '.sp_like{background-image:url(http://bbs.nju.edu.cn/file/W/Warrior/like.png);background-repeat:no-repeat;display:inline-block;height:14px;width:14px;background-position: -0px -45px;position: relative;top: 3px;margin-right: 3px;}',
                    '.like_button.liked:hover{border-color:#ccc}',
                    '.like_desc a.like_style{color:#3D6CBE}',
                    '.like_button.liked .sp_like{background-position: -0px -15px;}',
                    '.like_button.liked:hover .sp_like{background-position: -0px -30px;}',
                    '</style>'].join('');
        //init css
        jq("head").append(css);
        highlight();

        //small pics
        jq(DOM.posts).each(function(k,i){
            jq(i).find("img").each(function(j,t){
                if(parseInt(jq(t).css("width")) > 600)
                    jq(t).css("width","600px")
            });
        });

        super_next_extract(jq(document.body).html());
        super_read();

    }

    var toggle = function(e){
        var dom = jq(e).parents("table").find("pre").toggle();
    }
    var highlight = function(e){
        var dom = e ? jq(e).parents("table") : jq(DOM.posts[0]);
        var id = parseInt(dom.attr("fid"));
        var uname = DATA.posts[id].uname;
        jq(DOM.posts).each(function(k,i){
            jq(i).css("border", DATA.posts[k].uname == uname ? "2px solid #8CC0F8" : "2px solid #d0f0c0")
        });
    }
    var addtag = function(e){
        var dom = jq(e).parents("table");
        var id = parseInt(dom.attr("fid"));
        var uname = DATA.posts[id].uname;
        Net.Dialog.show("请给 "+uname+" 增加一个描述把！","<form name=forms onSubmit=\"return false\" ><input placeholder='input here' type='text' value='' id='mbbs_tags' /><input type='submit' value='Submit' onclick=\"mbbs.addtagsubmit('"+uname+"')\"/><br/><br/><span style='color:#666666'><input type='checkbox' id='mbbs_updatenet' checked />共享</span></form>");
        jq("#mbbs_tags").focus();
    }
    var addtagsubmit = function(uname){
        u = jq.trim(jq("#mbbs_tags").val());

        if (u == null || u == ""){
            Net.Dialog.close();
            return false;
        }
        add_local_user_tag(uname,u);
        var tag = ['<a class="mDec mTag" href="javascript:;" onClick="mbbs.deltag(this)" tgn="',u,'">',u,' X</a>'].join('');
        for( var i = 0; i< DATA.posts.length;i++ ){
            if( DATA.posts[i]['uname'] == uname ){
                jq(tag).insertBefore(jq(DOM.posts[i]).find(".mAdd"))
            }
        }
        if(jq("#mbbs_updatenet")[0].checked){
            add_net_user_tag(uname,u);
        }
        Net.Dialog.close();
        return false;
    }

    var deltag = function(e){
        var dom = jq(e).parents("table");
        var id = parseInt(dom.attr("fid"));
        var uname = DATA.posts[id].uname;
        var key = jq(e).text();
        key = key.substr(1,key.length-4);
        delete_local_user_tag(uname,key);
        delete_net_user_tag(uname,key);
        for( var i = 0; i< DATA.posts.length;i++ ){
            if( DATA.posts[i]['uname'] == uname ){
                jq(DOM.posts[i]).find("a[tgn='"+key+"']").remove();
            }
        }
    }

    var send_like = function(t){
        var uname = _getcookie('_U_UID');
        var dom = t.parents("table");
        var id = parseInt(dom.attr("fid"));
        var tid = DATA.posts[id].tid;

        if( uname == "" ){
            alert('匆匆过客不能顶哦!请先登录~');
            return;
        }

        if( tid!="" ){
            jq.ajax({
             url: [CFG.src,'gr?a=like&i=',DATA.board,tid,'&u=',uname].join(''),
             dataType:"jsonp",
             jsonp:"jsonpcallback",
             success:function(data){
                if(DATA.tids[tid]['d'] == ""){
                    DATA.tids[tid]['d'] = uname;
                }else{
                    var arr = DATA.tids[tid]['d'].split(",");
                    arr.push(uname);
                    DATA.tids[tid]['d'] = arr.join(',');
                }
                DATA.tids[tid]['v'] = 1;
                update_like_status_batch(tid);
             }});
        }

    }


    var update_like_status_batch = function(tid){
        var item = DATA.tids[tid];

        console.log(item);
        jq(DOM.posts).each(function(k,i){
            if( DATA.posts[k]['tid'] == tid ){
                var desc_txt = build_tid_like_desc(item,DATA.posts[k]['floor']);
                if( item['v'] == 1 ){
                    jq(i).find(".like_button").addClass("liked").html('<i class="sp_like"></i>已赞');
                }else{
                    jq(i).find(".like_button").removeClass("liked").html('<i class="sp_like"></i>赞一个');
                }
                jq(i).find(".like_desc").html(desc_txt);
            }
        })
    }
    var send_dislike = function(t){
        var uname = _getcookie('_U_UID');
        var dom = t.parents("table");
        var id = parseInt(dom.attr("fid"));
        var tid = DATA.posts[id].tid;

        if( uname == "" ){
            alert('您还没登录呢~');
            return;
        }
        if( tid!="" ){
            jq.ajax({
             url: [CFG.src,'gr?a=dislike&i=',DATA.board,tid,'&u=',uname].join(''),
             dataType:"jsonp",
             jsonp:"jsonpcallback",
             success:function(data){
                var arr = DATA.tids[tid]['d'].split(",");
                var newarr = [];
                for(var i=0;i<arr.length;i++){
                    if( arr[i] == uname || arr[i] == ""){

                    }else{
                        newarr.push(arr[i]);
                    }
                }
                DATA.tids[tid]['d'] = newarr.join(',');
                DATA.tids[tid]['v'] = 0;
                update_like_status_batch(tid);
             }});
        }
    }

    var togglelike = function(e){
        var t = jq(e);
        if( t.hasClass('liked') ){
            send_dislike(t);
        }else{
            send_like(t);
        }
    }


    var super_next_extract = function(str){

        str = str.replace(/&amp;/g, '&');
        var find = DATA.baseurl + DATA.read_count;
        var value = str.indexOf(find);
        if(value > 0){
            CFG.nextpage = true;
        }else{
            CFG.nextpage = false;
        }
    }

    var super_read = function(){
        if(CFG.nextpage ){
            jq.get(DATA.baseurl+DATA.read_count,function(data){

                var tlin = DATA.read_count;
                DATA.read_count+=30;
                super_next_extract(data);
                data = data.split("\n");
                var content = data.slice(5,data.length-4);
                var att = /Net.Html.make\((\d+)\)/ig.exec(content[content.length-1]);
                if(att){
                    content[content.length-1] = "</textarea></table><hr color=white><script>Net.Html.make("+att[1]+")</script>";
                }else{
                    content[content.length-1] = "";
                }
                content[0] = '<table width=610 class=main><tr>';
                var td = jq("<div>"+content.join("\n")+"</div>");
                td.insertAfter(jq("center:eq(0) table").last());
                //td.find("table:eq(0)").remove();

                var tables = [];
                td.find("table").each(function(i,j){
                    if(i == 0){
                        return;
                    }
                    tables.push(j);
                    DOM.posts.push(j);
                });
                td.find("table:eq(0)").remove();
                extract(tables,tlin+1);

                setTimeout(function(){
                    super_read();
                },3000);
            });
        }
    }

    var gen_gender_from_user = function(uname,callback){
        var url = 'http://bbs.nju.edu.cn/bbsqry?userid='+uname;
        jq.get(url,function(data){
            var str = "XD";
            try {
                str = (data.match(/\[1\;[0-9]{2}m(.*)\[m\]/g))[0].match(/[0-9]{2}/g);
            } catch (error) {};
            callback&&callback( uname, str == "35" ? 'MM' : (str == "36" ? "GG" : "XD") );
        });
    }
    var show_gender_from_user = function(uname){
        gen_gender_from_user(uname,function(un,gender){
            jq(DOM.posts).each(function(k,i){
                if(DATA.posts[k].uname == un){
                    jq(i).find("tr:eq(0) a.mGender").attr("onclick","").addClass(gender).html(gender);
                }
            })
        });
    }

    var getgender = function(e){
        var t = jq(e);
        var dom = t.parents("table");
        var id = parseInt(dom.attr("fid"));
        var uname = DATA.posts[id].uname;

        t.attr("onclick","");

        show_gender_from_user(uname);
    }

    return {
        init : init,
        toggle : toggle,
        togglelike : togglelike,
        highlight : highlight,
        addtag : addtag,
        deltag : deltag,
        addtagsubmit : addtagsubmit,
        getgender : getgender
    }
}


var view_init = function(){
    bbs = new BBSViwer();
    bbs.init();
    window.mbbs = bbs;
}
//if(_initd){
view_init();
//}else{
//  _init.push(function(){
//    view_init();
//  });
//}