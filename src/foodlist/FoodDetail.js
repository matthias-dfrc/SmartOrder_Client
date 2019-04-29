// 04.11 remove hard cording
var details = ["꼬지어묵우동", 6500, "깊은맛의 육수에 꼬지어묵으로 맛을낸 넘버원 우동~", 1];

var data = {};
var todayfoodinfo = JSON.parse(sessionStorage['todayfoodinfo']);
var foodDetailCode = JSON.parse(sessionStorage['foodDetailCode']);
var foodInfoQuantity = JSON.parse(sessionStorage['foodInfoQuantity']);
console.log(foodInfoQuantity);

for(var i = 0; i < todayfoodinfo.length; i++) {
    if(foodDetailCode[0] === todayfoodinfo[i].foodCode) {
        data.siteOperatorCode = todayfoodinfo[i].siteOperatorCode;
        data.siteCode = todayfoodinfo[i].siteCode;
        data.storeCode = todayfoodinfo[i].storeCode;
    }
}
data.foodCode = foodDetailCode[0];
var detail = data;
console.log(todayfoodinfo);
console.log(data);


// call the fooddetailinfo api
$.ajax({
    url: "http://dev.wifiorder.com/api/fooddetailinfo",
    type: "GET",
    dataType: 'json',
    contentType: 'application/json',
    data: data,
    success: function (results) {
        // adding more information into results
        console.log(results);
        for(var i in foodInfoQuantity) {
            for(var j in foodInfoQuantity[i]) {
                if(detail.foodCode = foodInfoQuantity[i][j].foodCode) {
                    detail.foodName = foodInfoQuantity[i][j].foodName;
                    detail.foodCost = foodInfoQuantity[i][j].foodCost;
                    detail.foodPicLargeURL2 = foodInfoQuantity[i][j].foodPicLargeURL2;
                    detail.foodQuantity = 0;
                }
            }
        }
        detail.foodDetail1 = results.foodDetail1;
        detail.foodDetail2 = results.foodDetail2;
        detail.foodDetail3 = results.foodDetail3;
        detail.foodDetail4 = results.foodDetail4;
        renderDetail(detail);
    },
    error: function (err) {
        alert('fooddetailinfo api error or empty');
        console.log(err);
        renderDetail_error(details);
    }
});



console.log(detail);


function plus() {
    details[3]++;
    document.getElementById('count').value = details[3];
    document.getElementById('total_quantity').innerHTML = details[3];
    document.getElementById('total_count_view').value = details[1] * details[3]
}
function minus(){
    if (details[3] > 1) {
        details[3]--;
        document.getElementById('count').value = details[3];
        document.getElementById('total_quantity').innerHTML = details[3];
        document.getElementById('total_count_view').value = details[1] * details[3]
    }
}

function renderDetail(detail) {

    var markup = `
		<div class="food_img">
			<img src="../../dist/images/content/menu_img.jpg" alt="이미지" />
		</div>
		<div class="detail">
			<div class="left">
				<strong id="detail_food_name">` + detail.foodName + `</strong>
				<p class="price"><span id="con_price">` + detail.foodCost + `</span>원</p>
			</div>
			<div class="right">
				<div id="input_div">
					<input type="button" id="minus" onclick="minus()">
					<input type="" size="25" value="`+detail.foodQuantity+`" id="count" class="count">
					<input type="button" id="plus" onclick="plus()">
				</div>
			</div>
		</div>
		<div class="datail_view" style="padding-bottom:110px;">
			<div>
				<strong>상품정보</strong>
				<p>`+detail.foodDetail1+`</p>
			</div>
			<div>
				<strong>상품정보</strong>
				<p>`+detail.foodDetail2+`</p>
			</div>
			<div>
				<strong>상품정보</strong>
				<p>`+detail.foodDetail3+`</p>
			</div>
			<div>
				<strong>상품정보</strong>
				<p>`+detail.foodDetail4+`</p>
			</div>
		</div>
		<div class="bot_fixed">
			<ul class="quick_bt">
				<!-- 04.02 추가 -->
				<li class="basket" onclick="saveFoodDetail()"><img src="../../dist/images/content/basket_ic.png" alt="장바구니" /><span class="quantity" id="total_quantity">`+details[3]+`</span></li>
				<form>
					<input type="hidden" name="name" id="name" value="<?php $value?>">
				</form>
				<li class="back" onclick="javascript:history.go(-1)"><img src="../../dist/images/content/back_ic.png" alt="뒤로가기" /></li>
			</ul>
			<div class="price_total">
				<strong class="left">총 주문금액</strong>
				<div class="totalWrap right">
					<input type="text" value="`+details[1]+ `" id="total_count" hidden />
					<input type="text" value="`+ details.foodQuantity +`" id="total_count_view"/>원
				</div>
			</div>
			<ul class="bt_wrap">
				<li onclick="saveFoodDetail()">장바구니 담기</li>
				<li onclick="javascript:">바로 주문하기</li>
			</ul>
		</div>
    `;
    document.querySelector('div.content').insertAdjacentHTML('beforeend', markup);
}



function renderDetail_error(details) {

    var markup = `
		<div class="food_img">
			<img src="../../dist/images/content/menu_img.jpg" alt="이미지" />
		</div>
		<div class="detail">
			<div class="left">
				<strong id="detail_food_name">` + details[0] + `</strong>
				<p class="price"><span id="con_price">` + details[1] + `</span>원</p>
			</div>
			<div class="right">
				<div id="input_div">
					<input type="button" id="minus" onclick="minus()">
					<input type="" size="25" value="1" id="count" class="count">
					<input type="button" id="plus" onclick="plus()">
				</div>
			</div>
		</div>
		<div class="datail_view" style="padding-bottom:110px;">
			<div>
				<strong>상품정보</strong>
				<p>`+details[2]+`</p>
			</div>
			<div>
				<strong>상품정보</strong>
				<p>`+details[2]+`</p>
			</div>
		</div>
		<div class="bot_fixed">
			<ul class="quick_bt">
				<!-- 04.02 추가 -->
				<li class="basket" onclick="saveFoodDetail()"><img src="../../dist/images/content/basket_ic.png" alt="장바구니" /><span class="quantity" id="total_quantity">`+details[3]+`</span></li>
				<form>
					<input type="hidden" name="name" id="name" value="<?php $value?>">
				</form>
				<li class="back" onclick="javascript:history.go(-1)"><img src="../../dist/images/content/back_ic.png" alt="뒤로가기" /></li>
			</ul>
			<div class="price_total">
				<strong class="left">총 주문금액</strong>
				<div class="totalWrap right">
					<input type="text" value="`+details[1]+ `" id="total_count" hidden />
					<input type="text" value="`+ details[1] +`" id="total_count_view"/>원
				</div>
			</div>
			<ul class="bt_wrap">
				<li onclick="saveFoodDetail()">장바구니 담기</li>
				<li onclick="javascript:">바로 주문하기</li>
			</ul>
		</div>
    `;
    document.querySelector('div.content').insertAdjacentHTML('beforeend', markup);
}



