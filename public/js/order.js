$(document).ready(function(){
  console.log(1);
	function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
	  try {
	    decimalCount = Math.abs(decimalCount);
	    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

	    const negativeSign = amount < 0 ? "-" : "";

	    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
	    let j = (i.length > 3) ? i.length % 3 : 0;

	    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "") + '\tVND';
	  } catch (e) {
	    console.log(e)
	  }
	};
	 
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://console.ghn.vn/api/v1/apiv3/GetDistricts",
  "method": "POST",
  "processData": false,
  "data": "\n{\n\t\"token\" : \"5c239d8a94c06b2dc11d09b6\"\n}"
};


//get district

$.ajax(settings).done(function (response) {
	var provinceID = [];
	$.each(response.data, function(index, item) {
			provinceID.push(item.ProvinceID);
	});

	// xoa cac phan tu trung nhau
	for (i=0;i<(provinceID.length)-1;i++){
    j=i+1;
    while (j<provinceID.length)
      if (provinceID[i]==provinceID[j]){
         for (k=j;k<(provinceID.length)-1;k++) provinceID[k] = provinceID[k+1];
         provinceID.length =(provinceID.length)-1;
      }
      else j=j+1;
   }

   // sap xep id tang dan
   for(let i = 0; i< provinceID.length; i++)
   		for(let j = i+1; j< provinceID.length; j++){
   			if(provinceID[i] > provinceID[j]){
   				let temp = provinceID[i];
   				provinceID[i] = provinceID[j];
   				provinceID[j] = temp;
   			}
   		}

   		// show districtName
   	$.each(provinceID, function(index, item) {
   		 $.each(response.data, function(index, val) {
   		 	 if(val.ProvinceID === item){
   		 	 	let add = val.ProvinceName + ' - ' + val.DistrictName
   		 	 	if(val.ProvinceName !== val.DistrictName)
   		 	 		$('select#distric').append("<option class ='select-item' value ="+ val.DistrictID +">"+ add +"</option>");
   		 	 }
   		 });
   	});

   	 var distLoadID = $('select#distric').find(':selected').val(); 
	   console.log(distLoadID);
	   var settingGetward = {
			  "async": true,
			  "crossDomain": true,
			  "url": "https://console.ghn.vn/api/v1/apiv3/GetWards",
			  "method": "POST",
			  "processData": false,
			  "data": "{\n    \"token\": \"5c239d8a94c06b2dc11d09b6\",\n    \"DistrictID\": "+distLoadID+"\n}"
			}
	   $.ajax(settingGetward).done(function (response) {
			  var wards = [];
			  $.each(response.data, function(key, val) {
			  	 wards = val;
			  });
			  console.log(wards);
			  $('select#ward').html('');
			  if(wards !== null){
			  	$.each(wards, function(index, item) {
			  	 $('select#ward').append("<option value ="+ item.WardCode +">"+ item.WardName +"</option>")
			  });
		  }	
		});

	});

	// get wards anf find service transport

	$('select#distric').change(function(event) {
   		  var optionSelected = $(this).find("option:selected");
	     var districtID  = optionSelected.val();
	     var textSelected   = optionSelected.text();
	     var weight = $('div.order-item').length * 500;
	     console.log(districtID);
	     console.log(textSelected);

	     //get wards
		var wardsConfig = {
		  "async": true,
		  "crossDomain": true,
		  "url": "https://console.ghn.vn/api/v1/apiv3/GetWards",
		  "method": "POST",
		  "processData": false,
		  "data": "{\n    \"token\": \"5c239d8a94c06b2dc11d09b6\",\n    \"DistrictID\": "+districtID+"\n}"
		}

		$.ajax(wardsConfig).done(function (response) {
		  var wards = [];
		  $.each(response.data, function(key, val) {
		  	 wards = val;
		  });
		  console.log(wards);
		  $('select#ward').html('');
		  if(wards !== null){
		  	$.each(wards, function(index, item) {
		  	 $('select#ward').append("<option value ="+ item.WardCode +">"+ item.WardName +"</option>")
		  });
		  }	
		});

		// find transport
		var serviceConfig = {
		  "async": true,
		  "crossDomain": true,
		  "url": "https://console.ghn.vn/api/v1/apiv3/FindAvailableServices",
		  "method": "POST",
		  "processData": false,
		  "data": "{\n    \"token\": \"5c239d8a94c06b2dc11d09b6\",\n    \"FromDistrictID\": 1617,\n    \"ToDistrictID\": "+districtID+",\n    \"Weight\": "+weight+",\n    \"Length\": 20,\n    \"Width\": 20,\n    \"Height\": 30\n}"
		}

		$.ajax(serviceConfig).done(function (response) {
		  console.log(response);
		  var arr = response.data;
		  $('tbody.service-item').html('');
		  $.each(arr, function(index, item) {
		  	let timeTrans = new Date(item.ExpectedDeliveryTime);
		  	let nowDate = new Date();
		  	let ms = Math.floor(timeTrans.getTime() - nowDate.getTime());
		  	let day = Math.floor(ms/(24*60 *60 *1000));
		  	 $('tbody.service-item').append('<tr><td><input id = "control'+ (index + 1) +'" value = '+item.ServiceID+' type = "radio" class = "service-control" name = "service"/><label for = "control'+(index +1)+'" ><span></span>Giao hàng '+ item.Name +'</label></td><td>'+ (day-1)+ ' - '+ day +' ngày</td><td>'+formatMoney(item.ServiceFee)+'</td></tr>')
		  });
		});
   	});


	//validate info 

   	function valiInfo(selector, errName){
   			$(selector).on('input', function(){
	   		if($(selector).val() === ''){
	   			$('label[for = '+errName +'] span.err').css('display', 'block');
	   			$('label[for = '+errName +'] span:first-child').css('display', 'none');
	   			$(selector).css('border-color', 'red');
	   		}
	   		if($(selector).val() !== ''){
	   			$('label[for = '+errName +'] span.err').css('display', 'none');
	   			$('label[for = '+errName +'] span:first-child').css('display', 'block');
	   			$(selector).css('border-color', '#ddd');
	   		}
	   		
   		})
   	}
   	valiInfo('input#name', 'name');
   	valiInfo('input#phone', 'phone');
   	valiInfo('input#add', 'add');

   
     
});