# AutoPilot POAM

## POAM Automation Proof-of-Concept with Google App Script

This project automates the management of Plan of Action and Milestones (POA&M) for FedRAMP and StateRAMP compliance. It streamlines the identification, tracking, and resolution of vulnerabilities and configuration findings using Google Apps Script. The automation ensures compliance processes are efficient, transparent, and easy to maintain.

## Key Features:

### Secure Credential Management:
- Integrates with GitHub to securely fetch AWS credentials and Tenable API keys using JWT authentication
- Ensures sensitive information is securely stored and accessed.

### Data Aggregation:
- Retrieves vulnerability data from AWS Inspector and Tenable APIs, consolidating findings for efficient tracking and resolution

### POA&M Updates:
- Automatically updates POA&M records by processing vulnerabilities and configuration findings.
- Moves resolved vulnerabilities from "Open POA&M Items" to "Closed POA&M Items" based on dynamic scans and inputs

### Google Workspace Integration:
- Synchronizes data with Google Sheets to provide a clear, organized view of open and closed POA&M items.
- Adds conditional formatting for easy identification of critical vulnerabilities
- Ensures compatibility with shared drives for centralized document management.

### Enhanced Reporting:
- Consolidates vulnerability details into structured reports with dynamic headers and formatted data for compliance audits

### Trigger-Based Automation:
- Includes time-driven triggers to periodically fetch, process, and update data without manual intervention

### Error Handling:
- Logs errors and notifies stakeholders via email to ensure uninterrupted operations

