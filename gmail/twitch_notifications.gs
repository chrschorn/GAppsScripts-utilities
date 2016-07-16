function deleteOldTwitchMails() {
  // Twitch stream notificaiton mails older than 1d will be moved to Trash
  var query = 'label:twitch subject:live is:unread older_than:1d';
  var twitchMails = GmailApp.search(query);
  
  for(var i in twitchMails) {
    twitchMails[i].moveToTrash();
  }
}

function archiveTwitchMailsIfNotLive() {
  var query = 'label:twitch subject:live';
  var twitchMails = GmailApp.search(query);
  
  for(var i in twitchMails) {
    channel = twitchMails[i].getFirstMessageSubject().split(' ')[0]
    if (!isChannelLive(channel)) {
      twitchMails[i].moveToArchive();
      twitchMails[i].markRead();
    }
  }
}

function isChannelLive(channel) {
  url = "https://api.twitch.tv/kraken/streams/" + channel;
  headers = {"Accept": "application/vnd.twitchtv.v3+json"};
  
  options = {"headers": headers};
  var response = UrlFetchApp.fetch(url, options);
  
  stream = JSON.parse(response.getContentText());
  return stream.stream != null;
}
