$(function  () {
	//播放列表
	var musics=[
    {src:'2.mp3',name:'有一点心动',artistan:'陈奕迅',duration:'02:00'},
    {src:'1.mp3',name:'绅士',artistan:'薛之谦',duration:'04:53'},
    {src:'3.mp3',name:'十年',artistan:'韩红',duration:'05:13'},
    {src:'4.mp3',name:'白天不懂夜的黑',artistan:'刘涛',duration:'04:14'},
    {src:'6.mp3',name:'时间煮雨',artistan:'吴亦凡',duration:'04:16'},
    {src:'7.mp3',name:'演员',artistan:'薛之谦',duration:'04:23'},
    {src:'8.mp3',name:'一次就好',artistan:'杨宗纬',duration:'04:35'},
    {src:'9.mp3',name:'第一夫人',artistan:'张杰',duration:'03:44'},
    {src:'10.mp3',name:'燕归巢',artistan:'张靓颖',duration:'03:37'},
    {src:'11.mp3',name:'终于等到你',artistan:'张靓颖',duration:'04:58'}

	];
	$(musics).each(function(index,v){
     $('<li><span class="music-name">'+v.name+'</span><span class="singer-name">'+v.artistan+'</span><span class="play-time">'+v.duration+'</span><div class="operate"><div class="operate-tu1"></div><div class="operate-tu2"></div><div class="operate-tu3"></div><div class="operate-tu4"></div></div></li>').appendTo('.player-list ul');
	});
	var currentIndex;
	$('.player-list li').on('click',function(){
		
		currentIndex=$(this).index();
		audio.src=musics[currentIndex].src;
		audio.play();
	});
	//删除歌曲
	$('.player-list .operate-tu4').on('click',function(e){
		e.stopPropagation();
		var i=$('.player-list .operate-tu4').index(this);
		$(this).closest('li').remove();
		musics.splice(i,1);
     $('.length span').text(musics.length);

	})
	var audio=$('#audio').get(0);
	var $audio=$('#audio');
	//一首歌播放完毕自动切换下一首
	$audio.on('ended',function(){
		$('.btnright').trigger('click');
	});
	//播放，暂停
	$('.btnon').on('click',function(){
		if (currentIndex===undefined) {
			currentIndex=0;
			audio.src=musics[currentIndex].src;
		};
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
		}
	});
	$audio.on('play',function(){
		$('.btnon').addClass('pause');
		$('.player-list li').removeClass('bl').eq(currentIndex).addClass('bl');
		var v=musics[currentIndex];
		$('.player-mini .music-name').text(v.name);
		$('.player-mini .singer-name').text(v.artistan);
		$('.player-mini .play-time').text(v.duration);		
	});
	$audio.on('pause',function(){
		$('.btnon').removeClass('pause');
	});
	$(document).on('keyup',function(e){
		if (e.shiftKey&&e.keyCode==80) {
			$('.btnon').trigger('click');
		};
	});
	//上一首
	$('.btnleft').on('click',function(){
		currentIndex-=1;
		if (!currentIndex) {
			currentIndex=0;
		};
		if (currentIndex<0) {
			currentIndex=musics.length-1
		};
		audio.src=musics[currentIndex].src;
		audio.play();
	});
	//下一首
	$('.btnright').on('click',function(){
		currentIndex+=1;
		if (!currentIndex) {
			currentIndex=0;
		};
		if (currentIndex>=musics.length) {
			currentIndex=0;
		};
		audio.src=musics[currentIndex].src;
		audio.play();
	})

//音量调整
	$('.volume-op').on('click',function(e){
		audio.volume=e.offsetX/$(this).width();
	});
	$('.volume .mute').on('click',function(){
		if (!$(this).attr('aa')) {
			$(this).attr('aa',audio.volume);
			audio.volume=0;
		}else{
			audio.volume=$(this).attr('aa');
			$(this).removeAttr('aa');
		}
		
	});
	$audio.on('volumechange',function(){
		if (audio.volume==0) {
			$('.volume .mute').addClass('active');
		}else{
			$('.volume .mute').removeClass('active');
		};
		var w=audio.volume*$('.volume-op').width();
		$('.volume-op .current-volume').width(w);
		$('.volume-op .indicator').css({left:w-3});

	});
	$('.volume-op .indicator').on('click',function(e){
		e.stopPropagation();
	});
//点击拖动调整音量
    $('.volume-op .indicator').on('mousedown',function(e){
		e.stopPropagation();
		$(this).closest('.volume-op').addClass('moving');
		$(document).on('mousemove',function(e){
			var left=e.pageX-$('.volume-op').offset().left;
			var v=left/$('.volume-op').width();
			v=(v>1)?1:v;v=(v<0)?0:v;
			audio.volume=v;
		})
	});
	$(document).on('mouseup',function(){
		$('.volume-op').removeClass('moving');
		$(document).off('mousemove');
	});
 //歌曲进度
 var $lvtiao=$('.player-mini .dangqianjindu');
 var $huitiao=$('.player-mini .gequjindu');
 var $dian=$('.player-mini .zhishidian');
  $audio.on('timeupdate',function(){
  	var v=(audio.currentTime/audio.duration)*$huitiao.width();
  	$lvtiao.width(v);
  	$dian.css({left:v-$dian.width()/2});
  });
  //点击调整进度
  $huitiao.on('click',function(e){
  	audio.currentTime=e.offsetX/$huitiao.width()*audio.duration;
  });
  //点击拖拽调整进度
  $dian.on('click',function(e){
  	e.stopPropagation();
  });
  $dian.on('mousedown',function(e){
  	e.stopPropagation();
  	var left=$huitiao.offset().left;
  	var width=$huitiao.width();
  	$(document).on('mousemove',function(e){
  		var v=(e.pageX-left)/width*audio.duration;
  		audio.currentTime=v;
  	});
  });
  $(document).on('mouseup',function(){
  	$(document).off('mousemove');
  });
//显示当前列表歌曲数
$('.length span').text(musics.length);
//清空列表
$('.player-list .title-right').on('click',function(){
	$('.player-list ul').empty();
	audio.src='';
	$('.player-mini .music-name').text('QQ音乐');
	$('.player-mini .singer-name').text('听你想听的歌');
	$('.player-mini .play-time').text('');
	 musics.length=0;
     $('.length span').text(musics.length);
     $('.btnon').off('click');
     $('.btnright').off('click');
     $('.btnleft').off('click');
});
//下方显示时间的小框
$huitiao.on('mouseover',function(e){
	time=e.offsetX/$huitiao.width()*audio.duration;
	$('.player-mini .tips').find('span').html(zhuanhuan(time));
	$('.player-mini .tips').css({
		display:'block',left:e.offsetX-$('.player-mini .tips').width()/2
	})
	$huitiao.on('mousemove',function(e){
		time=e.offsetX/$huitiao.width()*audio.duration;
		$('.player-mini .tips').find('span').html(zhuanhuan(time));
	$('.player-mini .tips').css({
		display:'block',left:e.offsetX-$('.player-mini .tips').width()/2
	})
	})
});
$huitiao.on('mouseout',function(){
	$huitiao.off('mousemove');
	$('.player-mini .tips').css('display','none');
});

var zhuanhuan=function(time){
	if (isNaN(time)) {
		return '--:--';
	};
	time=parseInt(time);
	var min=parseInt(time/60);
	min=(min<10)?('0'+min):min;
	var second=time%60;
	second=(second<10)?('0'+second):second;
	return min+':'+second;
}










})