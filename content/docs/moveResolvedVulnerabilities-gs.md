# moveResolvedVulnerabilities.gs


This script, written in JavaScript for Google Apps Script, automates the management of resolved vulnerabilities in a spreadsheet. It compares current vulnerabilities fetched from AWS Inspector and Tenable with the entries in the "Open POA&M Items" sheet. Resolved vulnerabilities are moved to the "Closed POA&M Items" sheet.

## Structure and Organization
- **Main Function**: `moveResolvedVulnerabilities`
    - Retrieves current vulnerabilities from AWS Inspector and Tenable data.
    - Identifies resolved vulnerabilities by comparing them with "Open POA&M Items".
    - Moves resolved vulnerabilities to the "Closed POA&M Items" sheet and deletes them from "Open POA&M Items".

## Key Components
1. **Spreadsheet Interaction**:
    - Accesses "Open POA&M Items" and "Closed POA&M Items" sheets in the active spreadsheet.
    - Retrieves data from specific ranges based on headers and row indices.

2. **Vulnerability Comparison**:
    - Fetches current vulnerabilities from AWS Inspector and Tenable APIs.
    - Combines and compares vulnerabilities using `Weakness Name` and `Asset Identifier`.

3. **Data Movement**:
    - Identifies resolved vulnerabilities and appends them to the "Closed POA&M Items" sheet.
    - Deletes resolved entries from the "Open POA&M Items" sheet.

## Logic and Workflow
1. **Data Retrieval**:
    - Fetches current vulnerabilities from `fetchAWSInspectorData` and `fetchTenableData`.
    - Combines results into a set for efficient comparison.

2. **Resolved Vulnerabilities Identification**:
    - Iterates over rows in the "Open POA&M Items" sheet.
    - Checks if vulnerabilities no longer exist in the current scan results.

3. **Data Movement**:
    - Appends resolved vulnerabilities to the "Closed POA&M Items" sheet.
    - Deletes resolved vulnerabilities from the "Open POA&M Items" sheet.

## Dependencies and Imports
- **Google Apps Script Services**:
    - `SpreadsheetApp`: For accessing and manipulating the spreadsheet.
    - `Logger`: For logging actions and results.
- **External Functions**:
    - `fetchAWSInspectorData`: Fetches vulnerability data from AWS Inspector.
    - `fetchTenableData`: Fetches vulnerability data from Tenable.

## Input/Output
- **Input**:
    - Vulnerability data from AWS Inspector and Tenable.
    - Data from the "Open POA&M Items" sheet.

- **Output**:
    - Resolved vulnerabilities moved to the "Closed POA&M Items" sheet.
    - Logs the number of resolved vulnerabilities.

## Error Handling
- Throws an error if the required sheets ("Open POA&M Items" or "Closed POA&M Items") are missing.
- Assumes data from external functions (`fetchAWSInspectorData` and `fetchTenableData`) is correctly formatted.

## Performance Considerations
- **Strengths**:
    - Efficiently identifies resolved vulnerabilities using a set for comparisons.
    - Handles data movement in bulk to minimize operations.
- **Weaknesses**:
    - Assumes the data in "Open POA&M Items" is consistently formatted.
    - Does not handle large datasets with pagination for API responses.

## Code Style and Readability
- Code is modular and follows a clear logical structure.
- Descriptive variable names improve readability.
- Additional comments explaining key operations would enhance maintainability.

## Potential Issues
1. **Hardcoded Column Indices**:
    - Assumes specific columns for `Weakness Name` and `Asset Identifier`, which may lead to issues if the sheet structure changes.
2. **Error Handling**:
    - Limited error handling for data inconsistencies or unexpected API responses.
3. **Deletion Order**:
    - Deletes rows in reverse order, which may cause issues if other processes are dependent on row indices.

## Security Considerations
- Relies on external functions (`fetchAWSInspectorData` and `fetchTenableData`) for data integrity.
- Assumes that API responses and spreadsheet data are free of malicious inputs.

## Extensibility and Reusability
- **Extensibility**:
    - Could be extended to handle additional data sources or new vulnerability attributes.
    - Parameterizing column indices would improve adaptability.
- **Reusability**:
    - Functions for data comparison and movement can be reused in other spreadsheet management tasks.

---

## TO-DO
1. Parameterize column indices to avoid hardcoding and improve adaptability to sheet structure changes.
2. Add detailed comments for key operations to improve code clarity.
3. Enhance error handling for API responses and data inconsistencies.
4. Implement pagination handling for large datasets fetched from APIs.
5. Use soft deletion (e.g., marking resolved items) instead of direct deletion for better traceability.




