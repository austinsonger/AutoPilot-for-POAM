function moveResolvedVulnerabilities() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const openSheet = ss.getSheetByName("Open POA&M Items");
    const closedSheet = ss.getSheetByName("Closed POA&M Items");
    if (!openSheet || !closedSheet) {
      throw new Error("Required sheets not found: 'Open POA&M Items' or 'Closed POA&M Items'.");
    }
  
    const awsData = fetchAWSInspectorData(); // Fetch AWS Inspector data
    const tenableData = fetchTenableData(); // Fetch Tenable data
    const currentVulnerabilities = new Set( // Combine and map vulnerabilities by Weakness Name and Asset Identifier
      [...awsData, ...tenableData].map(item => `${item['Weakness Name']}:${item['Asset Identifier']}`)
    );
  
    const lastRow = openSheet.getLastRow(); // Process "Open POA&M Items" to identify resolved vulnerabilities
    const dataRange = openSheet.getRange(5, 1, lastRow - 4, openSheet.getLastColumn()); // Assuming headers start in row 4
    const data = dataRange.getValues();
    const resolvedVulnerabilities = []; // Identify resolved vulnerabilities
    
    for (let i = 0; i < data.length; i++) {
      const weaknessName = data[i][2]; // Assuming Weakness Name is in column 3 (index 2)
      const assetIdentifier = data[i][6]; // Assuming Asset Identifier is in column 7 (index 6)
      if (!currentVulnerabilities.has(`${weaknessName}:${assetIdentifier}`)) { // Check if both Weakness Name and Asset Identifier are no longer in the scan results
        resolvedVulnerabilities.push(i + 5); // Store the row index for deletion
      }
    }
  
    for (let i = resolvedVulnerabilities.length - 1; i >= 0; i--) { // Move resolved vulnerabilities to "Closed POA&M Items"
      const rowIndex = resolvedVulnerabilities[i];
      const rowData = openSheet.getRange(rowIndex, 1, 1, openSheet.getLastColumn()).getValues()[0];
      closedSheet.appendRow(rowData); // Append the row to "Closed POA&M Items"
      openSheet.deleteRow(rowIndex); // Delete the row from "Open POA&M Items"
    }
  
    Logger.log(`Moved ${resolvedVulnerabilities.length} resolved vulnerabilities to 'Closed POA&M Items'.`);
  }
  
  
