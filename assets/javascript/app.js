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
    apiKey: "AIzaSyARhBOFgmMf_9cj5S_Eq3zKI6D4AqCNIz4"
    , authDomain: "tripplanner-47fd1.firebaseapp.com"
    , databaseURL: "https://tripplanner-47fd1.firebaseio.com"
    , projectId: "tripplanner-47fd1"
    , storageBucket: "tripplanner-47fd1.appspot.com"
    , messagingSenderId: "556604987785"
};
firebase.initializeApp(config);

var database = firebase.database();
var selState = "" // selected state
var selCity = "" // selected city
var selSD = "" //selected start date
var selED = "" // selected end date

$(document).ready(function () {
 
    $("#np").on("click", function () {
        $("#mainMenus").hide()
        $("#mainContainer").load("./assets/html/citystate.html", function () {
            initializeButtonsForNewPlan()
            $(this).show()
            $("#menu").show()
        })
    })

    $("#vp").on("click", function () {
        $("#mainMenus").hide()
        $("#mainContainer").load("./assets/html/existingPlans.html", function () {
            $(this).show()
            $("#menu").show()
            fetchFromDBForEP();
        })
    })

    $("#menu i").on("mouseenter", function () {
        $(".submenus").slideDown("fast")
    })

    $(".submenus").on("mouseleave", function () {
        $(this).slideUp('fast');
    })

    $(".submenus span:first-child").on("click", function () {
        $("#mainContainer").load("./assets/html/existingPlans.html", function () {
            fetchFromDBForEP();
            $(".submenus").slideUp("fast")
        })
    })

    $(".submenus span:last-child").on("click", function () {
        $("#mainContainer").empty().load("./assets/html/citystate.html", function () {
            initializeButtonsForNewPlan()
            $(".submenus").slideUp("fast")
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
 
    var liString = appendDataString(flag, "")
    switch (flag) {
    case "0":
    case 0:
        $("#ulStateSelect").append(liString)
        $(".liStateSelect").on("click", function () {
            $("#states").val($(this).text())
            $('#stateSelect').slideUp('fast');
            populateLocation("1")
            $("#cities").attr("disabled", false)
            event.preventDefault();
        })
        break;
    case "1":
    case 1:
        $("#ulCitySelect").empty().append(liString)
        var selC = ucwords(uscities[$("#states").val()][0].toLowerCase())
        $("#cities").val(selC)
        $(".liCitySelect").on("click", function () {
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
 #  REVISION DATE : February 12, 2019 PST
 #  REVISION #    : 2
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
        queryURL = "https://battuta.medunes.net/api/city/us/search/?region=" + region + "&key=b5a73435674d312ed09479b91666a083"
        break
    case "2":
        queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + selCity + "&by_state=" + selState + "&sort=name&per_page=50"
            //console.log(queryURL)
        break;
    }

    $.ajax({
        url: queryURL,
        method: "GET",
        //dataType: "jsonP",
        async: false
    }).then(function (data) {
        data = JSON.stringify(data)
        switch (flag) {
	        case "0": func = "populateLocation(" + data + "," + flag + ");"; break;
	        case "1": func = "populateLocation(" + data + "," + flag + ");"; break;
	        case "2": func = "populateBreweryPlan(" + data + "," + flag + ");"; break;
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
        liString += "<li class='" + cname + "'>" + keys[i] + "</li>"
    }

    return liString

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : validateInfo
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 09, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : February 12, 2019 PST
 #  REVISION #    : 1
 #  DESCRIPTION   : validates info to be submitted  
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function validateInfo() {
   
    var st = $("#states").val()
    var ci = $("#cities").val()
    var sd = $("#startDatePicker").val();
    var ed = $("#endDatePicker").val();
    if (st == "" & ci == "") {
        alertMsg("prompt", "Please provide all required fields.", "")
        return 0
    } else if (sd !== "" && ed == "") {
        alertMsg("prompt", "Please provide an end date for your trip.", "")
        return 0
      } else if (sd == "" && ed != "") {
	        alertMsg("prompt", "Please provide a start date for your trip.", "")
	        return 0
    	} else if (sd > ed) {
	        alertMsg("prompt", "Start date can't be greater than end date.", "")
	        return 0
    	  } else {
		        selCity = ci
		        selState = st
		        selSD = sd
		        selED = ed
		        return 1
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

    switch (type) {
	    case "prompt":
	        $("#msg").remove();
	        $("body").append("<div id='msg' style='display:none' class='label'><center>" + msg + "</msg>");
	        $("#msg").dialog({
	            height: "auto",
				resizable: false,
	            closeOnEscape: false,
	            modal: true,
	            open: function (event, ui) {
	                $(".ui-dialog-titlebar-close").hide();
	                $(".ui-dialog :button").blur();
	            },
	            buttons: {
	                "OK": function () {
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
	        $("#msg").remove();
	        $("body").append("<div id='msg' style='display:none' class='label'><center>" + msg + "</msg>");
	        //$( "#msg" ).dialog("destroy");
	        $("#msg").dialog({
	            height: "auto"
	            resizable: false
	            modal: true
	            closeOnEscape: false
	            open: function (event, ui) {
	                $(".ui-dialog-titlebar-close").hide();
	                $(".ui-dialog :button").blur();
	            }
	            buttons: {
	                "Yes": function () {
	                    $("#msg").dialog("destroy");
	                    $(this).dialog("close");
	                    eval(todo);
	                },
	                "No": function () {
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

    database.ref(node).once("value", function (ss) {
        //console.log(ss.val())
        $("#planName").text(ss.val().planName)
        $("#planDate").text(ss.val().startDate)
        $("#planLocation").text(ss.val().cityName + ", " + ss.val().state)
            //EVENTS
        var div = $("<div>")
        div.attr("class", "infoClass")
        for (var j = 0; j < ss.val().ticketMaster.length; j++) {
            div.append(" - " + ss.val().ticketMaster[j] + "<br>")
        }
        $("#eventInfo").append(div)
        var div2 = $("<div>")
        div2.attr("class", "infoClass")
        for (var j = 0; j < ss.val().breweries.length; j++) {
            div2.append(" - " + ss.val().breweries[j] + "<br>")
        }
        $("#breweryInfo").append(div2)
        var div3 = $("<div>")
        div3.attr("class", "infoClass")
        for (var j = 0; j < ss.val().restaurants.length; j++) {
            div3.append(" - " + ss.val().restaurants[j].restaurantName + " " + ss.val().restaurants[j].rating + " " + ss.val().restaurants[j].foodStyle + "<br>")
        }
        $("#restaurantInfo").append(div3)
        var div4 = $("<div>")
        div4.attr("class", "infoClass")
        div4.append(" - " + ss.val().weatherInfo + "<br>")
        $("#weatherInfo").append(div4)
    })

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

    $("#states, #stateLabel i").on("click", function () {
        $('#stateSelect').slideDown('fast');
    })

    $("#cities, #cityLabel i").on("click", function () {
        $('#citySelect').slideDown('fast');
    })

    $("#stateLabel, #cityLabel").on("mouseleave", function () {
        $('#stateSelect, #citySelect').slideUp('fast');
    })

    $("#searchBtn").on("click", function () {
        var isOK = validateInfo()
        if (isOK == 1) {
            $("#mainContainer").load("./assets/html/userSelectPlan.html", function () {
                $(".city-state").text(selCity + ", " + selState)
                if (selSD != "" && selED != "") 
                	$(".cs-date").text(selSD + " - " + selED)
                getInfoFromAPI("2")
                getEvents()
                $(".addAll-plan-btn").on("click", function () {
                    $("#mainContainer").load("./assets/html/userPlanResult.html", function () {})
                })
            })
        }
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
        open: function (event, ui) {
            $(".ui-dialog-titlebar-close").hide();
            $(".ui-dialog :button").blur();
        },
        buttons: {
            "Edit": function () {
                $("#planContainer").dialog("destroy");
                $(this).empty().dialog("close");
                eval(todo);
            },
            "Close": function () {
                $("#planContainer").dialog("destroy");
                $(this).empty().dialog("close");
                eval(todo);
            }
        }
    });

    $("#planContainer").dialog("open").load("./assets/html/existingPlanDetails.html", function () {
        fetchFromDB(node)
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

function ucwords(str) {

    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
	});

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : fetchFromDBForEP
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 12, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : fetches db information for Existing Plan page
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function fetchFromDBForEP() {

    database.ref().once("value", function (snapshot) {
        $("#existingPlans").empty();
        snapshot.forEach(function (childsnapshot) {
            var button = $("<button>");
            button.attr("class", "existingPlanBtn");
            var s = childsnapshot.key
            button.attr("onclick", "showInformation('" + s + "')")
            button.html(`${childsnapshot.val().planName} <br><br> ${childsnapshot.val().cityName}, ${childsnapshot.val().state}`);
            $("#existingPlans").append(button);
        })
    });

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : populateBreweryPlan
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 12, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : February 15, 2019 PST
 #  REVISION #    : 2
 #  DESCRIPTION   : populate data for the selected plan
 #  PARAMETERS    : json data and flag number
 #
 #######################################################################
*/

function populateBreweryPlan(data) {

	var c1 = "brewery-data"
	var c2 = "brewery-text"
	var id = "brewery-selection"
	var key = "name"

	for (var k=0; k < data.length; k++) {
		var inp = $("<input>")
		inp.attr("type", "checkbox")
		var sp = $("<span>")
		sp.attr("class", c1)
		var a = $("<a>")
		a.attr("href",data[k]["website_url"])
		a.attr("target","_blank")
		var sp1 = $("<span>")
		sp1.attr("class",c2)
		sp1.text(data[k][key])
		sp1.attr("title",
			"<b>Brewery Type:</b> <i>"+ucwords(data[k]["brewery_type"])+"</i><br/>"+
			"<b>Address: </b><i>"+data[k]["street"]+", "+data[k]["city"]+", "+data[k]["state"]+"</i><br/><br/>"+
			"Click on the brewery name to see the website on a new page."
		)
		a.append(sp1)
		sp.append(inp)		
		sp.append(a)
		$("#"+id).append(sp)
	}

	$(".brewery-text").tooltip({
      content: function () {
          return $(this).prop('title');
      }
  	});

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : getEvents
 #  AUTHOR        : Janak Tripathee
 #  DATE          : February 16, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : get ticketmaster data in UserPlanResult page
 #  PARAMETERS    : none
 #
 #######################################################################
 */

function getEvents() {
    //    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=EXGXKSEnRzDBbVr3BJ2nvN2cpjnl8ZUO&city=" + selCity + "&stateCode=" + selState+"&startDateTime="+moment(selSD).format('YYYY-MM-DDTHH:mm:ssZ')+"&endDateTime="+ moment(selED).format('YYYY-MM-DDTHH:mm:ssZ'); 
    var queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=EXGXKSEnRzDBbVr3BJ2nvN2cpjnl8ZUO'
        //var theKey = "c837bf84d96c94c2390f43f5f1790825"; 
    $.ajax({
        url: queryURL
        , method: "GET"
    }).then(function (data) {
        var events = (data._embedded && data._embedded.events) || []
        for (var event of events) {
            $('.concert-data-cont').append('<span class="concert-data">' + '<span class="concert-text">' + event.name + '</span>' + '<input type="checkbox">' + '</span>')
        }
        console.log(data, "ticketmaster");
    })

}