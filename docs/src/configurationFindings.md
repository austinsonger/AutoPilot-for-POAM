
# configurationFindings Function

> This function manages configuration findings in a Google Spreadsheet. When a row in the "Configuration Findings" sheet is marked as a "False Positive," the function moves that row to the "Closed POA&M Items" sheet and deletes it from the original sheet.

## Key Steps
1. **Retrieve Required Sheets**:
   - Fetches the active spreadsheet and ensures the "Configuration Findings" and "Closed POA&M Items" sheets exist.

2. **Monitor Edits**:
   - Responds to edits in the "Configuration Findings" sheet using the event object.

3. **Identify the "False Positive" Column**:
   - Dynamically identifies the column index for "False Positive" based on the header row.

4. **Move Row on Specific Condition**:
   - Checks if the edited cell is in the "False Positive" column and has a value of "Yes."
   - Moves the corresponding row to the "Closed POA&M Items" sheet.

5. **Delete the Row**:
   - Deletes the resolved row from the "Configuration Findings" sheet.

## Workflow

1. A user edits a row in the "Configuration Findings" sheet, marking it as a "False Positive."
2. The function checks if the edit is in the "False Positive" column and if the value is "Yes."
3. The row is moved to the "Closed POA&M Items" sheet and deleted from the "Configuration Findings" sheet.
4. A log entry confirms the operation.

## Potential Enhancements
- Add timestamps to rows moved to "Closed POA&M Items."
- Send email notifications for resolved items.
- Add error handling for mismatched sheet structures or missing data.
