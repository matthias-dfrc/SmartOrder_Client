//04.26 set global variables
    var basketMaster = JSON.parse(sessionStorage['basketmaster']);
    console.log(basketMaster);
    var foodInfoQuantity = JSON.parse(sessionStorage['foodInfoQuantity']);
    console.log(foodInfoQuantity);

    var orderData = {
        'siteOperatorCode' : basketMaster.siteOperatorCode,
        'siteCode' : basketMaster.siteCode,
        'orderAmount' : 0,
        'orderPayStatus' : basketMaster.orderStatus,
        'basketNo' : basketMaster.basketNo,
        'visitorId' : basketMaster.visitorId
    };

    var basketSubList = [];

//04.26 insert keys foodName, foodPicLargeURL2
    function basketSubListMapping() {
        for (var i in basketSubList) {
            for (var j in foodInfoQuantity) {
                for (var k in foodInfoQuantity[j]) {
                    if (basketSubList[i].foodCode === foodInfoQuantity[j][k].foodCode) {
                        basketSubList[i].foodName = foodInfoQuantity[j][k].foodName;
                        basketSubList[i].foodPicLargeURL2 = foodInfoQuantity[j][k].foodPicLargeURL2;
                    }
                }
            }
        }
        console.log(basketSubList);
    }
    // 04.26 CALL basketsublit api
    var xmlhttp_basketSubList = new XMLHttpRequest();

    xmlhttp_basketSubList.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            basketSubList = JSON.parse(this.responseText);
            basketSubListMapping();
            renderCartList();
        }
    };

    xmlhttp_basketSubList.open("GET", `http://dev.wifiorder.com/api/basketsublist/list?siteOperatorCode=` + basketMaster.siteOperatorCode + `&siteCode=` + basketMaster.siteCode + `&basketNo=` + basketMaster.basketNo + ``, false);
    xmlhttp_basketSubList.send();

    //04.26 render CartList
    function renderCartList() {
        $('div.basket_num').text(`장바구니 번호: ${basketMaster.basketNo}`);

        if (basketSubList.length === 0) {

        } else {
        for (var i = 0; i < basketSubList.length; i++) {
                var markup = `
                        <ul>
                            <li>
                                <div class="left" style="overflow:hidden;">
                                    <p class="menu_img left"><a href="../foodlist/FoodDetail.html"><img src="../../dist/images/content/menu_img.jpg" alt="` + basketSubList[i].foodName + `" /></a></p>
                                    <div class="txt_info left">
                                        <strong>` + basketSubList[i].foodName + `</strong>
                                        <p class="price"><span id="con_price` + i + `">${basketSubList[i].foodPrice}</span>원</p>
                                    </div>
                                </div>
                                <div class="right">
                                    <p class="cancel" onclick="cancel(` + i + `)">취소</p>
                                    <div id="input_div">
                                        <input type="button" class="minus" onclick="minus(` + i + `)">
                                        <input type="number" size="25" value="` + basketSubList[i].foodQuantity + `" id="count` + i + `" class="count">
                                        <input type="button" class="plus" onclick="plus(` + i + `)">
                                    </div>
                                </div>
                            </li>
                        </ul>
                    `;
                document.querySelector('div.menu_list').insertAdjacentHTML("beforeend", markup);
            }
        }
        calcTotalPrice();
    };

// 04.15 new plus minus btn for each menus
    function plus(i) {
        basketSubList[i].foodQuantity += 1;
        $(`input#count${i}`).val(basketSubList[i].foodQuantity);
        calcTotalPrice();
    }

    function minus(i) {
        if (basketSubList[i].foodQuantity > 0) basketSubList[i].foodQuantity += -1;
        $(`input#count${i}`).val(basketSubList[i].foodQuantity);
        calcTotalPrice();
    }

// 04.25 calc total price
    function calcTotalPrice() {
        var total_price = 0;
        for (var i in basketSubList) {
            if (basketSubList[i].foodPrice != null) {
                total_price += basketSubList[i].foodPrice * basketSubList[i].foodQuantity;
            }
        }
        $('input#total_count_view').val(total_price);
    }

// 04.01 cancel function
    function cancel(i) {
        var data = {
            "siteOperatorCode": basketSubList[i].siteOperatorCode,
            "siteCode": basketSubList[i].siteCode,
            "basketNo": basketSubList[i].basketNo,
            "foodCode": basketSubList[i].foodCode
        };
        $.ajax({
            type: "DELETE",
            url: 'http://dev.wifiorder.com/api/basketsublist',
            data: data,
            success: function (data) {
                console.log(data);
                location.reload();
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    };


// 04.16 60secs count down
    function count_down() {
        var counter = 60;
        var interval = setInterval(function () {
            counter--;
            // Display 'counter' wherever you want to display it.
            if (counter <= 0) {
                clearInterval(interval);
                $('#timer').html("<h3>시간이 만료되었습니다.</h3>");
                return;
            } else {
                $('#time').text(counter);
                console.log("Timer --> " + counter);
            }
        }, 1000);
    };

//04.26 final updating basket with basketsublitapi

function finalBasketUpdating () {

    var data = {};

    for(var i in basketSubList) {
        data.siteOperatorCode = basketSubList[i].siteOperatorCode;
        data.siteCode = basketSubList[i].siteCode;
        data.basketNo = basketSubList[i].basketNo;
        data.foodCode = basketSubList[i].foodCode;
        data.foodQuantity = basketSubList[i].foodQuantity;
        data.foodPrice = basketSubList[i].foodPrice;
        data.storeCode = basketSubList[i].storeCode;

        orderData.orderAmount += basketSubList[i].foodQuantity * basketSubList[i].foodPrice;

        $.ajax({
            url: "http://dev.wifiorder.com/api/basketsublist",
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: 'json',
            processData:false,
            data:JSON.stringify(data),
            success: function (results) {
                console.log(results);
                console.log(orderData);
            },
            error: function (err) {
                alert('puting basketsublit api error');
                console.log(err);
            }
        });
    }
}


//Popup open
function popupLayer(layerId){

    $("#"+layerId).fadeIn();
    $contents = $("#"+layerId).find(".pop-layer");

    var $elWidth = ~~($contents.outerWidth()),
        $elHeight = ~~($contents.outerHeight());

    $contents.css({
        marginTop: -$elHeight /2,
        marginLeft: -$elWidth/2
    })
    $contents.find(".btn-layerClose").click(function(){
        $("#"+layerId).fadeOut();
    });
}

//04.29 order status checking for individual order or integrated order

function orderStatus (id) {
    if (basketMaster.orderStatus = 'N') {
        popupLayer(id);
        finalBasketUpdating();
    } else if (basketMaster.orderStatus = 'J') {
        popupLayer(id);
    } else {
        popupLayer('layerId3')
    }
}

function individualOrder () {
    $.ajax({
        url: "http://dev.wifiorder.com/api/ordermaster",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: 'json',
        processData:false,
        data:JSON.stringify(orderData),
        success: function (results) {
            console.log(results);
            // location.replace('../purchasing/Purchase');
        },
        error: function (err) {
            alert('ordermaster api error');
            console.log(err);
        }
    });
}