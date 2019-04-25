// 수량 js
// var count = 1;
// var countEl = document.getElementById("count");
// var total_count = document.getElementById("total_count"); //추가
// var total_count_view = document.getElementById("total_count_view"); //추가

// var value;
// value = $("name").val();


// function plus(){
//   count++;
//   countEl.value = count;
//   total_count_view.value = total_count.value * countEl.value; //추가
//     $("#total_quantity").text(count); //추가 04.02
//
// }
//
// function minus(){
//
//   if (count > 1) {
// 	count--;
// 	countEl.value = count;
//   total_count_view.value = total_count_view.value - total_count.value; //추가
//       $("#total_quantity").text(count); //추가 04.02;
//   }
// }

//팝업오픈
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

