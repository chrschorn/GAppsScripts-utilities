var rwthCalID = "";

// delete all events between start/end date
function clearCalendarRange(calId, start, end) {
  var calendar = CalendarApp.getCalendarById(calId);
  
  if (calendar == null)
    throw "Calendar not found!";
  
  var events = calendar.getEvents(start, end);
  
  for (var i in events) {
    var event = events[i];
    Logger.log("Event: " + event.getTitle() + ", " + event.getStartTime() + "...");
    event.deleteEvent();
    Logger.log("Deleted.")
  }
  
  Logger.log("===== Finished! =====");
}

// determine start/end date for current semester
// useful for replacing calendar entries with changed semester calender
function clearCurrentSemester() {
  var now = new Date();
  
  // start dates of this year
  var ss_start = new Date(now.getFullYear(), 3, 1); // April 1
  var ws_start = new Date(now.getFullYear(), 9, 1); // Oct 1
  
  var start, end;
  
  // calculate the current semester start/end time 
  if (ss_start <= now && now < ws_start) {
    // SS of this year
    start = ss_start;
    end = new Date(ws_start - 1);
  } else if (now < ss_start) {
    // WS that started last year
    ws_start.setYear(now.getFullYear() - 1);
    start = ws_start;
    end = new Date(ss_start - 1);    
  } else if (ws_start <= now) {
    // WS that started this year
    start = ws_start;
    ss_start.setYear(now.getFullYear() + 1);
    end = new Date(ss_start-1);
  } else {
    throw "No valid date range found!";
  }
  
  clearCalendarRange(rwthCalID, start, end);
}
