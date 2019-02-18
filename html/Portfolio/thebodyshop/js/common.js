/*GLOBAL - 홈페이지 전역에 들어갈 공통된 js*/
		
  $('.fadeOut').owlCarousel({
		items: 1,
		animateOut: 'fadeOut',
		loop: true,
		margin: 10,
		nav : true
	  });

   $('.owl-carousel').owlCarousel({
		margin: 10,
		nav: true,
		loop: true,
		slideTransition: 'ease-out',
		smartSpeed : 350,
		responsive: {
		  0: {
			items: 2
		  },
		  1000: {
			items: 4
		  },
		}
	  })
  $('#event .mobile_event_hd ul li').click(function(){
	var idx = $(this).index();
	$('#event .mobile_event_hd ul li').removeClass('active');
	$(this).addClass('active');
	$('#event .banner li').hide().eq(idx).show();

  });
  $('.mobile .m-hd-top .hamburger').click(function(){
	$('#hamburger').animate({
	  right :'0'
	},200);
  });
  $('#hamburger .close').click(function(){
	$('#hamburger').animate({
	  right :'100%'
	},200);
  });

//-------------Cookie----------------------

var cookie = {
  set : function(name, value, expire){

	var D = new Date();
	D.setTime(D.getTime()+(24*60*60*1000*expire));

	document.cookie = name+'='+value+'; expires='+D.toUTCString();

	cookie.update();
  },
  update : function(){
	var C = document.cookie;

	C = C.split('; ');

	C.forEach(function(v, i, o){
	  v = v.split('=');
	  cookie[v[0]] = v[1];
	});
	console.log(C)
  },
  remove : function(name){
	cookie.set(name, '', -1);
	cookie[name] = null;
	delete cookie[name];
  }
};
cookie.update();


//-----------main index ---------------------------
 
  //-----------배송지연 팝업창 (Cookie) ----------------
  if(!cookie.pop){
	$('#pop').show();
  }
  console.log(cookie.pop);
  $('#popclose').click(function(){
	if ($('#pop [type=checkbox]').is(':checked')) {//하루 이창을 열지 않음이 체크 되어있으면
	  cookie.set('pop','off',1);
	} 

	  $('#pop').hide();

  });

//-------------sub01 index -------------------------
  
  var info;
  $.ajax({
	url : './data/data.json',
	async : false,
	success : function(data){
	  info = data;
	}
  });

  var Ad = $('#ranges ul li');
  $('#ranges ul li').remove();
  var idx = 0;

  $(window).scroll(function(){
	var Top = $(window).scrollTop();
	var Height = $(window).height();
	var WrapH = $('#wrap').innerHeight();

	if (Top+Height>=WrapH-200) {

	  for(var i=0; i<3; i++){

		if(!info[idx]) return false;
		Ad.find('a').attr('href', info[idx].path);
		Ad.find('.thumb').css('background-image', 'url('+info[idx].thumb+')');
		Ad.find('.tit').text(info[idx].name);
		Ad.find('.text').text(info[idx].subtext);

		Ad.clone().appendTo('#ranges ul');
		idx++;
	  }
	  $(window).scroll();
	}
  }).scroll();


	var X = $('.visual_Top strong').text();
	$('.visual_cnt_tit').text($('.visual_Top strong').text());

	$('#event .mobile_event_hd ul li').click(function(){
	  var idx = $(this).index();
	  $('#event .mobile_event_hd ul li').removeClass('active');
	  $(this).addClass('active');
	  $('#event .banner li').hide().eq(idx).show();

	});
	$('.mobile .m-hd-top .hamburger').click(function(){
	  $('#hamburger').animate({
		right :'0'
	  },200);
	});
	$('#hamburger .close').click(function(){
	  $('#hamburger').animate({
		right :'100%'
	  },200);
	});


