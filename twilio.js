 var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = spreadsheet.getSheets()[0];
 var senderRange = sheet.getRange("D1:H1"); 
  
  // The row and column here are relative to the range
  // getCell(1,1) in this code returns the cell at B2, B2
    var authId_cell = senderRange.getCell(1, 2);
    var authId = authId_cell.getValue();
  var passwd_cell = senderRange.getCell(1, 4);
  var passwd = passwd_cell.getValue();

function getCredentials() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheets()[0];
    var senderRange = sheet.getRange("D1:H1"); 
  
  // The row and column here are relative to the range
  // getCell(1,1) in this code returns the cell at B2, B2
    var authId_cell = senderRange.getCell(1, 2);
    var authId = authId_cell.getValue();
  var passwd_cell = senderRange.getCell(1, 4);
  var passwd = passwd_cell.getValue();
  Logger.log("AuthID: " +authId+" PASSWORD: "+passwd1);
  //return authId, passwd;
}

function sendSms(sender, to, body) {
  var messages_url = "https://api.twilio.com/2010-04-01/Accounts/"+authId+"/Messages.json";

  var payload = {
    "To": to,
    "Body" : body,
    "From" : sender
  };

  var options = {
    "method" : "post",
    "payload" : payload
  };

  options.headers = { 
    "Authorization" : "Basic " + Utilities.base64Encode(""+authId+":"+passwd+"")
  };

 var response =  UrlFetchApp.fetch(messages_url, options);
  return response.getContentText();
 
}


function checkSMSstatus(SID) {
  var messages_url = "https://api.twilio.com/2010-04-01/Accounts/"+authId+"/SMS/Messages/"+SID+".json";

  var options = {
    "method" : "get"
  };

  options.headers = { 
    "Authorization" : "Basic " + Utilities.base64Encode(""+authId+":"+passwd+"")
  };

 var response =  UrlFetchApp.fetch(messages_url, options);
  return response.getContentText();
 
}


function sendAll() {
  //var sheet = SpreadsheetApp.getActiveSheet();
  // The code below makes the 2nd sheet active in the active spreadsheet.
  //var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheets()[0];
    var senderRange = sheet.getRange("B1:B1");

  // The row and column here are relative to the range
  // getCell(1,1) in this code returns the cell at B2, B2
    var cellSender = senderRange.getCell(1, 1);
    var sender = cellSender.getValue();
  // SpreadsheetApp.setActiveSheet(sheet.getSheets()[0]);

  var startRow = 3; 
  var numRows = sheet.getLastRow() - 1; 
  var dataRange = sheet.getRange(startRow, 1, numRows, 5) 
  var data = dataRange.getValues();

  for (i in data) {
    var row = data[i];
    sheet.getRange(startRow + Number(i), 3).setValue("waiting...");
    sheet.getRange(startRow + Number(i), 4).setValue("waiting..");
    sheet.getRange(startRow + Number(i), 5).setValue("waiting..");
    try {
      response_data = sendSms(sender, row[0], row[1]);
      var parseIt = JSON.parse(response_data);
//      var smsStatus = JSON.parse(checkSMSstatus(parseIt.sid));
     //var status = smsStatus.status;
          var myStatus = parseIt.status;
      sheet.getRange(startRow + Number(i), 3).setValue(parseIt.status);
      sheet.getRange(startRow + Number(i), 4).setValue(parseIt.sid);
 //  sheet.getRange(startRow + Number(i), 5).setValue(status);
    } catch(err) {
      Logger.log(err);
     sheet.getRange(startRow + Number(i), 3).setValue(err);
    }

  }
}

function checkSMSstatusAll() {
 // var sheet = SpreadsheetApp.getActiveSheet();
   // var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

 // SpreadsheetApp.setActiveSheet(sheet.getSheets()[0]);
  var sheet = spreadsheet.getSheets()[0];
  var startRow = 3; 
  var numRows = sheet.getLastRow() - 1; 
  var dataRange = sheet.getRange(startRow, 1, numRows, 5) 
  var data = dataRange.getValues();
  Logger.log("Data var "+data);
        // Logger.log(data)
         for (i in data) {
           //var row = data[i];
       
           var SID =  sheet.getRange(startRow + Number(i), 4).getValue();
           Logger.log("SID is "+SID) 
           if ((SID == "waiting..") || (SID == "")) {
             continue;
           }
           var messages_url = "https://api.twilio.com/2010-04-01/Accounts/"+authId+"/SMS/Messages/"+SID+".json";
           var options = {
             "method" : "get"
           };
           
           options.headers = { 
             "Authorization" : "Basic " + Utilities.base64Encode(""+authId+":"+passwd+"")
           };
           
           try {
           
             //var response =  UrlFetchApp.fetch(messages_url, options);
             var response =  UrlFetchApp.fetch(messages_url, options);
             var smsStatus = JSON.parse(response);
             sheet.getRange(startRow + Number(i), 5).setValue(smsStatus.status);
           } catch(err) {
             Logger.log(err);
             sheet.getRange(startRow + Number(i), 5).setValue(err);
           }
           
         }
}
