var bds_config = {'bdText':''};

var append_js = function(js){
  var h = document.getElementsByTagName("body")[0] || document.documentElement;
  var s = document.createElement("script");
  s = document.createElement("script");
  s.type = "text/javascript";
  s.src = js;
  h.appendChild( s );
}

var share_init = function(){
  bds_config['bdText'] = jq("pre:eq(0)").text().split('\n')[1] + ' [From LilyBBS]';
  var h = document.getElementsByTagName("body")[0] || document.documentElement;
  var sr = document.createElement("script");
  sr.type = "text/javascript";
  sr.id = "bdshare_js";
  sr.data = "type=slide&amp;img=0";
  h.appendChild( sr );
  jq(sr).attr('data',"type=slide&amp;img=0");


  var s = document.createElement("script");
  s.type = "text/javascript";
  s.id = "bdshell_js";
  s.src = "http://share.baidu.com/static/js/shell_v2.js?cdnversion="+new Date().getHours();
  h.appendChild( s );

}

//if(_initd){
share_init();
//}else{
//  _init.push(function(){
//    share_init();
//  });
//}
