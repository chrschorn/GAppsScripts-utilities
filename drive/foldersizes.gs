// "main" function: find a folder by name and write a folder size breakdown into each subfolder
function analyzeFolderSize() {
  var name = "scripts";
  
  var fileText = "";
  var folders = DriveApp.getFoldersByName(name);
  
  while(folders.hasNext()) {
    var folder = folders.next();
    fileText = log("### " + folder + " ###", fileText);
    var size = getFolderSizeBreakdown(folder);
    fileText = logFolderSize(folder, size, fileText);
    writeResult(folder, fileText);
  }
}
  
function sizeBreakDownById(baseFolderId) {
  var baseFolder = DriveApp.getFolderById(baseFolderId);
  
  log("### " + baseFolder + " ###");
  var size = getFolderSizeBreakdown(baseFolder);
  logFolderSize(baseFolder, size);
  writeResult(baseFolder);
}

// returns size of given folder, logs all folders below
function getFolderSizeBreakdown(folderArg) {
  var sum = 0;

  var folders = folderArg.getFolders();
  while(folders.hasNext()) {
    var folder = folders.next();
    var size = calcFolderSize(folder);
    sum += size;
    logFolderSize(folder, size);
  }
 
  return Math.round(sum*100)/100;
}

function log(string, logStr) {
  logStr += string + "\n";
  Logger.log(string);
  return logStr
}

function logFolderSize(folder, size, logStr) {
  return log("Size of folder '" + folder.getName() + "': " + size + "MB", logStr);
}

// in MB
function calcFolderSize(folder) {
  var sum = 0;
  var stack = new Array();
  stack.push(folder);
  
  while(stack.length != 0) {
    var currentFolder = stack.pop();
    
    var folders = currentFolder.getFolders();
    while (folders.hasNext()) {
      stack.push(folders.next());
    }
    
    var files = currentFolder.getFiles();
    while(files.hasNext()) {
      var file = files.next();
      sum += file.getSize();
    }
  }
  
  sum = sum/1000000;
  return Math.round(sum*100)/100;
}

// create a document in the folder and write 
function writeResult(folder, fileText) {
  var d = new Date();
  log(d.toString());
  
  var folderGiven = !(typeof folder === 'undefined');
  var doc;
  if (!folderGiven)
    doc = DocumentApp.create("Size Breakdown");
  else
    doc = DocumentApp.create("tmp_doc_script");
  
  var body = doc.getBody();
  body.appendParagraph(fileText);
  doc.saveAndClose();

  if (folderGiven) {
    var id = doc.getId();
    log(id);
    var file = DriveApp.getFileById(id);
    log(file.getId());
    file.makeCopy("Size Breakdown", folder)
    file.setTrashed(true);
  }
}
