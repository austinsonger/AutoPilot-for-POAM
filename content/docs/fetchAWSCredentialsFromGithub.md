# fetchAWSCredentialsFromGithub

This script, written in JavaScript for Google Apps Script, integrates with AWS and GitHub to retrieve AWS credentials stored as GitHub Secrets. It uses these credentials to make authenticated requests to AWS services. The script ensures secure integration by leveraging a GitHub App with JWT authentication.

## Structure and Organization
- **Function**: `fetchAwsCredentialsFromGitHub`
    - Main function to retrieve AWS credentials (`Access Key`, `Secret Key`) from GitHub Secrets.
    - Sets the `AWS_REGION` explicitly to `us-east-1`.

- **Helper Functions**:
    1. **`fetchGitHubSecret`**:
        - Fetches specific secrets from a GitHub repository using a provided access token.
    2. **`generateGitHubJwt`**:
        - Generates a JWT for authenticating the GitHub App using RS256 signing.
    3. **`getInstallationAccessToken`**:
        - Retrieves an installation access token for the GitHub App.
    4. **`fetchAWSData`**:
        - Uses the retrieved AWS credentials to send an authenticated request to AWS.
    5. **`getCurrentDate`**:
        - Generates the current date in AWS-compatible format for signing requests.

## Key Components
1. **GitHub Secrets Retrieval**:
    - Connects to GitHub's REST API to fetch AWS credentials stored as repository secrets.

2. **JWT Authentication**:
    - Uses a private key to sign and generate a short-lived JWT for secure GitHub App authentication.

3. **AWS Integration**:
    - Constructs AWS-compatible signed headers and sends an authenticated request to AWS services.

## Logic and Workflow
1. Retrieves a private key from Google Apps Script Properties.
2. Generates a JWT using the private key and app ID.
3. Acquires an installation access token via GitHub's API.
4. Fetches AWS credentials (`Access Key`, `Secret Key`) stored as GitHub Secrets.
5. Uses the retrieved credentials to make a signed request to an AWS endpoint.

## Dependencies and Imports
- **Google Apps Script Services**:
    - `PropertiesService`: To store and retrieve sensitive keys (e.g., private key).
    - `UrlFetchApp`: For making HTTP requests to GitHub and AWS APIs.
    - `Logger`: To log actions and responses for debugging.
    - `Utilities`: To handle cryptographic and encoding utilities.

## Input/Output
- **Input**:
    - GitHub Secrets (`DEVOPS_DOOP_AUTOMATION_AWS_ACCESS_KEY_ID` and `DEVOPS_DOOP_AUTOMATION_AWS_SECRET_ACCESS_KEY`).
    - AWS Region: Hardcoded to `us-east-1`.

- **Output**:
    - Authenticated request sent to AWS.
    - Logs response data from AWS.

## Error Handling
- Throws errors if the private key is not found in Script Properties.
- Uses default values (`N/A`) if secrets are unavailable or improperly configured.
- Relies on GitHub and AWS API responses for error detection.

## Performance Considerations
- **Strengths**:
    - Short-lived JWTs improve security and reduce exposure risk.
    - Efficiently retrieves secrets and credentials in a streamlined process.
- **Weaknesses**:
    - Hardcoded region limits flexibility for multi-region setups.

## Code Style and Readability
- Code is modular, with functions clearly separated by responsibility.
- Descriptive variable names improve readability.
- Could benefit from additional comments explaining key steps.

## Potential Issues
1. Hardcoded AWS Region (`us-east-1`) limits adaptability for other regions.
2. Missing validation for GitHub Secrets content may cause runtime errors.
3. Relies on a specific structure for Script Properties and GitHub Secrets.

## Security Considerations
- **Strengths**:
    - Uses secure JWT-based authentication for GitHub.
    - AWS credentials are retrieved dynamically and not hardcoded.
- **Weaknesses**:
    - If the private key is compromised, the entire workflow could be at risk.
    - Secrets are assumed to be correctly configured in GitHub.

## Extensibility and Reusability
- **Extensibility**:
    - Could be extended to handle additional AWS operations by reusing the retrieved credentials.
    - Parameterizing the AWS region improves adaptability.
- **Reusability**:
    - Functions like `generateGitHubJwt` and `fetchGitHubSecret` can be reused for other GitHub App integrations.

---

## Suggestions for Improvement
1. Parameterize the AWS region to enhance flexibility for multi-region setups.
2. Add validation to ensure that fetched secrets are in the correct format.
3. Implement logging for potential GitHub and AWS API errors.
4. Securely store and handle sensitive data to prevent exposure risks.
