var Query = function(){
    var DOM = {
        btn : null
    }
    var DATA = {
        user : 'TA',
        item : {d:"",v:0}
    }
    var CFG = {
        src: 'http://zhainan.lightory.net/'
    }



    var build_tid_like_desc = function(item){

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
                    return _tmpl( '我觉得<%=type%>靠谱', {type:DATA.user} );
                case 1:
                    return _tmpl( '我和 <%=u1%> 都觉得<%=type%>靠谱', {u1:arr[0],type:DATA.user} );
                default:
                    return _tmpl( '我和其他 <a href="###" onclick="return false;" class="like_style" title="<%=title%>"><%=count%>人</a> 都觉得<%=type%>靠谱', {count:arr.length,type:DATA.user,title:item['d']} );
            }
        }
        switch(arr.length){
            case 0:
                return '';
            case 1:
                return _tmpl( '<%=u1%> 觉得<%=type%>靠谱', {u1:arr[0],type:DATA.user} );
            case 2:
                return _tmpl( '<%=u1%> 和 <%=u2%> 都觉得<%=type%>靠谱', {u1:arr[0],u2:arr[1],type:DATA.user} );
            default:
                return _tmpl( '<%=u1%> 等 <a href="###" onclick="return false;" class="like_style" title="<%=title%>"><%=count%>人</a> 都觉得<%=type%>靠谱', {u1:arr[0],count:arr.length,type:DATA.user,title:item['d']} );
        }
    }

    var get_like_detail = function(){
        var user = _getcookie('_U_UID');
        jq.ajax({
             url: [CFG.src,'sgr?u=',user,'&i=',DATA.user].join(''),
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

    var init = function(){

        var arr = /([a-zA-Z0-9]+) \((.*)\) 共上站 \d+ 次/ig.exec(jq("pre:eq(0)").text());
        if( arr ){
            DATA.user = arr[1];
            var dom = jq(".c37:eq(2)");

            var html = [' 篇',
                        '<span class="like_button hide" onclick="mbbs.togglelike(this)"><i class="sp_like"></i>赞一个</span><span class="like_desc"></span>',
                        '\n['];

            var newdom = jq("<div></div>");
            newdom.append(dom.children());
            dom.html(html);
            dom.append(newdom.children());

            get_like_detail();


            var css = ['<style type="text/css">',
                        '.hide{display:none}',
                        '.like_desc{margin-left:5px;}',
                        '.like_button{margin-left:5px;background: #ECEEF5;border-radius: 3px;border: 1px solid #CAD4E7;cursor: pointer;padding: 2px 2px 2px;white-space: nowrap;color: #3B5998;}',
                        '.like_button:hover{border-color:#9dacce}',
                        '.like_button.liked{background-color: #EEE;border-color: #DDD;color: #AAA;}',
                        '.sp_like{background-image:url(http://bbs.nju.edu.cn/file/W/Warrior/like.png);background-repeat:no-repeat;display:inline-block;height:14px;width:14px;background-position: -0px -45px;position: relative;top: 3px;margin-right: 3px;}',
                        '.like_button.liked:hover{border-color:#ccc}',
                        '.like_desc a.like_style{color:#3D6CBE}',
                        '.like_desc{color:#3D6CBE}',
                        '.like_button.liked .sp_like{background-position: -0px -15px;}',
                        '.like_button.liked:hover .sp_like{background-position: -0px -30px;}',
                        '</style>'].join('');
            //init css
            jq("head").append(css);

        }

    }

    var togglelike = function(e){
        var t = jq(e);
        var action = 'like';
        var uname = _getcookie('_U_UID');


        if( uname == "" || DATA.user == "" ){
            alert('匆匆过客不能顶哦!请先登录~');
            return;
        }

        if( t.hasClass('liked') ){
            action = 'dislike';
        }

        jq.ajax({
         url: [CFG.src,'gr?a=',action,'&i=',DATA.user,'&u=',uname].join(''),
         dataType:"jsonp",
         jsonp:"jsonpcallback",
         success:function(data){
            if( action == 'like' ){
                DATA.item['v'] = 1;
                if( DATA.item['d'] == '' ){
                    DATA.item['d'] = uname;
                }else{
                    var arr = DATA.item['d'].split(',');
                    arr.push(uname);
                    DATA.item['d'] = arr.join(',');
                }
            }else{
                DATA.item['v'] = 0;
                var arr = DATA.item['d'].split(',');
                for(var i=0;i<arr.length;i++){
                    if(arr[i] == uname){
                        arr.splice(i,1);
                        break;
                    }
                }
                DATA.item['d'] = arr.join(',');
            }
            update_like_status();

         }});

    }

    return {
        init :init,
        togglelike : togglelike
    }

}





jq(function(){
    var q = new Query();
    window.mbbs = q;

    q.init();
})