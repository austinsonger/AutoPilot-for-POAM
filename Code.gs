// Libraries
const BATCH_REQUEST_LIB = BatchRequest; // BatchRequest Library
const FILES_APP_LIB = FilesApp; // FilesApp Library
const GOOGLE_API_APP = GoogleApiApp; // GoogleApiApp Library
const MICROSOFT_DOCS_APP = MicrosoftDocsApp; // MicrosoftDocsApp Library
const RUN_ALL_LIB = RunAll; // RunAll Library
const RANGE_LIST_APP_LIB = RangeListApp; // RangeListApp Library
const DATE_FINDER_LIB = DateFinder; // DateFinder Library
const DOCS_SERVICE_APP_LIB = DocsServiceApp; // DocsServiceApp Library
const TRIGGER_APP_LIB = TriggerApp; // TriggerApp Library
const TEMPLATE_APP_LIB = TemplateApp; // TemplateApp Library
const MOVE_FOLDER_LIB = MoveFolder; // MoveFolder Library
const C_USEFUL = cUseful; // cUseful Library

// Constants
const SHARED_DRIVE_ID = '<YOUR_SHARED_DRIVE_ID>'; 
const POAM_FOLDER_NAME = '<FOLDER NAME>'; 
const POAM_FILE_NAME = '<FILE NAME>'; 

function fetchDataFromAPIs() {
  try {
    const awsData = fetchAWSInspectorData(); // Fetch vulnerabilities from AWS Inspector
    const tenableData = fetchTenableData(); // Fetch vulnerabilities from Tenable
    const combinedData = processVulnerabilityData(awsData, tenableData); // Combine and process data
    updateGoogleSheet(combinedData); // Store data temporarily in Google Sheets
    applyConditionalFormatting(); // Apply formatting to highlight critical vulnerabilities
    updatePOAMWorkbook(combinedData); // Update POAM Excel Workbook in Google Drive
    moveResolvedVulnerabilities(); // Check and move resolved vulnerabilities
    closingOpenPOAMItems();
    closingConfigurationFindings();
  } catch (error) {
    logError(error); // Log and notify about the error
  }
}

function fetchAWSInspectorData() { // AWS Fetch Function
  const requestOptions = {
    method: 'GET',
    headers: { Authorization: 'Bearer YOUR_AWS_API_KEY' },
  };
  const response = UrlFetchApp.fetch('https://<AWS INSPECTOR ENDPOINT URL>', requestOptions);
  const responseText = response.getContentText();
  if (C_USEFUL.isJson(responseText)) {
    return JSON.parse(responseText);
  } else {
    throw new Error('Invalid JSON from AWS Inspector API');
  }
}
function fetchTenableData() { // Tenable Fetch Function
  const requestOptions = {
    method: 'GET',
    headers: { Authorization: 'Bearer YOUR_TENABLE_API_KEY' },
  };
  const response = UrlFetchApp.fetch('https://<TENABLE ENDPOINT URL>', requestOptions);
  const responseText = response.getContentText();
  if (C_USEFUL.isJson(responseText)) {
    return JSON.parse(responseText);
  } else {
    throw new Error('Invalid JSON from Tenable API');
  }
}
function updateGoogleSheet(data) { // Enhance updateGoogleSheet Function to Normalize Data
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Temp Data');
  sheet.clear();
  data.forEach((row, index) => {
    const normalizedRow = C_USEFUL.normalizeObject(row, 'id', 'severity', 'description'); // Normalize columns
    sheet.getRange(index + 1, 1, 1, normalizedRow.length).setValues([normalizedRow]);
  });
}
function applyConditionalFormatting() { // Apply Conditional Formatting to Highlight Critical Vulnerabilities
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Temp Data');
  const range = sheet.getRange("B:B"); // Assuming severity is in column B
  const rule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Critical")
    .setBackground("#FF0000") // Red background for critical severity
    .setFontColor("#FFFFFF")
    .setRanges([range])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);
}
function updatePOAMWorkbook(data) { // Enhanced POAM Workbook Update with Headers
  ensureFolderAndFileExist(); // Ensure folder and file exist
  const folder = FILES_APP_LIB.searchFolderInSharedDrive(SHARED_DRIVE_ID, POAM_FOLDER_NAME);
  const poamFile = FILES_APP_LIB.searchFileInFolder(folder.getId(), POAM_FILE_NAME);
  const workbook = MICROSOFT_DOCS_APP.openExcel(poamFile);
  const sheetName = 'Vulnerabilities_' + new Date().toISOString().slice(0, 10);
  const sheet = workbook.addSheet(sheetName);
  const headers = [
    "POAM ID", "Controls", "Weakness Name", "Weakness Description", "Weakness Detector Source",
    "Weakness Source Identifier", "Asset Identifier", "Point of Contact", "Resources Required",
    "Overall Remediation Plan", "Original Detection Date", "Scheduled Completion Date",
    "Planned Milestones", "Milestone Changes", "Status Date", "Vendor Dependency",
    "Last Vendor Check-in Date", "Vendor Dependent Product Name", "Original Risk Rating",
    "Adjusted Risk Rating", "Risk Adjustment", "False Positive", "Operational Requirement",
    "Deviation Rationale", "Supporting Documents", "Comments", "Auto-Approve",
    "Binding Operational Directive 22-01 tracking", "Binding Operational Directive 22-01 Due Date",
    "CVE", "Service Name"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]); // Add headers to the first row
  const formattedData = data.map(item => C_USEFUL.flatten(item)); // Flatten nested objects
  sheet.getRange(2, 1, formattedData.length, formattedData[0].length).setValues(formattedData);
  workbook.save();
}
function ensureFolderAndFileExist() { // Folder and File Existence Check
  const folder = FILES_APP_LIB.searchFolderInSharedDrive(SHARED_DRIVE_ID, POAM_FOLDER_NAME);
  if (!folder) {
    Logger.log(`Creating folder "${POAM_FOLDER_NAME}" in shared drive.`);
    FILES_APP_LIB.createFolderInSharedDrive(SHARED_DRIVE_ID, POAM_FOLDER_NAME);
  }
  const poamFile = FILES_APP_LIB.searchFileInFolder(folder.getId(), POAM_FILE_NAME);
  if (!poamFile) {
    Logger.log(`Creating file "${POAM_FILE_NAME}" in folder "${POAM_FOLDER_NAME}".`);
    const fileContent = MICROSOFT_DOCS_APP.createEmptyExcel();
    FILES_APP_LIB.uploadFileToFolder(folder.getId(), POAM_FILE_NAME, fileContent);
  }
}
function logError(error) { // Log and Notify Errors
  const userEmail = Session.getActiveUser().getEmail();
  const subject = 'Automation Script Error Notification';
  const body = `An error occurred during the script: \n\n${error.message}\n\nStack Trace:\n${error.stack}`;
  GmailApp.sendEmail(userEmail, subject, body);
  Logger.log(body);
}
function createTrigger() { // Trigger Creation for Scheduled Automation
  TRIGGER_APP_LIB.createTimeDrivenTrigger('fetchDataFromAPIs')
    .timeBased()
    .everyDays(1)
    .create();
}
