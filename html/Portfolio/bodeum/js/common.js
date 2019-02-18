

//------교육 신청 버튼을 클릭했을 때

	$('.ask').click(function(){
		alert('로그인이 필요합니다.')
	})


//-----------보듬의 영상교육 과정------------
	$('#curriculum .control button').click(function(){

		var idx = $(this).index();
		$('#curriculum .control button').removeClass('active');
		$(this).addClass('active');
		$('#curriculum .pack').hide().eq(idx).show();
	});

// -----영상교육이란? 그룹레슨이란? 개인레슨이란? 버튼 효과------	

	$('.what ul .bx').hover(function(){
		$(this).find('.bx_inner').stop().slideUp();
	}, function(){
		$(this).find('.bx_inner').stop().slideDown();
	});

// -----커뮤니티 페이지 비주얼 부분------		
var owl = $('.owl-carousel');
owl.owlCarousel({
    items:1,
    loop:true,
    margin:10,
    autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true
});

 $('.slider-for').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  asNavFor: '.slider-nav'
});
$('.slider-nav').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  asNavFor: '.slider-for',
  dots: false,
  centerMode: true,
  focusOnSelect: true
});