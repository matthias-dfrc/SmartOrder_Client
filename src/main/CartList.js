//04.26 set global variables
    var basketMaster = JSON.parse(sessionStorage['basketmaster']);
    console.log(basketMaster);
    var foodInfoQuantity = JSON.parse(sessionStorage['foodInfoQuantity']);
    console.log(foodInfoQuantity);

//04.26 insert keys foodName, foodPicLargeURL2
    var basketSubList = [];

    function basketSubListRender() {
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
            basketSubListRender();
            renderCartList();
        }
    };

    xmlhttp_basketSubList.open("GET", `http://dev.wifiorder.com/api/basketsublist/list?siteOperatorCode=` + basketMaster.siteOperatorCode + `&siteCode=` + basketMaster.siteCode + `&backetNo=` + basketMaster.basketNo + ``, false);
    xmlhttp_basketSubList.send();

    //04.26 render CartList
    function renderCartList() {
        $('div.basket_num').text(`장바구니 번호: ${basketMaster.basketNo}`);
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

