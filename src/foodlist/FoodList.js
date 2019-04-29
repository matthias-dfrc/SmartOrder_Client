
// 04.15 set global variables
var storeinfo = JSON.parse(sessionStorage["storeinfo"]);
console.log(storeinfo);
var foodinfo = [];
var basketMaster = JSON.parse(sessionStorage['basketmaster']);

// 04.10 save a menu name and match a array in menu_tab_list. it gives a index number of array becasue each array use a same food menu list.
var gotostore_name = JSON.parse(sessionStorage["store_name"]);
var gotostore_index = storeinfo.findIndex(function (item, i) {
    return item.storeName === gotostore_name[0]
});

//04.26 call foodinfo api
var xmlhttp_foodinfo = new XMLHttpRequest();

xmlhttp_foodinfo.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        foodinfo.push(JSON.parse(this.responseText));
        if (foodinfo.length === storeinfo.length) {
            renderFoodList();
        }
    }
};

for(var i = 0; i < storeinfo.length; i++) {
    xmlhttp_foodinfo.open("GET", `http://dev.wifiorder.com/api/foodinfo/list?foodTodayUse=Y&siteOperatorCode=`+storeinfo[i].siteOperatorCode+`&storeCode=`+storeinfo[i].storeCode+`&siteCode=`+storeinfo[i].siteCode+``, false);
    xmlhttp_foodinfo.send();
}

function renderFoodList() {
        for (var i = 0; i < storeinfo.length; i++) {
            // render store list
            var markup1 = `
                <div class="swiper-slide" >` + storeinfo[i].storeName + `</div>
        `;
            document.querySelector('div.slide_tab').insertAdjacentHTML('beforeend', markup1);

            //create menu list div after second menu
            var markup2 = `
                        <div class="swiper-slide swiper-slide-` + i + `">
                        </div>
                    `;
            if (i >= 2) {
                document.querySelector('div.slide_context').insertAdjacentHTML('beforeend', markup2);
            }
        };
            //render menu list
            // $.each(foodinfo, function (index1, val1) {
            //     $.each(val1, function (index2, val2) {
            for (var  j = 0; j < foodinfo.length; j++) {
                if (foodinfo[j].length === 0) {
                    var markup3 = `
                       <ul class="listWrap">
                           <li>
                               <div class="left">
                                   <p class="menu_img left"><img src="../../dist/images/content/menu_img.jpg" alt="상품준비중"/></p>
                                   <div class="txt_info left">
                                       <strong>상품을 준비중입니다</strong>
                                       <p class="price">다른 매장을 이용해 주세요</p>
                                   </div>
                               </div>
                           </li>
                       </ul>
                    `;
                    if (j === 0) {
                        document.querySelector('div.swiper-slide-active').insertAdjacentHTML('beforeend', markup3);
                    } else if (j === 1) {
                        document.querySelector('div.swiper-slide-next').insertAdjacentHTML('beforeend', markup3);
                    } else {
                        document.querySelector(`div.swiper-slide-` + j + ``).insertAdjacentHTML('beforeend', markup3);
                    }
                }
                for(var k = 0; k < foodinfo[j].length; k++) {
                    foodinfo[j][k].foodQuantity = 0;
                        var markup3 = `
                       <ul class="listWrap">
                           <li>
                               <div class="left">
                                   <p class="menu_img left"><a href="./FoodDetail.html"><img id="`+ foodinfo[j][k].foodCode+`" src="../../dist/images/content/menu_img.jpg" alt="` + foodinfo[j][k].foodName + `" id="` + foodinfo[j][k].foodName + `"/></a></p>
                                   <div class="txt_info left">
                                       <strong>` + foodinfo[j][k].foodName + `</strong>
                                       <p class="price"><span id="con_price` + k + `" >${foodinfo[j][k].foodCost}</span>원</p>
                                   </div>
                               </div>
                               <div class="right">
                                   <div id="input_div">
                                       <input type="button" class="minus" onclick='basketSubList(`+j+`,`+k+`, this.className)'>
                                       <input type="number" size="25" value="0" id="count${foodinfo[j][k].foodCode}" class="count">
                                       <input type="button" class="plus" onclick='basketSubList(`+j+`, `+k+`, this.className)'>
                                   </div>
                               </div>
                           </li>
                       </ul>
                    `;
                    if (j === 0) {
                        document.querySelector('div.swiper-slide-active').insertAdjacentHTML('beforeend', markup3);
                    } else if (j === 1) {
                        document.querySelector('div.swiper-slide-next').insertAdjacentHTML('beforeend', markup3);
                    } else {
                        document.querySelector(`div.swiper-slide-` + j + ``).insertAdjacentHTML('beforeend', markup3);
                    }

                };
            };
};


function calc_total_price () {
    var total_price =0;
    for(var i in foodinfo) {
        for(var j in foodinfo[i]) {
            if(foodinfo[i][j].foodQuantity > 0) {
                total_price += foodinfo[i][j].foodCost * foodinfo[i][j].foodQuantity;
            }
        }
    }

    $('input#total_count_view').val(total_price);
}


// 04.24 using basket sublist api

function basketSubList(j,k, className) {
    if (className === 'plus') {
        foodinfo[j][k].foodQuantity += 1;
        $(`input#count${foodinfo[j][k].foodCode}`).val(foodinfo[j][k].foodQuantity);
        calc_total_price();
    } else {
        if(foodinfo[j][k].foodQuantity > 0){
            foodinfo[j][k].foodQuantity += -1;
            $(`input#count${foodinfo[j][k].foodCode}`).val(foodinfo[j][k].foodQuantity);
            calc_total_price();
        }
    }

};

// 04.24 save todayfoodinfo id into session storage to open fooddetail page
$('div.left').on('click', function (e) {
    console.log(e.target.id);
    var event = e.target.id;

    //1) save the menu in an array
    var gotoFoodDetail = [];
    gotoFoodDetail[0] = event;

    //2) save the object in session storage
    sessionStorage["foodDetailCode"] = JSON.stringify(gotoFoodDetail);
    // sessionStorage.setItem("menu_key", JSON.stringify(gotomenu));


});


//04.08 saving session storage(from food detail)
function callBasketSubList () {
//    1) make dataBasketSublist object
    for (var j = 0; j < foodinfo.length; j++) {
        for (var k = 0; k < foodinfo[j].length; k++) {
            // when click a cart btn, call basketsublist and send it
            var dataBasketSubList = {};
            dataBasketSubList.siteOperatorCode = foodinfo[j][k].siteOperatorCode;
            dataBasketSubList.siteCode = foodinfo[j][k].siteCode;
            dataBasketSubList.basketNo = basketMaster.basketNo;
            dataBasketSubList.foodCode = foodinfo[j][k].foodCode;
            dataBasketSubList.foodQuantity = foodinfo[j][k].foodQuantity;
            dataBasketSubList.foodPrice = foodinfo[j][k].foodCost;
            dataBasketSubList.storeCode = foodinfo[j][k].storeCode;

        //    2) call basketusblist API when the foodQuantity is over a 0
            if(dataBasketSubList.foodQuantity > 0) {
                $.ajax({
                    url: "http://dev.wifiorder.com/api/basketsublist",
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    dataType: 'json',
                    processData:false,
                    data:JSON.stringify(dataBasketSubList),
                    success: function (results) {
                        sessionStorage['foodInfoQuantity'] = JSON.stringify(foodinfo);
                    },
                    error: function (err) {
                        alert('basket master api error');
                        console.log(err);
                    }
                });
            }

        }
    }
    alert('장바구니에 담아졌습니다. \n 우측 장바구니 아이콘을눌러 장바구니 페이지로 이동해주세요.');
    var total_quantity =0;
    for(var i in foodinfo) {
        for(var j in foodinfo[i]) {
        if(foodinfo[i][j].foodQuantity > 0) {
            total_quantity += foodinfo[i][j].foodQuantity;
            }
        }
    }
    $('span.quantity').text(`${total_quantity}`);
}