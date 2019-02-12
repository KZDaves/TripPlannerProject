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

/*$(document).ready(function() {

	
	fetchFromDB("",database)

	//Populate existing plans to page as buttons
	database.ref().on("value", function(snapshot){
		$("#existingPlans").empty(); 
		snapshot.forEach(function(childsnapshot){
			var button = $("<button>");
			button.attr("class", "existingPlanBtn"); 
			button.html(`${childsnapshot.val().cityName} <br> ${childsnapshot.val().planName}`);
			$("#existingPlans").append(button); 
		})
	});


})*/

$(document).ready(function() {

	$("#np").on("click", function() {
		$("#mainMenus").hide()
		$("#mainContainer").load("./assets/html/citystate.html",function() {
			initializeButtonsForNewPlan()
			$(this).show()
			$("#menu").show()
		})
	})

	$("#vp").on("click", function() {
		$("#mainMenus").hide()
		$("#mainContainer").load("./assets/html/existingPlans.html",function() {
			//initializeButtonsForNewPlan()
			$(this).show()
			$("#menu").show()
			database.ref().on("value", function(snapshot){
				$("#existingPlans").empty(); 
				snapshot.forEach(function(childsnapshot){
					var button = $("<button>");
					button.attr("class", "existingPlanBtn"); 
					button.html(`${childsnapshot.val().cityName} <br> ${childsnapshot.val().planName}`);
					$("#existingPlans").append(button); 
				})
			});
		})
	})

})

/*
 #######################################################################
 #
 #  FUNCTION NAME : populateLocation
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 07, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : February 12, 2019 PST
 #  REVISION #    : 3
 #  DESCRIPTION   : populate location 
 #  PARAMETERS    : flag
 #
 #######################################################################
*/

function populateLocation(flag) {

	var liString = appendDataString(flag,"")

	switch (flag) {
		case "0": case 0:
			$("#ulStateSelect").append(liString)

			$(".liStateSelect").on("click",function() {
				$("#states").val($(this).text())
				$('#stateSelect').slideUp('fast');
				populateLocation("1")
				$("#cities").attr("disabled",false)
				event.preventDefault();
			})
		break;
		case "1": case 1:
			$("#ulCitySelect").empty().append(liString)
			var selCity = ucwords(uscities[$("#states").val()][0].toLowerCase())
			$("#cities").val(selCity)
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
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : February 12, 2019 PST
 #  REVISION #    : 1
 #  DESCRIPTION   : appends data to string 
 #  PARAMETERS    : json data, flag, empty string
 #
 #######################################################################
*/

function appendDataString(flag, liString) {

	var key, cname
	var keys = []

	console.log(flag)

	switch (flag) {
		case 0: case "0":
			for (name in uscities) {
				keys.push(name)
			}
			cname = "liStateSelect"
		break;
		case "1": case 1:
			key = $("#states").val()
			for (var m = 0; m < uscities[key].length; m++) {
				keys.push(ucwords(uscities[key][m].toLowerCase()))
			}
			cname = "liCitySelect"
		break;
	}

	for (var i = 0; i < keys.length; i++) {
		console.log("K: "+keys)
		liString += "<li class='"+cname+"'>"+keys[i]+"</li>"
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
 #  FUNCTION NAME : initializeButtonsForNewPlan
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 10, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : initializes button when new plan button is clicked
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function initializeButtonsForNewPlan() {

	//START and END DATE PICKER
	$("#startDatePicker, #endDatePicker").datepicker({
      changeMonth: true,
      changeYear: true,
      minDate: 0
    })

	//AUTO-POPULATE LOCATION
	//getInfoFromAPI("0")
	populateLocation("0")

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

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : showInformation
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 10, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : shows information of selected plan
 #  PARAMETERS    : node name
 #
 #######################################################################
*/

function showInformation(node) {

	$("#planContainer").dialog({
		// height: "auto",
		width: "1200px",
		resizable: false,
		modal: true,
		closeOnEscape: false,
        open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); $(".ui-dialog :button").blur();},
		buttons: {
			"Edit": function() {
				$("#planContainer").dialog("destroy");
				$(this).empty().dialog("close");
				eval(todo);
			},
			"Close": function() {
				$("#planContainer").dialog("destroy");
				$(this).empty().dialog("close");
				eval(todo);
			}
		}
	});

	$("#planContainer").dialog("open").load("./assets/html/existingPlanDetails.html",function() {
	})

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : ucwords
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 12, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : capitalizes the first letter of the string
 #  PARAMETERS    : string
 #
 #######################################################################
*/

function ucwords (str) {

    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });

} 