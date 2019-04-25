//04.17 calling api and save data into session storage
$( document ).ready(function() {
    var data = {
        "siteOperatorCode": "00003",
        "siteCode": "0000000001"
    };
    // call the sitemaster api and save a session storage
    $.ajax({
        method: "GET",
        url: "http://dev.wifiorder.com/api/sitemaster",
        data: data,
        dataType: 'json',
        contentType: 'application/json'
    })
        .done(function(data) {
            sessionStorage["sitemaster"] = JSON.stringify(data);
        });

    // call the storeinfo api and save a session storage
    $.ajax({
        method: "GET",
        url: "http://dev.wifiorder.com/api/storeinfo/list",
        data: data,
        dataType: 'json',
        contentType: 'application/json'
    })
        .done(function(data) {
            sessionStorage["storeinfo"] = JSON.stringify(data);
        });

    // call the todayfood api
    $.ajax({
        method: "GET",
        url: "http://dev.wifiorder.com/api/todayfoodinfo/list",
        data: data,
        dataType: 'json',
        contentType: 'application/json'
    })
        .done(function(data) {
            sessionStorage["todayfoodinfo"] = JSON.stringify(data);
            render_todayfoodinfo(data);
        });

    //basketmaster API calling with body request -> basket number
    $.ajax({
        url: "http://dev.wifiorder.com/api/basketmaster",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: 'json',
        processData:false,
        data:JSON.stringify({
            "siteOperatorCode":"00003",
            "siteCode":"0000000001",
            "visitorId":"001"
        }),
        success: function (results) {
            sessionStorage["basketmaster"] = JSON.stringify(results);
            console.log(sessionStorage['basketmaster']);
        },
        error: function (err) {
            alert('basket master api error');
            console.log(err);
        }
    });

    //render a reststop name
    $(function () {
        var sitemaster = JSON.parse(sessionStorage["sitemaster"]);
        console.log(sitemaster);

        var markup = `
            <div class="welcome" >`+ sitemaster.siteName +`에 오신것을 환영합니다.</div>
        `;
        document.querySelector('div#header').insertAdjacentHTML('beforeend', markup);
    });

    //render a store info
    $(function () {
        var storeinfo = JSON.parse(sessionStorage["storeinfo"]);
        console.log(storeinfo);
        for(var i=0; i < storeinfo.length; i++) {
            var markup = `
                <li><a href="../foodlist/FoodList.html"><img id="` + storeinfo[i].storeName + `" src="../../dist` + storeinfo[i].storePicURL + `"/>` + storeinfo[i].storeName + `</a></li>
            `;
            document.querySelector('ul.menus').insertAdjacentHTML('beforeend', markup);
        }
    });
});

// render today food info

function render_todayfoodinfo(data) {
    console.log(data);
    for(var i = 0; i < data.length; i++) {
        var markup = `
            <div ><a href="../foodlist/FoodDetail.html"><img src="../..`+ data[i].foodPicURL1+`" alt="네트워크가 느립니다 잠시만 기다려주세요" id="`+ data[i].foodCode +`" /></a></div>
        `;
        document.querySelector('div.slider').insertAdjacentHTML('beforeend', markup);
    }
    $('div.slider').bxSlider({
        mode: 'fade',
        speed: 900,
        auto: true,
        pager: true,
        controls:false,
    });
}


// 04.22 save main menu id into session storage to open menu tab on Foodlist.
$('div.menu').on('click', function (e) {
    console.log(e.target.id);
    var event = e.target.id;
    //1) save the menu in an array
    var gotomenu = [];
    gotomenu[0] = event;

    //2) save the object in session storage
    sessionStorage["store_name"] = JSON.stringify(gotomenu);
    // sessionStorage.setItem("menu_key", JSON.stringify(gotomenu));
});

// 04.24 save todayfoodinfo id into session storage to open fooddetail page
$('div.visual').on('click', function (e) {
    console.log(e.target.id);
    var event = e.target.id;
    //1) save the menu in an array
    var gotoFoodDetail = [];
    gotoFoodDetail[0] = event;

    //2) save the object in session storage
    sessionStorage["foodDetail"] = JSON.stringify(gotoFoodDetail);
    // sessionStorage.setItem("menu_key", JSON.stringify(gotomenu));
});



// //04.08 saving session storage(from food detail)
// function saveFoodDetail () {
//     //1) make object to save food detail
//     var orderDetail = [{name:document.getElementById("detail_food_name").value, count: document.getElementById("count").value}];
//     //2) save data to Session storage with transfering object to JSON String
//     sessionStorage.setItem("orderDetail", JSON.stringify((orderDetail)));
//
//     console.log(sessionStorage.getItem("orderDetail"));
//     location.href="../main/CartList.html"
// }