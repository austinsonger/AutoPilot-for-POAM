function openPOAMItems(e) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const openSheet = ss.getSheetByName("Open POA&M Items");
    const closedSheet = ss.getSheetByName("Closed POA&M Items");
    const range = e.range;
    const editedSheet = range.getSheet();
    const columnIndex = range.getColumn();
    const rowIndex = range.getRow();
  
    // Get the index of the "False Positive" column dynamically
    const headers = openSheet.getRange(1, 1, 1, openSheet.getLastColumn()).getValues()[0];
    const falsePositiveIndex = headers.indexOf("False Positive") + 1; // Adjust for 1-based index
  
    if (editedSheet.getName() === "Open POA&M Items" && columnIndex === falsePositiveIndex) {
      const value = range.getValue();
      
      if (value === "Yes") {
        const rowData = editedSheet.getRange(rowIndex, 1, 1, editedSheet.getLastColumn()).getValues()[0]; // Get the entire row of the edited item
        closedSheet.appendRow(rowData); // Append the row to the "Closed POA&M Items" sheet
        openSheet.deleteRow(rowIndex); // Delete the row from the "Open POA&M Items" sheet
        Logger.log(`Moved item from row ${rowIndex} in "Open POA&M Items" to "Closed POA&M Items".`);
      }
    }
  }
