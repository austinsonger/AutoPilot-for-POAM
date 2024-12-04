# fetchTenableApiKeyFromGitHub.gs


This script is written in JavaScript for Google Apps Script. It fetches the `TENABLE_API_KEY` secret from a GitHub repository by using a GitHub App's JWT authentication. The script retrieves and uses a private key stored in the Script Properties for generating the JWT and acquiring an installation access token.

## Structure and Organization
- **Main Function**: `fetchTenableApiKeyFromGitHub`
    - Responsible for orchestrating the process of fetching the `TENABLE_API_KEY` from a GitHub repository.
    - It uses helper functions to generate a JWT and fetch the installation access token before retrieving the secret.

- **Helper Function 1**: `generateGitHubJwt`
    - Generates a JWT for GitHub App authentication using the provided `appId` and `privateKey`.
    - Uses `RS256` algorithm for signing.

- **Helper Function 2**: `getInstallationAccessToken`
    - Exchanges the JWT for an installation access token using GitHub's REST API.

## Key Components
1. **Script Properties**:
    - Retrieves the private key from the Google Apps Script Properties (`GITHUB_APP_TENABLE`).
    - Ensures the private key exists before proceeding.

2. **JWT Creation**:
    - Includes `iat` (issued at) and `exp` (expiration) claims, ensuring the token is valid for 10 minutes.

3. **Access Token Retrieval**:
    - Makes a `POST` request to GitHub's `/access_tokens` endpoint to get the installation access token.

4. **Secret Retrieval**:
    - Uses a `GET` request to fetch the `TENABLE_API_KEY` from the repository’s secrets endpoint.

5. **Error Handling**:
    - Validates the presence of the private key, secret, and handles API response errors.

## Logic and Workflow
1. Fetches the private key from the Script Properties.
2. Generates a JWT using the private key and app ID.
3. Obtains an installation access token using the JWT and installation ID.
4. Fetches the `TENABLE_API_KEY` secret from the GitHub repository.
5. Validates the presence of the secret and logs success or error messages.

## Dependencies and Imports
- `PropertiesService`: To retrieve script properties (e.g., the private key).
- `UrlFetchApp`: For making HTTP requests to GitHub's API.
- `Utilities`: For cryptographic and encoding utilities (e.g., RSA-SHA256 signature, base64 encoding).

## Input/Output
- **Input**:
    - Private key: Retrieved from the script properties (`GITHUB_APP_TENABLE`).
    - GitHub API interaction details: App ID, installation ID, repository owner, and repository name.

- **Output**:
    - Returns the `TENABLE_API_KEY` if successfully fetched.
    - Logs success or error messages using `Logger`.

## Error Handling
- Validates the presence of the private key in script properties.
- Handles missing or improperly configured secrets by throwing specific errors.
- Catches and logs errors during API calls.

## Performance Considerations
- The use of JWTs with short expiration times (10 minutes) enhances security.
- Efficient use of HTTP requests to interact with GitHub API endpoints.

## Code Style and Readability
- Code is well-organized into distinct functions, improving readability and maintainability.
- Error messages are clear and provide actionable feedback.
- Could benefit from additional comments explaining specific logic.

## Potential Issues
- If the private key in `Script Properties` is misconfigured, the script will fail.
- API rate limits from GitHub might impact functionality if the script is invoked frequently.

## Security Considerations
- **Strengths**:
    - Uses short-lived JWTs for authentication.
    - Access token is scoped to a specific installation and repository.

- **Weaknesses**:
    - Private key handling relies on script properties, which must be securely configured.

## Extensibility and Reusability
- **Extensibility**:
    - Could be extended to fetch multiple secrets by parameterizing the secret name.

- **Reusability**:
    - Functions like `generateGitHubJwt` and `getInstallationAccessToken` can be reused in other scripts interacting with GitHub Apps.

---

## TO-DO
1. Add retry logic for handling transient API failures.
2. Include detailed comments for complex sections like JWT generation.
3. Use environment variables for better security practices if supported.