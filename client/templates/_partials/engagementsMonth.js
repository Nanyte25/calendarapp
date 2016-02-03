Template.engagementsMonth.helpers({
	getDayTemplate : function () {
		if ( Router.current().route.getName() == "engagementsCreate") { return "engagementsCreateDay"; }
		if ( Router.current().route.getName() == "engagementsDash") { return "engagementsDashDay"; }
	},
	getDays : function () {
		var eventsRequired = Router.current().route.getName() == "engagementsDash"; 
		if (eventsRequired) {
			var now =  getTodayDate();
			var queryStartDate = now.unix();
			var queryEndDate = now.add(3, "month").unix()
			var eventsPerDay = {};
			Engagements.find(betweenTwoDatesEventsQuery(queryStartDate,queryEndDate))        
			.forEach(function (e) {		        // TODO move this to the mongo query! 
		        // TODO add unit test of this mostruosity
		        var startLoop = moment.max(moment.unix(e.startDate), moment.unix(queryStartDate));
		        var endLoop = moment.min(moment.unix(e.endDate), moment.unix(queryEndDate));
		        var type = e.type;			
		        for(var m = startLoop; !m.isAfter(endLoop);  m.add('days',1)) {
		          var unixDay = m.unix();
		          // initailize objects if not present
		          if (! (unixDay in eventsPerDay)) { eventsPerDay[unixDay] = {}; } 
		          if (! (type in eventsPerDay[unixDay])) { eventsPerDay[unixDay][type] = 0 }
		          eventsPerDay[unixDay][type] ++;
		        }
		    });
		} 
		return getDaysInMonth(this.date, eventsPerDay);
	},
	getMonth : function (unixTime) {
  		return moment.unix(unixTime).format('MMMM');
	},
	getYear : function (unixTime) {
 		return moment.unix(unixTime).year();
	}
});

// TODO CR this needs a unit test as well.
// TODO CR use iteration on day with moment rather than on day number 
function getDaysInMonth(unixTime, eventsPerDay) {
    var result = [];
    var startDay;
    var totalDays = moment.unix(unixTime).daysInMonth();
    var lastDayOfMonth = moment([moment.unix(unixTime).year(), moment.unix(unixTime).month(), totalDays]);
    if(moment().isBefore(lastDayOfMonth) && moment().month() == lastDayOfMonth.month()) {
      startDay = moment().date();
      for (var j = 0; j< moment().day(); j ++) {
        result.push({}) 
      }
    } else {
      startDay = 1;
      var firstDayOfMonth = moment([moment.unix(unixTime).year(), moment.unix(unixTime).month(), 1])
      for (var j = 0; j< firstDayOfMonth.day(); j ++) {
        result.push({}) 
      }
    } 

    var firstDayOfMonth = moment([moment.unix(unixTime).year(), moment.unix(unixTime).month(), startDay])


    // this methid is here in order to add to this the events per day to the day object 
	for (var i = startDay; i <= totalDays; i++) {
		var fullUnixDate = moment([moment.unix(unixTime).year(), moment.unix(unixTime).month(), i]).unix();
		var dayEntry = { dayNumber : i, fullDate : fullUnixDate};
		if (eventsPerDay) {
			// need to convert the hash to an array for Blaze to be able to render it
			
			dayEntry.dayEvents = [];
			for (var k in eventsPerDay[fullUnixDate]) {
				var v = eventsPerDay[fullUnixDate][k];
				dayEntry.dayEvents.push({type : k, count: v}); 
			}     
		}
	    result.push(dayEntry);
	 }
    return result;
}