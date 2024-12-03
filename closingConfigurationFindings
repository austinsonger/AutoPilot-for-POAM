function openPOAMItems (e) { // Define spreadsheet and sheet names
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const openSheet = ss.getSheetByName("Open POA&M Items");
  const closedSheet = ss.getSheetByName("Closed POA&M Items");
  const range = e.range; 
  const editedSheet = range.getSheet();
  const columnIndex = range.getColumn();
  const rowIndex = range.getRow();
  if (editedSheet.getName() === "Open POA&M Items" && columnIndex === 22) {  // Check if the edit is in the "Open POA&M Items" sheet and the "False Positive" column
    const value = range.getValue();
    
    if (value === "Yes") {
      const rowData = editedSheet.getRange(rowIndex, 1, 1, editedSheet.getLastColumn()).getValues()[0]; // Get the entire row of the edited item
      closedSheet.appendRow(rowData); // Append the row to the "Closed POA&M Items" sheet
      openSheet.deleteRow(rowIndex); // Delete the row from the "Open POA&M Items" sheet
      Logger.log(`Moved item from row ${rowIndex} in "Open POA&M Items" to "Closed POA&M Items".`);
    }
  }
}
