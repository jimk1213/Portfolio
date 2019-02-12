
//--------------새로고침할 경우 맨 위로 올라오는 이벤트------------------------
$(window).on('beforeunload', function() {
	$(window).scrollTop(0); 
})

//--------------페이지 단위 스크롤 이벤트------------------------------
var windowWidth;
var page;//현재 보고있는 페이지를 나타내는 변수.

$.fn.extend({//2. 제이쿼리에 메소드를 추가.(복수의 메소드를 추가할 때 사용.)  객체를 확장시킨다. extend({},{})-> 앞에 있는 객체를 뒤에 있는 객체를 합치겠다. 
	myScroll : function(option){ // my.scroll이라는 제이쿼리 메소드를 추가.
		var O = $(this); 
		var frm = $('.frm');
		var video = O.find('.visualvideo');
		var delta;// 휠의방향을 담을 변수
		
		var scroll = { // myscroll의 관련되 메소드들이 모여있는 객체...
			init : function(){ // 기본세팅 메소드.  init 이니셜이라는 뜻.

			   //3. 섹션의 높이 세팅.
				$(window).on('resize', function(){ // window가 리사이즈 할때마다
					O.each(function(i){ // section의 갯수만큼 반복
						var H; 
						H=$(window).height()-300
						if(i==5) H=200
						$(this).height(H) // 각 section에 높이를 지정.

						if($(window).width()>option.minWidth){//테블릿, 스마트폰 사이즈에서는 본인의 CSS height 값을 적용
                     		$(this).height(H);
                		} else{
							if($(this).attr('style')) $(this).attr('style', $(this).attr('style').replace(/height: .+px;/, ''));
						}

					});
					windowWidth = $(window).width()

				}).resize();

			   //4. 스크롤 되면 현재 페이지를 보여줘야한다.
				$(document).on('scroll', function(){ // 문서가 스크롤 되면

					var baseline = $(window).scrollTop()+$(window).height()-200;// 베이스라인 설정.화면의 가로 중간

					O.each(function(i){ // 각 섹션만큼 반복
						var H = $(this).offset().top; // 각 섹션의 위치값.
						if(baseline>H) page = i; // 섹션이 베이스라인보다 위로 올라가는 순간 그 섹션이 몇번째인지 리턴
					});
					//console.log('page:'+page)

					if(page==0){//section01
						$('.frm').css({padding : ''})
						$('#box').width('300px').height('300px').css({animation: '10s infinite alternate ease-in-out tipsy'})
					} else if(page==5){//section06.footer
						if(windowWidth>1000){//PC버전만
							$('#box').addClass('fot')
							$('header').addClass('fot')
							$('.moving').css('height','auto')
						}
					} else {
						$('.frm').css({padding : '120px 100px'})
						$('#box').css({width : '100%',height : '100%',animation: ''})
						$('#box').removeClass('fot')
						$('header').removeClass('fot')
						$('.moving').css('height','0')
					}
					if(windowWidth>1000){//PC버전만 removeClass 적용
							$('.frm').removeClass('rightA leftA')
							$('section').removeClass('rightA leftA')
						}
					O.removeClass('active').eq(page).addClass('active');
					scroll.nav(page);
				}).scroll();

			   //step.5) 마우스 휠 이벤트
				$('html, body').on('mousewheel', function(){ // 문서내에서 휠이 동작했을 때

					if($(this).is(":animated")) return false;//화면이 움직이고 있는 동안은 이벤트 중지

					if($(window).width()>option.minWidth){
						var winHeight = $(window).height();

						event.wheelDelta<0?delta=1:delta=-1; // 휠방향에 따라 1,-1을 리턴

						if(winHeight>option.minheight) {//window가 최소사이즈보다 크다면...
							if ((page==0&&delta==-1)||(page==O.length-1&&delta==1)) {// 1페이지보다 위로 혹은 끝페이지보다 밑으로 가고자 할때 중지시켜준다.
							return false;
							} 
							scroll.action(page+=delta);
							return false;//wheel의 기본 기능을 막아준다.
						}
					}
				});

			 // step.6) 네비생성
				var nav = $('<nav style="position:fixed; right : 0; bottom: 50%;"></nav>')
				O.last().after(nav);
				O.each(function(i){
					var v;
					option.nav? v= option.nav[i] : v='';
					nav.append('<i>'+v+'</i>');
				})
				nav.find('i').on('click', function(){
					if($('html, body').is(":animated")) return false; // 화면이 움직이는 도중에는 중지
					var idx = $(this).index();
					scroll.action(idx); // 클릭한 페이지로 action메소드 실행
				});
				scroll.nav(page);
			},
			action : function(to){ // 동작 메소드

			 if($(window).width()<option.minWidth) return false;

				var margin= ($(window).height()-O.eq(to).outerHeight())/2
				var T = O.eq(to).offset().top-margin;
				O.css({padding : (120-margin)+'px 100px'})
				$('html, body').animate({scrollTop: T}, option.speed, option.ease);//해당 section으로 이동
				$('.upper').removeClass('active')
				O.eq(to).find('.upper').addClass('active')

				var playVideo = $('section').eq(to).find('.visualvideo')

				if(playVideo.length==0) {//비디오 재생 및 멈추기 
					$('.visualvideo').get(0).pause()
				} else {
					$('.visualvideo').get(0).pause()
					playVideo.get(0).play()
				}
			},//action
			nav : function(page){
				$('nav i').removeClass('active').eq(page).addClass('active');
			}
		} // scroll객체
	scroll.init();
	}// prototype (myScroll)
}); // extend

	$('section').myScroll({ //step. 1) section에 새로 만든 메소드(myscroll)를 적용...
			minWidth : 1001,
			minheight : 300, // 섹션의 최소높이.
			ease : 'easeInSine',
			speed : 500,
			//nav : ['Home','profile','Experience','Skills','Works','content']
		}); 

//----------ProgressBar--------------------------------
var bar;
$(function(){
	  var canvas = document.querySelectorAll('.barGraph canvas');

	  var ctxArray = [];
	  for(i=0;i<canvas.length;i++){
		 ctxArray.push(canvas[i].getContext('2d'))
	  }

	  var state;
	  var W,H;
	  $(window).resize(function(){

		 W = $('.barGraph').innerWidth();
		 H = $('.barGraph').innerHeight();

		 ctxArray.forEach(function(v,i){
			v.canvas.width = W;
			v.canvas.height = H;
		 });
	  }).resize();

	  var barArray = [];
	  bar = {
		 draw : function(animate){

			ctxArray.forEach(function(O,I){
			  O.progress = 0;
					var interval = O.canvas.getAttribute('data-interval');
					if(animate) {
						if (0<=I&&I<=2) {setTimeout(function(){bar.update(O,I)}, interval);}
						if (3<=I&&I<=4) {setTimeout(function(){bar.update(O,I)}, interval);}
						if (5<=I&&I<=8) {setTimeout(function(){bar.update(O,I)}, interval);}
					} else {
						bar.set(O,I)
					}
			});
		 },
		 update : function(O,I,interval){

			var percent = O.canvas.getAttribute('data-percent');
			var barColor = O.canvas.getAttribute('data-barColor');
			var barWidth = O.canvas.getAttribute('data-barWidth');
			var time = O.canvas.getAttribute('data-time');
			
			setTimeout(function(){

			   if (O.progress<=percent*(time*2)) {

				  var txt = Math.floor(O.progress/(time*2));
				  $('.barTitle').eq(I).css('color', barColor);
				  $('.barText').eq(I).text(txt).css('color', barColor);

				  O.clearRect(0, 0, W, H);

				  O.beginPath();
				  O.arc(W/2,H/2,W/2-barWidth/2,Math.PI*(-0.5),Math.PI*((O.progress*(0.01/time))-0.5));
				  O.strokeStyle=barColor;
				  O.lineWidth=barWidth;
				  O.stroke();

				  bar.update(O,I);
				  O.progress++;
			   }
			}, interval);
		 },
		 set : function(O,I){
			var percent = O.canvas.getAttribute('data-percent');
			var barColor = O.canvas.getAttribute('data-barColor');
			var barWidth = O.canvas.getAttribute('data-barWidth');
			var time = O.canvas.getAttribute('data-time');

			var txt = O.canvas.getAttribute('data-percent');
			$('.barText').eq(I).text(txt);

			O.clearRect(0, 0, W, H);

			O.beginPath();
			O.arc(W/2,H/2,W/2-barWidth/2,Math.PI*(-0.5),Math.PI*((percent*(0.02))-0.5));
			O.strokeStyle=barColor;
			O.lineWidth=barWidth;
			O.stroke();
		 }
	  }
	   
	  $(window).on('resize',function(){      
		 if (state) bar.draw(false);
	  });
});

//---------------------mouse기능 이벤트---------------
$('.work-link li').on('mouseenter', function(){
	var idx = $(this).index()
	var listli = $('.work-list li').eq(idx)
	var innertext = $('.work-list li').eq(idx).find('span').text()
	$('#worktit').text(innertext)
	listli.find('.color').addClass('hover')

})

$('.work-link li').on('mouseleave', function(){
	var idx = $(this).index()
	var listli = $('.work-list li').eq(idx)
	listli.find('.color').removeClass('hover')

})

$('.work-link li').on('click', function(){
	if(page==5) return false	
	var idx = $(this).index()
	var detailLi = $('.pageDetail li').eq(idx)
	detailLi.find('.cnt').addClass('show')
	detailLi.addClass('showli')
	detailLi.find('video').get(0).play()

})       

// 타겟영역을 제외하고 클릭했을 시 팝업 숨김처리.
$('.pageDetail li').on('click', function(e){
    var tgPoint = $(e.target);
    var cnt = tgPoint.hasClass('showli')
    if (cnt) {
    	$(this).removeClass('showli');
    	$(this).find('.cnt').removeClass('show');
    	$(this).find('video').get(0).pause();
    }
});

$('#h2-education').on('click', function(){
	$('.frm').toggleClass('rightA')
	$(this).parents('section').toggleClass('rightA')
})

$('#h2-skills').on('click', function(){
	$('.frm').toggleClass('leftA')
	$(this).parents('section').toggleClass('leftA')
	setTimeout(function(){bar.draw(true)},500);
})

//---------------반응형----------------------------------------
$(window).on('resize', function(){
	windowWidth = $(window).width()
	if(windowWidth<481) {//481 이하일 때,
		//console.log('480px 이하 : 모바일')
		$('.sec03').addClass('rightA')
		$('.sec04').addClass('leftA')
		setTimeout(function(){bar.draw(true)},500);
	} else if(windowWidth<1001) {//1001이하 일때
		//console.log('1000px 이하 : 테블릿')
		setTimeout(function(){bar.draw(true)},500);
		$('.sec03').addClass('rightA')
		$('.sec04').addClass('leftA')
		setTimeout(function(){$('.box-move-tit').animate({'letter-spacing':'25px'},5000)},3000)
	} else {//1001이상 일때
		//console.log('1000px 이상 : PC')
	}
}).resize();