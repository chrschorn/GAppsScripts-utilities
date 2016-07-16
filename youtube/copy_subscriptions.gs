// this function copies subscriptions from a given account to the one executing this
function subscriptionCopy(otherChannelId) {  
  // build list of channels already subbed to
  mySubs = [];
  var results = YouTube.Subscriptions.list("snippet", {mine: true});
  var items = results.items;
  
  while (true) {
    for (var i in items) {
      var id = items[i].snippet.resourceId.channelId;
      mySubs.push(id);
    }
    
    if (!results.nextPageToken) {
      break;
    }
    
    results = YouTube.Subscriptions.list("snippet", {mine: true, pageToken: results.nextPageToken});
    items = results.items;
  }
    
  // add channels not subbed to
  var results = YouTube.Subscriptions.list("snippet", {channelId: otherChannelId});
  items = results.items;
  
  while (true) {
    for (var i in items) {
      var id = items[i].snippet.resourceId.channelId;
      
      if (mySubs.indexOf(id) == -1) {
        subscribe_to_channel(id);
      }
    }
    
    if (!results.nextPageToken) {
      break;
    }
    
    results = YouTube.Subscriptions.list("snippet", {channelId: otherChannelId, pageToken: results.nextPageToken});
    items = results.items;
  }
}

function subscribe_to_channel(channelId) {
  var resource = {
    snippet: {
      resourceId: {
        kind: 'youtube#channel',
        channelId: channelId
      }
    }
  };

  try {
    var response = YouTube.Subscriptions.insert(resource, 'snippet');
    // Logger.log(response);
  } catch (e) {
    if (e.message.match('subscriptionDuplicate')) {
      Logger.log('Cannot subscribe; already subscribed to channel: ' +
          channelId);
    } else {
      Logger.log('Error adding subscription: ' + e.message);
    }
  }
}
