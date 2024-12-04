
# openPOAMItems Function

> This function automates the movement of resolved "Open POA&M Items" to the "Closed POA&M Items" sheet when the "False Positive" column is updated to "Yes." It ensures better tracking and organization of resolved items.

## Key Steps
1. **Retrieve Required Sheets**:
   - Fetches the active spreadsheet and ensures the "Open POA&M Items" and "Closed POA&M Items" sheets exist.

2. **Monitor Edits**:
   - Listens for edits in the "Open POA&M Items" sheet using the event object.

3. **Identify the "False Positive" Column**:
   - Dynamically identifies the column index for "False Positive" using the header row.

4. **Move Row on Specific Condition**:
   - Checks if the edited cell is in the "False Positive" column and if the value is "Yes."
   - Moves the corresponding row to the "Closed POA&M Items" sheet.

5. **Delete the Row**:
   - Deletes the resolved row from the "Open POA&M Items" sheet.

## Workflow

1. A user updates the "False Positive" column in the "Open POA&M Items" sheet to "Yes."
2. The function verifies the edited column and value.
3. If the value is "Yes," it moves the row to the "Closed POA&M Items" sheet and deletes it from the "Open POA&M Items" sheet.

## Potential Enhancements
- **Audit Logging**:
  - Add an additional column in "Closed POA&M Items" to log the timestamp when the item was closed.
- **Notification**:
  - Notify relevant stakeholders (e.g., via email) when items are marked as resolved.
- **Validation**:
  - Ensure both sheets have the same structure to avoid errors during row movement.
