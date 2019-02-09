/*
 #######################################################################
 #
 #  FUNCTION NAME : 
 #  AUTHOR        : 
 #  DATE          : 
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : 
 #  PARAMETERS    : 
 #
 #######################################################################
*/

/* GLOBAL VARIABLES */

$(document).ready(function() {

	//START DATE PICKER
	$("#startDatePicker, #endDatePicker").datepicker()

	//END DATE PICKER

	//AUTO-POPULATE LOCATION
	getInfoFromAPI("0")
	//populateLocation()

	$("#states, #stateLabel i").on("click", function() {
		$('#stateSelect').slideDown('fast');
	})

	$("#cities, #cityLabel i").on("click", function() {
		$('#citySelect').slideDown('fast');
	})

	$("#stateLabel, #cityLabel").on("mouseleave", function() {
		$('#stateSelect, #citySelect').slideUp('fast');
	})

})

/*
 #######################################################################
 #
 #  FUNCTION NAME : populateLocation
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 07, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : February 09, 2019 PST
 #  REVISION #    : 1
 #  DESCRIPTION   : populate location 
 #  PARAMETERS    : json data, flag
 #
 #######################################################################
*/

function populateLocation(data, flag) {

	var liString = appendDataString(data,flag,"")

	switch (flag) {
		case "0": case 0:
			$("#ulStateSelect").append(liString)

			$(".liStateSelect").on("click",function() {
				$("#states").val($(this).text())
				$('#stateSelect').slideUp('fast');
				getInfoFromAPI("1")
				$("#cities").attr("disabled",false)
				event.preventDefault();
			})
		break;
		case "1": case 1:
			$("#ulCitySelect").empty().append(liString)
			$("#cities").val(data[0].city)
			$(".liCitySelect").on("click",function() {
				$("#cities").val($(this).text())
				$('#citySelect').slideUp('fast');
				event.preventDefault();
			})
		break;
	}
		
}

/*
 #######################################################################
 #
 #  FUNCTION NAME : getInfoFromAPI
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 07, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : February 09, 2019 PST
 #  REVISION #    : 1
 #  DESCRIPTION   : submits and fetches info from API
 #  PARAMETERS    : flag number
 #
 #######################################################################
*/

function getInfoFromAPI(flag) {

	var queryURL
	var func 

	switch (flag) {
		case "0":
			queryURL = "https://battuta.medunes.net/api/region/us/all/?key=b5a73435674d312ed09479b91666a083"
		break;
		case "1":
			region = $("#states").val()
			queryURL = "https://battuta.medunes.net/api/city/us/search/?region="+region+"&key=b5a73435674d312ed09479b91666a083"
		break
	}

	$.ajax({
      url: queryURL,
      method: "GET",
      dataType: "jsonP",
      async: false
    }).then(function(data){
    	
    	data = JSON.stringify(data)
		switch (flag) {
			case "0": func = "populateLocation("+data+","+flag+");"; break;
			case "1": func = "populateLocation("+data+","+flag+");"; break;
			break
		}
		//console.log(func)
    	eval(func)
    
    })

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : appendDataString
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 09, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : appends data to string 
 #  PARAMETERS    : json data, flag, empty string
 #
 #######################################################################
*/

function appendDataString(data, flag, liString) {

	var key, cname

	switch (flag) {
		case 0: case "0":
			key = "region"
			cname = "liStateSelect"
		break;
		case "1": case 1:
			key = "city"
			cname = "liCitySelect"
		break;
	}

	for (var i = 0; i < data.length; i++) {
		liString += "<li class='"+cname+"'>"+data[i][key]+"</li>"
	}

	return liString

}