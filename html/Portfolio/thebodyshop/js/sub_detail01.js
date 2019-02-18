
//-----ajax로 제품의 data 불러오는 스크립트-----------------------------------------
	var info;
	$.ajax({
		url : './data/newindata.json',
		async : false,//info에 들어간 데이터를 전역변수로 사용
		success : function(data){//파싱에 성공할 경우 data값을 info에 넣어줌.
			info = data;
		}
	});

//-----상품 배열 만들어주는 함수---------------------------------------------------
	function MakeArr(idx, len, newArr){

		for(var i=0; i<len; i++){//len의 갯수만큼 반복

			if (!newArr[idx]){
				$('.right-list-wrap .more').hide();
				return false;
			}
			prod.find('a').attr('href', newArr[idx].path);//상품 클릭시 연결될 href
			if(!newArr[idx].etc=='') prod.find('.thumb').addClass(newArr[idx].etc);//etc의 값(bestseller, hotsale, new)이 있을 경우 이미지에 해당 클래스 추가
			prod.find('.thumb img').attr('src', newArr[idx].thumb);//이미지 경로 설정
			prod.find('.tit').text(newArr[idx].name);//상품 이름 
			prod.find('.price').text(addComma(newArr[idx].price));//상품 가격 및 ,
			prod.find('.star-score-box span').addClass('grade'+newArr[idx].grade);//평점에 따라 지정된 클래스(grade1, grade2, ...) 추가
			prod.clone().appendTo('.listWrap');//태그 추가
			prod.find('.thumb').removeClass(newArr[idx].etc);
			prod.find('.star-score-box span').removeClass('grade'+newArr[idx].grade);
			idx++

		}
		$('.prod-list-total').text(newArr.length);//상단 제품 총 갯수 세주는 스크립트
		return newArr;
		//console.log(newArr)
	}
//-----price에 , 넣어주는 함수---------------------------------------------------
	function addComma(num){

		num =num.toString();//num이라는 매개변수로 불러온 숫자를 문자화

		var length = num.length;//문자화 시킨 num의 갯수를 파악
		var X = length%3;//num의 갯수 나누기 3의 나머지 값
		var str = num.substring(0,X);

		for(var i = X; i<length; i+=3){
			str = str+','+num.substring(X,X+3);
		}
		if (str.charAt(0)==',') str = str.substring(1);

		return str;
	}


//-----json으로 불러온 data를 html tag를 생성해서 넣어주는 스크립트-----------------

	var prod = $('.listWrap .item');//prod에 html tag를 넣기
	$('.listWrap .item').remove();//tag 삭제

	//------더보기를 클릭하여 html tag + data 입력하여 상품 추가되는 스크립트-----
	var moreidx = 0;//idx 초기값 설정.	

		$('.right-list-wrap .more').on('click',function(){//

			console.log()
			MakeArr(moreidx, 9, info);
			moreidx+=9;

			console.log(moreidx);
		}).click();//처음 페이지 로딩시 강제로 click()실행.
	
	

//------우측 제품 정렬 기능 관련 스크립트----------------------------------------
	
	//-----우측 제품 정렬 클릭하면 정렬 기준 나오는 이벤트-----
		$('.selectric').click(function(){
			$(this).siblings('ul').toggle();
			$(this).find('.downBtn').toggleClass('on');
		});

	//-----정렬 기준 클릭하면 기준에 따라 상품이 재생성 되는 이벤트-----
		$('.sort-by-select ul li').click(function(){
			moreidx = 0;//정렬기준별로 클릭하면 idx 리셋.
			$('.sort-by-select ul li').removeClass('selected');//정렬 기준 전체에 'selected' class삭제
			$(this).addClass('selected');// 선택된 정렬 기준에만 'selected' class추가
			$('.selectric p').text($(this).find('input').attr('value'));//선택된 값을 정렬기준의 창에 text로 넣기
			$(this).parent('ul').hide();
			$('.listWrap .item').remove();

			var attr = $(this).find('input').attr('data-attr');//선택된 정렬기준의 'data-attr'값을 attr에 저장
			var reverse = $(this).find('input').attr('data-sort');//선택된 정렬기준의 'data-sort'값을 reverse에 저장. sort값이 없는 경우 undefined

			info.sort(function(a,b){//info를 sort메서드를 사용해서 정렬
				a[attr]<b[attr] ? sort = -1 : sort = 1;//attr의 값(number, name, price)에 따라서 정렬
				if(reverse) sort*=-1;//reverse 값이 존재하는 경우(높은 가격순) 역순으로 정렬
				return sort;//위의 기준으로 정렬된 값을 info에 넣어줌.
			})

			idx = 0;//idx 값을 초기화 
			$('.right-list-wrap .more').show().click();

		});

//------좌측 제품 필터 기능 관련 스크립트----------------------------------------	
	
	//-----왼쪽 필터 세부 항목 슬라이드 다운 업 이벤트-----
	$('.filter-btn').click(function(){
		$(this).siblings('.depth2').slideToggle();
		$(this).find('.downBtn').toggleClass('on');
	});
	
	//-----필터 검색 기능에서는 더보기 버튼 숨기기 이벤트-----
		$('.depth2 li').click(function(){
			$('.right-list-wrap .more').hide();
		});

	//-----필터 초기화 -----------------------

		$('input[type=reset]').click(function(){
			$('.listWrap .item').remove();
			$('.right-list-wrap .more').show();
			MakeArr(0, 9, info);
			console.log('리셋');
		});



	//-----필터 검색 이벤트-----
	var click1Arr;
	var click2Arr;
	var click3Arr;
	var click4Arr;
	var click5Arr;
	var keyArr = [];
		$('.depth2 li label').click(function(){
			var key = $(this).parents('.depth2').attr('data-attr');//character
			keyArr.push(key);
			var sort = $(this).parent('li').attr('data-sort');//period, discount, Limited
			
			var all = $('.depth2 li label input').is(':checked');//전체
			var F1 = $('.character li label input').is(':checked');//제품특징이 체크되어 있으면 true
			var F2 = $('.cost li label input').is(':checked');// 가격대가 체크되어 있으면 true
			var F3 = $('.grade li label input').is(':checked');//평점이 체크되어 있으면 true
			

			if(!all) {//아무것도 체크되어있지 않을 경우
				//console.log('아무것도 체크 노노')
				click1Arr = Search(info, sort, key);
				
			}  else if (F1&&F2&&F3){//세개가 체크되어있는 경우

				if (keyArr.slice(-1)[0]==keyArr.slice(-2, -1)[0]) {//동일한 항목에서 클릭할 때
					click4Arr = Search(click2Arr, sort, key);
					console.log(click2Arr);
					console.log('3개 체크, 같은 항목');
				} else {//다른 항목에서 선택할 때
					click4Arr = Search(click1Arr, sort, key);
					console.log('3개 체크, 다른 항목');
				}

				
			} else if ((F1&&F2)||(F1&&F3)||(F2&&F3)){//두개가 체크되어있는 경우
				
				if (keyArr.slice(-1)[0]==keyArr.slice(-2, -1)[0]) {//마지막으로 클릭한 li의 attr 값 == 마지막 직전에 클릭한 li의 attr 값-> 동일한 항목에서 클릭할 때
					click2Arr = Search(click1Arr, sort, key);
					console.log('2개 체크, 같은 항목');

				} else {//다른 항목에서 선택할 때
					click3Arr = Search(click2Arr, sort, key);
					console.log('2개 체크, 다른 항목');
					console.log(click3Arr);
					console.log(click2Arr);
				}
				console.log(keyArr.slice(-1)[0]==keyArr.slice(-2, -1)[0])
				
			} else if (F1||F2||F3){//하나라도 체크되어있는 경우

				if (keyArr.slice(-1)[0]==keyArr.slice(-2, -1)[0]) {//동일한 항목에서 클릭할 때
					click2Arr = Search(info, sort, key);
					console.log('1개 체크, 같은 항목');
				} else {//다른 항목에서 선택할 때
					click2Arr = Search(click1Arr, sort, key);
					console.log('1개 체크, 다른 항목');
				}
				
			}
		})

	
	//-----필터 검색해서 상품 보여주는 함수-----
		function Search(arr, sort, attr){
			$('.listWrap .item').remove();//기존 상품 삭제
			var newArr = Filter(arr, sort, attr);
			var aaa= MakeArr(0, newArr.length, newArr);
			$('.prod-list-total').text(aaa.length);//상단 제품 총 갯수 세주는 스크립트
			return aaa;


		}

	//-----필터 선택하여 새로운 배열로 만드는 함수-----
		function Filter(Arr, sort, attr){
			if(attr == 'price'){//attr이 price인 경우 -> 가격대를 선택했을 때.

				var low = sort-9999;
				if(sort=='49999'){//4만원 이상을 선택했을 때

					var newArr = Arr.filter(function(filter){
						return low < filter[attr]// 40000 < 상품금액 = ture -> return
					})

				} else {//1만원 이하, 1만원대, 2만원대, 3만원대
					var newArr = Arr.filter(function(filter){
						return low < filter[attr] && filter[attr] <sort;
					})

				}
				
			} else {// 가격대가 아닌 평점, 제품 특징을 선택했을 때. 

				var newArr = Arr.filter(function(filter){//필터로 새로운 만들어진 새로운 배열을 charArr에 저장
					return filter[attr] === sort;//charachter이 선택된(period, discount, Limited) sort와 동일한 요소만 뽑아옴.
				})

			}
			return newArr;
		}

//-----찜 버튼 클릭-----
var likeArr = [];
	$(document).on('click', '.like', function(){//ajax로 append해서 만든 태그이기 때문에 document를 먼저 읽고 처리해야함.http://blog.freezner.com/archives/109 참고
		if($(this).is('.on')){//클래스에 on이 있을때-> 버튼을 누를때
			likeArr.pop($(this));
		} else {//클래스에 on이 없을때 -> 버튼 누른것을 해제할때
			likeArr.push($(this));
		}
		$(this).toggleClass('on');

		$('.heart-btn .count').text(likeArr.length);
	})



/*
	해야할일 : like 눌렀을 때 정렬하면 버튼은 해제, like 숫자는 그대로 유지되는 오류;

*/





	/*안씀 비효율적인듯.........
	$.fn.extend({
		btn_up : function(){
			$(this).find('i').css({
			'background': 'url(./img/icon-arrow-up.svg)',
			'background-size': '16px'
			})
		},
		btn_down : function(){
			$(this).find('i').css({
			'background': 'url(./img/icon-arrow-down.svg)',
			'background-size': '16px'
			})
		}
	});
*/

// 내일 할일 : 평점 필터에 점수와 동일하게 별 갯수 맞추기............가격대 필터 수정하기 1000< 값<sort;
