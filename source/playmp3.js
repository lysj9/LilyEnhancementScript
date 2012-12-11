function playmp3(e){
	var playerpath = "http://bbs.nju.edu.cn/file/W/Warrior/";
	
	var options = {
		"filepath": "http://bbs.nju.edu.cn/file/W/Warrior/",			
		"backcolor": "ffffff",									// background color
		"forecolor": "ffffff",								// foreground color (buttons)
		"width": "5",										// width of player
		"repeat": "no",										// repeat mp3?
		"volume": "50",										// mp3 volume (0-100)
		"autoplay": "true",								// play immediately on page load?
		"showdownload": "fale",								// show download button in player
		"showfilename": "fale",								// show .mp3 filename after player
		"filename":"message.mp3"
	};
	var filename = options.filepath + options.filename;
	var mp3html = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ';
	mp3html += 'width="' + options.width + '" height="0" ';
	mp3html += 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">';
	mp3html += '<param name="movie" value="' + playerpath + 'playmusic.swf?';
	mp3html += 'showDownload=' + options.showdownload + '&file=' + filename + '&autoStart=' + options.autoplay;
	mp3html += '&backColor=' + options.backcolor + '&frontColor=' + options.forecolor;
	mp3html += '&repeatPlay=' + options.repeat + '&songVolume=' + options.volume + '" />';
	mp3html += '<param name="wmode" value="transparent" />';
	mp3html += '<embed wmode="transparent" width="' + options.width + '" height="5" ';
	mp3html += 'src="' + playerpath + 'playmusic.swf?showDownload=' + options.showdownload + '&file=' + filename + '&autoStart=' + options.autoplay;
	mp3html += '&backColor=' + options.backcolor + '&frontColor=' + options.forecolor;
	mp3html += '&repeatPlay=' + options.repeat + '&songVolume=' + options.volume + '" ';
	mp3html += 'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
	mp3html += '</object>';
	e.innerHTML = mp3html+" ";
}