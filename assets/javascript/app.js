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
var selState = "" // selected state
var selCity = "" // selected city
var selSD = "" //selected start date
var selED = "" // selected end date
var cityID = "" // numerical city ID for Restraurant API requirements
var userSelections = {}; 
var ticketmasterSelections = []; 
var brewerySelections = []; 
var restaurantSelections = []; 
var weather = ""; 

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

    $("#loading-container").dialog({
        closeOnEscape: false,
        open: function(event, ui) {
             $(".ui-dialog-titlebar-close", ui.dialog).hide();
        },
        autoOpen: false,
        height: 160,
        width: 300,
        resizable: false,
        modal: true
    });

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
 #  MODIFIED BY   : K Daves
 #  REVISION DATE : February 18, 2019 PST
 #  REVISION #    : 4
 #  DESCRIPTION   : added API for restaurants
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
        case "3":
        	if (selSD != "" && selED != "") {
        		queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?city='+selCity+'&stateCode='+twoCodes[selState]+'&apikey=EXGXKSEnRzDBbVr3BJ2nvN2cpjnl8ZUO'+"&startDateTime="+moment(selSD).format('YYYY-MM-DDTHH:mm:ssZ')+"&endDateTime="+ moment(selED).format('YYYY-MM-DDTHH:mm:ssZ')+"&sort=date,asc";
        		//console.log(queryURL) 
    		} else {
    			queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?city='+selCity+'&stateCode='+twoCodes[selState]+'&apikey=EXGXKSEnRzDBbVr3BJ2nvN2cpjnl8ZUO'
    		  }
    	break;
        case "4":
            queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+selCity+",US&APPID=f61a88fc8b9c9ad98526c1f405a60125"
            //console.log(queryURL)
        break;
        case "5":
            queryURL = "https://developers.zomato.com/api/v2.1/locations?query="+selCity+"%2C%20"+selState
        break; 
    }

    $.ajax({
        url: queryURL,
        beforeSend: function(request){
            if(flag=="5"){
                request.setRequestHeader("user-key", "c837bf84d96c94c2390f43f5f1790825");
            }
        }, 
        method: "GET",
        //dataType: "jsonP",
        async: false
    }).then(function (data) {
        data = JSON.stringify(data)
        //console.log("DATA: "+data)
        switch (flag) {
	        case "0": func = "populateLocation(" + data + "," + flag + ");"; break;
	        case "1": func = "populateLocation(" + data + "," + flag + ");"; break;
	        case "2": func = "populateBreweryPlan(" + data + "," + flag + ");"; break;
	        case "3": func = "getEvents(" + data + "," + flag + ");"; break;
            case "4": func = "getEvents(" + data + "," + flag + ");"; break;
            case "5": func = "getCityID(" + data + ")"; break; 
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
	            height: "auto",
	            resizable: false,
	            modal: true,
	            closeOnEscape: false,
	            open: function (event, ui) {
	                $(".ui-dialog-titlebar-close").hide();
	                $(".ui-dialog :button").blur();
	            },
	            buttons: {
	                "Yes": function () {
                        $(this).dialog("close");
	                    $("#msg").dialog("destroy");
	                    eval(todo);
	                },
	                "No": function () {
                        $(this).dialog("close");
	                    $("#msg").dialog("destroy");	                    
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
 #  REVISION DATE : February 21, 2019 PST
 #  REVISION #    : 3
 #  DESCRIPTION   : fetches plan details from database
 #  PARAMETERS    : node or id
 #
 #######################################################################
*/

function fetchFromDB(node) {

    database.ref(node).once("value", function (ss) {
        //console.log(ss.val())
        $("#planName").text(ss.val().planName)
        $("#planDate").text(ss.val().startDate+" - "+ss.val().endDate)
        $("#planLocation").text(ss.val().cityName + ", " + ss.val().state)
        //EVENTS
        var div = $("<div>")
        div.attr("class", "infoClass")
        if (ss.val().ticketMaster != undefined || ss.val().ticketMaster != "") {
            for (var j = 0; j < ss.val().ticketMaster.length; j++) {
                div.append(" - " + ss.val().ticketMaster[j] + "<br>")
            }
        }
        $("#eventInfo").append(div)
        var div2 = $("<div>")
        div2.attr("class", "infoClass")
        if (ss.val().breweries != undefined || ss.val().breweries != "") {
            for (var j = 0; j < ss.val().breweries.length; j++) {
                div2.append(" - " + ss.val().breweries[j] + "<br>")
            }
        }
        $("#breweryInfo").append(div2)
        var div3 = $("<div>")
        div3.attr("class", "infoClass")
        if (ss.val().restaurants != undefined || ss.val().restaurants != "") {
            for (var j = 0; j < ss.val().restaurants.length; j++) {
                div3.append(" - " + ss.val().restaurants[j].restaurantName + " " + ss.val().restaurants[j].rating + " " + ss.val().restaurants[j].foodStyle + "<br>")
            }
        }
        $("#restaurantInfo").append(div3)
        var div4 = $("<div>")
        div4.attr("class", "infoClass")
        if (ss.val().weatherInfo != undefined || ss.val().weatherInfo != "") {
            div4.append(" - " + ss.val().weatherInfo + "<br>")
            $("#weatherInfo").append(div4)
        }
    })

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : initializeButtonsForNewPlan
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 10, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : February 22, 2019 PST
 #  REVISION #    : 5
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
            $("#loading-container").dialog("open")
            $("#mainContainer").load("./assets/html/userSelectPlan.html", function () {
                //auto-generate-plan-name
                var d = new Date()
                $("#plan-name").val(d.getMilliseconds()+"-"+selCity+"-"+twoCodes[selState])
                $(".city-state").text(selCity + ", " + selState)
                if (selSD != "" && selED != "") 
                	$(".cs-date").text(selSD + " - " + selED)
                getInfoFromAPI("2")
                getInfoFromAPI("3")
                getInfoFromAPI("4")
                getInfoFromAPI("5")
                $("#loading-container").dialog("close")
                $(".addAll-plan-btn").on("click", function () {
                    showPlanPreview()
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
                $(this).empty().dialog("close");
                $("#planContainer").dialog("destroy");
                //eval(todo);
            },
            "Close": function () {
                $(this).empty().dialog("close");
                $("#planContainer").dialog("destroy");
                //eval(todo);
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
 #  AUTHOR        : Kristen Daves
 #  DATE          : 
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : February 22, 2019 PST
 #  REVISION #    : 2
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
            var b2 = $("<button>");
            b2.text("Remove")
            b2.attr("onclick","event.stopPropagation();deleteEvent('" + s + "')")
            b2.attr("class","delete-event-button")
            button.append("<br/><br/>")
            button.append(b2)
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
 #  REVISION DATE : February 19, 2019 PST
 #  REVISION #    : 5
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

	if (data.length == 0) {

		$("#"+id).append("<br><br><br><br>No available brewery for the selected location.")

	} else {

		for (var k=0; k < data.length; k++) {
			var inp = $("<input>")
			inp.attr({"type": "checkbox", "class": "breweryCheck"})
			var sp = $("<span>")
			sp.attr("class", c1)
			var a = $("<a>")
            var toClick = "No website available for this brewery"
            if (data[k]["website_url"] != "") {
    			a.attr("href",data[k]["website_url"])
    			a.attr("target","_blank")
                toClick = "Click on the brewery name to see the website on a new page."
            }
			var sp1 = $("<span>")
			sp1.attr("class",c2)
			sp1.text(data[k][key])
			var add = ""
			if (data[k]["street"] != "")
				add += data[k]["street"]+", "
			add += data[k]["city"]+", "+data[k]["state"]
			sp1.attr("title",
				"<b>Brewery Type:</b> <i>"+ucwords(data[k]["brewery_type"])+"</i><br/>"+
				"<b>Address: </b><i>"+add+"</i><br/><br/>"+toClick		
			)
			a.append(sp1)
			sp.append(inp)
			sp.append("&nbsp;")	
			sp.append("&nbsp;")	
			sp.append("&nbsp;")		
			sp.append(a)
			$("#"+id).append(sp)
		}

		$(".brewery-text").tooltip({
	      content: function () {
	          return $(this).prop('title');
	      }
	  	});

	  }

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : getEvents
 #  AUTHOR        : Janak Tripathee
 #  DATE          : February 16, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : February 19, 2019 PST
 #  REVISION #    : 3
 #  DESCRIPTION   : get ticketmaster data in UserPlanResult page
 #  PARAMETERS    : data, flag
 #
 #######################################################################
*/

function getEvents(data, flag) {
    
    switch (flag) {
        case 3: case "3":
            var events = (data._embedded && data._embedded.events) || []
            if (events.length == 0) {
                $('.concert-data-cont').append("<br><br><br><br>No available events for the selected location.")
            } else { 
                for (var event of events) {
                	//console.log(event.name)
                	//console.log(event.id)
                	var ti = "\
                		"+getDate(event.dates.start.localDate)+" &bull; "+getTime(event.dates.start.localTime)+"\
                		<br>"+event._embedded.venues[0]["name"]+", "+event._embedded.venues[0]["city"]["name"]+", "+twoCodes[selState]+"<br>\
                		<br><br>Click on the event name for more details\
                	"
                    $('.concert-data-cont').append('<span class="concert-data"><a href="'+event.url+'" target="_blank"><input type="checkbox" class="ticketmasterCheck">                  <span class="concert-text" title="'+ti+'" >' + event.name + '</span></a>' +  '</span>')
                    //console.log(event.id)
                }

                $(".concert-text").tooltip({
                  content: function () {
                      return $(this).prop('title');
                  }
              	});
              }
        break;
        case 4: case "4":
            $(".temperature").text(data.main.temp);
            $(".humidity").text(data.main.humidity);
            $(".min-temp").text(data.main.temp_min);
            $(".max-temp").text(data.main.temp_max);
        break;
    }

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : getDate
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 17, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : transform date data into human readable form
 #  PARAMETERS    : date info
 #
 #######################################################################
*/

function getDate(date) {

	var month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Nov","Dec"]
	var dArr = date.split("-")
	var dStr = month[parseInt(dArr[1])-1]+" "+dArr[2]+", "+dArr[0]

	return dStr

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : getTime
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 17, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : transform date data into human readable form
 #  PARAMETERS    : time info
 #
 #######################################################################
*/

function getTime(time) {

	if (time == undefined)
		return "TBA"

	var tArr = time.split(":")
	var n
	var tStr = ""

	if (parseInt(tArr[0]) > 12) {
		n = parseInt(tArr[0]) - 12
		tStr = n+":"+tArr[1]+ "PM"
	} else if (parseInt(tArr[0]) < 12) {
		tStr = tArr[0]+":"+tArr[1]+ "AM"
	  } else {
	  		tStr = "12:00 NN"
	    }

	return tStr

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : getRestaurants
 #  AUTHOR        : Kristen Daves
 #  DATE          : February 18, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : Gets Zomato API information and publishes to UserPlanResults page
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function getRestaurants(){
    var queryURL = "https://developers.zomato.com/api/v2.1/location_details?entity_id="+cityID+"&entity_type=city"; 
    var theKey = "c837bf84d96c94c2390f43f5f1790825"; 
    $.ajax({
        url: queryURL,
        beforeSend: function(request){
            request.setRequestHeader("user-key", theKey);
        }, 
        method: "GET"
    }).then(function(data){
        if(data.best_rated_restaurant.length == 0){
            $(".pop-name-container").html("No restaurant recommendations available for the selected city.");
        } else{
            for(var i=0; i<data.best_rated_restaurant.length; i++){
                var newRestaurant = $("<div class='restaurantItem'>"); 
                newRestaurant.html(
                    `<div>`+
                    `<div>`+
                        `<input type="checkbox" class="restaurantCheck">`+
                        `<span class="restaurantDetails"`+
                            `title="<b>Address: </b><i>${data.best_rated_restaurant[i].restaurant.location.address}</i>`+
                            `<br><br>Click restaurant name to see their website on a new page.">` +
                            `<a href="${data.best_rated_restaurant[i].restaurant.url}" target="_blank">${data.best_rated_restaurant[i].restaurant.name}</a>`+
                        `</span`+ 
                     `</div>`+
                     `<div>${data.best_rated_restaurant[i].restaurant.user_rating.aggregate_rating} </div>`+
                     `<div>${data.best_rated_restaurant[i].restaurant.cuisines}</div>` +
                     `</div>`
                    ); 
                $(".pop-name-container").append(newRestaurant); 
            }

            $(".restaurantDetails").tooltip({
                content: function(){
                    return $(this).prop("title"); 
                }
            })
            } 
        })
}

/*
 #######################################################################
 #
 #  FUNCTION NAME : getCityID
 #  AUTHOR        : K Daves
 #  DATE          : February 18, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : sets cityID var to Zomato API's numerical value for selected city/state pair. 
 #  PARAMETERS    : data (API JSON output)
 #
 #######################################################################
*/

function getCityID(data){
    cityID = data.location_suggestions[0].city_id;
    getRestaurants();
}


/*
 #######################################################################
 #
 #  FUNCTION NAME : saveUserSelections
 #  AUTHOR        : K Daves
 #  DATE          : February 19, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : February 19, 2019 PST
 #  REVISION #    : 1
 #  DESCRIPTION   : save user selection on the global variables
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function saveUserSelections(){

    var selections = []; 
    var foodChoices = {}; 
    var name = ""; 
    var style = ""; 
    var rating = "";
    //debugger;
    if($(".ticketmasterCheck:checkbox:checked").length >0){
        for(var i=0; i<$(".ticketmasterCheck:checkbox:checked").length; i++){
            //debugger;
            selections.push($(".ticketmasterCheck:checkbox:checked")[i].parentElement.children[1].firstChild.data); 
            //debugger;   
        }
        //localStorage.setItem("tempTM",JSON.stringify(selections)) ; 
        ticketmasterSelections = selections;
        selections = []; 
    } 

    if($(".restaurantCheck:checkbox:checked").length >0){
        for(var i=0; i<$(".restaurantCheck:checkbox:checked").length; i++){
            var name = $(".restaurantCheck:checkbox:checked")[i].parentElement.children[1].firstChild.text;
            var rating = $(".restaurantCheck:checkbox:checked")[i].parentElement.children[1].children[1].textContent; 
            var style = $(".restaurantCheck:checkbox:checked")[i].parentElement.children[1].children[2].textContent
            foodChoices.restaurantName = name; 
            foodChoices.rating = rating; 
            foodChoices.foodStyle = style; 
            selections.push(foodChoices); 
            foodChoices = {}; 
        }
        //localStorage.setItem("tempFood", JSON.stringify(selections));
        restaurantSelections = selections;
        selections = []; 
    }

    if($(".breweryCheck:checkbox:checked").length >0){
        for(var i=0; i<$(".breweryCheck:checkbox:checked").length; i++){
            selections.push($(".breweryCheck:checkbox:checked")[i].parentElement.children[1].text); 
        }
        //localStorage.setItem("tempBrew", JSON.stringify(selections));
        brewerySelections = selections;
        selections = [];
    }
    if($(".weatherCheck:checkbox:checked")){
        
    }
}
    
/*
 #######################################################################
 #
 #  FUNCTION NAME : populateUserSelections
 #  AUTHOR        : K Daves
 #  DATE          : February 19, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : February 22, 2019 PST
 #  REVISION #    : 2
 #  DESCRIPTION   : populates the user selection in the result page
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function populateUserSelections() {

    if (ticketmasterSelections.length != 0) {
        for(var i=0; i<ticketmasterSelections.length; i++){
            $(".result-ticket-data-cont").append(ticketmasterSelections[i] + '<br><br>');
        }
    }

    if (brewerySelections.length != 0) {
        for(var i=0; i<brewerySelections.length; i++){
            $(".result-brewery-data-cont").append(brewerySelections[i] + '<br><br>');
        }
    }

    if (restaurantSelections.length != 0) {
        for(var i=0; i<restaurantSelections.length; i++){
            $(".result-restaurant-data-cont").append(`<div><div> ${restaurantSelections[i].restaurantName} </div><div> ${restaurantSelections[i].rating}</div><div>${restaurantSelections[i].foodStyle}</div></div>`);
        }
    }

    $(".plan-name-header").append($("#plan-name").val())
    $(".city-name-header").html(selCity +", "+ selState); 
    $(".city-dates").html(selSD + " - " + selED); 

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : showPlanPreview
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 22, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : shows a preview of users selected plan
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function showPlanPreview() {

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
            "Confirm": function () {
                database.ref().push({
                    cityName: selCity, 
                    state: selState, 
                    startDate: selSD,
                    endDate: selED, 
                    ticketMaster: ticketmasterSelections, 
                    breweries: brewerySelections, 
                    restaurants: restaurantSelections, 
                    weatherInfo: weather,
                    planName: pn
                }); 
                $(this).empty().dialog("close");
                $("#planContainer").dialog("destroy");
                //eval(todo);
                $("body").empty().load("index.html", function () {
                    alertMsg("prompt","Your plan has been added successfully!")
                })
            },
            "Cancel": function () {
                ticketmasterSelections = []
                brewerySelections = []
                restaurantSelections = []
                $(this).empty().dialog("close");
                $("#planContainer").dialog("destroy");
                //eval(todo);
            }
        }
    });

    saveUserSelections(); 
    var pn = $("#plan-name").val();

    $("#planContainer").dialog("open").load("./assets/html/userPlanResult.html", function () {
        $(".result-ticket-data-cont").empty(); 
        $(".result-brewery-data-cont").empty(); 
        $(".result-restaurant-data-cont").empty(); 
        $(".city-name-header").empty(); 
        $(".city-dates").empty();  
        $(".plan-name-header").empty();
        populateUserSelections(); 
  
    })

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : deleteEvent
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 22, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : deletes events from firebase
 #  PARAMETERS    : node
 #
 #######################################################################
*/

function deleteEvent(node) {

    alertMsg("confirm","Are you sure you want to delete this event?","database.ref('"+node+"').remove();fetchFromDBForEP();")

}
