function markOldMailsAsRead() {
  var query = 'older_than:30d -is:inbox is:unread';
  var mails = GmailApp.search(query);
  
  for (var i in mails) {
    mails[i].markRead();
  }
}
