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

//DATABASE CONFIG
// Initialize Firebase
var config = {
    apiKey: "AIzaSyARhBOFgmMf_9cj5S_Eq3zKI6D4AqCNIz4",
    authDomain: "tripplanner-47fd1.firebaseapp.com",
    databaseURL: "https://tripplanner-47fd1.firebaseio.com",
    projectId: "tripplanner-47fd1",
    storageBucket: "tripplanner-47fd1.appspot.com",
    messagingSenderId: "556604987785"
};
firebase.initializeApp(config);
var database = firebase.database();

$(document).ready(function() {

	//START and END DATE PICKER
	$("#startDatePicker, #endDatePicker").datepicker({
      changeMonth: true,
      changeYear: true,
      minDate: 0
    })

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

	$("#searchBtn").on("click",function() {
		var isOK = validateInfo()
	})

	
	fetchFromDB("",database)

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
  
/*
 #######################################################################
 #
 #  FUNCTION NAME : validateInfo
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 09, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : validates info to be submitted  
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function validateInfo() {

	//STATE
	var st = $("#states").val()
	var ci = $("#cities").val()
	var sd = $("#startDatePicker").val();
	var ed = $("#endDatePicker").val();

	console.log(st+" >> "+ci+" >> "+sd+" >> "+ed)

	if (st == "" & ci == "") {
		alertMsg("prompt","Please provide all required fields.","")
	} else if (sd !== "" && ed == "") {
		alertMsg("prompt","Please provide an end date for your trip.","")
	  } else if (sd == "" && ed != "") {
			alertMsg("prompt","Please provide a start date for your trip.","")
	    }


}

/*
 #######################################################################
 #
 #  FUNCTION NAME : alertMsg
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 09, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : for error prompts or confirmation  
 #  PARAMETERS    : msg type, message, functions to do
 #
 #######################################################################
*/

function alertMsg(type, msg, todo) {

	switch(type) {
		case "prompt":
			$( "#msg" ).remove();
			$("body").append("<div id='msg' style='display:none' class='label'><center>"+msg+"</msg>");
			$( "#msg" ).dialog({
				height: "auto",
				resizable: false,
				closeOnEscape: false,
				modal: true,
	            open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); $(".ui-dialog :button").blur(); },
				buttons: {
					"OK": function() {
						eval(todo);
						$("#msg").dialog("destroy");
						$(this).dialog("close");
					}
					/*"Cancel": function() {
						$("#msg").dialog("destroy");
						$(this).dialog("close");
					}*/
				}
			});
		break;
		case "confirm":
			$( "#msg" ).remove();
			$("body").append("<div id='msg' style='display:none' class='label'><center>"+msg+"</msg>");
			//$( "#msg" ).dialog("destroy");
			$( "#msg" ).dialog({
				height: "auto",
				resizable: false,
				modal: true,
				closeOnEscape: false,
	            open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); $(".ui-dialog :button").blur();},
				buttons: {
					"Yes": function() {
						$("#msg").dialog("destroy");
						$(this).dialog("close");
						eval(todo);
					},
					"No": function() {
						$("#msg").dialog("destroy");
						$(this).dialog("close");
					}
				}
				});
		break;	
	}

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : fetchFromDB
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 09, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : February 10, 2019 PST
 #  REVISION #    : 1
 #  DESCRIPTION   : fetches plan details from database
 #  PARAMETERS    : node or id
 #
 #######################################################################
*/

function fetchFromDB(node) {

	node = "plan2"

	database.ref(node).once("value",function(ss) {
		console.log(ss.val())
		$("#planName").text(ss.val().planName)
		$("#planDate").text(ss.val().startDate)
		$("#planLocation").text(ss.val().cityName+", "+ss.val().state)
		//EVENTS
		var div = $("<div>")
		div.attr("class","infoClass")
		for (var j = 0; j < ss.val().ticketMaster.length; j++) {
			div.append(" - "+ss.val().ticketMaster[j]+"<br>")
		}
		$("#eventInfo").append(div)
		var div2 = $("<div>")
		div2.attr("class","infoClass")
		for (var j = 0; j < ss.val().breweries.length; j++) {
			div2.append(" - "+ss.val().breweries[j]+"<br>")
		}
		$("#breweryInfo").append(div2)
		var div3 = $("<div>")
		div3.attr("class","infoClass")
		for (var j = 0; j < ss.val().restaurants.length; j++) {
			div3.append(" - "+ss.val().restaurants[j].restaurantName+" "+ss.val().restaurants[j].rating+" "+ss.val().restaurants[j].foodStyle+"<br>")
		}
		$("#restaurantInfo").append(div3)
		var div4 = $("<div>")
		div4.attr("class","infoClass")
		div4.append(" - "+ss.val().weatherInfo+"<br>")
		$("#weatherInfo").append(div4)
	})

}
