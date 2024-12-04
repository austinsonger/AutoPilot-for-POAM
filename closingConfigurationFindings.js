function configurationFindings(e) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const configFindingsSheet = ss.getSheetByName("Configuration Findings");
    const closedSheet = ss.getSheetByName("Closed POA&M Items");
    const range = e.range; // Get event details
    const editedSheet = range.getSheet();
    const columnIndex = range.getColumn();
    const rowIndex = range.getRow();
  
    // Get the index of the "False Positive" column dynamically
    const headers = configFindingsSheet.getRange(1, 1, 1, configFindingsSheet.getLastColumn()).getValues()[0];
    const falsePositiveIndex = headers.indexOf("False Positive") + 1; // Adjust for 1-based index
  
    if (editedSheet.getName() === "Configuration Findings" && columnIndex === falsePositiveIndex) {
      const value = range.getValue();
  
      if (value === "Yes") {
        const rowData = editedSheet.getRange(rowIndex, 1, 1, editedSheet.getLastColumn()).getValues()[0]; // Get the entire row of the edited item
        closedSheet.appendRow(rowData); // Append the row to the "Closed POA&M Items" sheet
        configFindingsSheet.deleteRow(rowIndex); // Delete the row from the "Configuration Findings" sheet
        Logger.log(`Moved item from row ${rowIndex} in "Configuration Findings" to "Closed POA&M Items".`);
      }
    }
  }