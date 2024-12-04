
# moveResolvedVulnerabilities Function

> This function automates the process of identifying and moving resolved vulnerabilities from the "Open POA&M Items" sheet to the "Closed POA&M Items" sheet in a Google Spreadsheet. It compares the current scan results from AWS Inspector and Tenable with entries in the open sheet.

## Key Steps
1. **Retrieve Required Sheets**:
   - Fetches the active spreadsheet and ensures the "Open POA&M Items" and "Closed POA&M Items" sheets exist.

2. **Fetch Current Vulnerabilities**:
   - Combines the latest scan data from AWS Inspector and Tenable.
   - Uses a `Set` to efficiently track unique vulnerabilities by combining "Weakness Name" and "Asset Identifier".

3. **Identify Resolved Vulnerabilities**:
   - Compares rows in the "Open POA&M Items" sheet with the current vulnerabilities.
   - Marks rows that are no longer found in the latest scan results as resolved.

4. **Move Resolved Rows**:
   - Appends resolved rows to the "Closed POA&M Items" sheet.
   - Deletes the corresponding rows from the "Open POA&M Items" sheet.

5. **Log Results**:
   - Logs the number of rows moved for tracking and debugging purposes.

## Example Workflow

1. A user or script fetches the latest scan results from AWS Inspector and Tenable.
2. Rows in the "Open POA&M Items" sheet are compared to these results.
3. Resolved vulnerabilities are moved to the "Closed POA&M Items" sheet.
4. The script logs the number of rows moved.

## Potential Enhancements
- Add timestamps to rows moved to "Closed POA&M Items" for tracking.
- Notify stakeholders via email about resolved vulnerabilities.
- Add validation to ensure data consistency between sheets.
