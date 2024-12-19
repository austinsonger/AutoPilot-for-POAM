function fetchTenableApiKeyFromGitHub() {
    const APP_ID = '<PLACEHOLDER>';
    const INSTALLATION_ID = '<PLACEHOLDER>';

    // Retrieve the private key from script properties
    const PRIVATE_KEY = PropertiesService.getScriptProperties().getProperty('GITHUB_APP_TENABLE');
    if (!PRIVATE_KEY) {
        throw new Error('Private key not found in Script Properties. Ensure it is set correctly as GITHUB_APP_TENABLE.');
    }

    const REPO_OWNER = 'CirrusMD';
    const REPO_NAME = 'AutoPilot';

    // Step 1: Generate JWT
    const jwt = generateGitHubJwt(APP_ID, PRIVATE_KEY);

    // Step 2: Get installation access token
    const accessToken = getInstallationAccessToken(jwt, INSTALLATION_ID);

    // Step 3: Fetch the secret
    const secretsUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/secrets/TENABLE_API_KEY`;
    const options = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json'
        }
    };

    try {
        const response = UrlFetchApp.fetch(secretsUrl, options);
        const secretData = JSON.parse(response.getContentText());

        if (!secretData.secret_value) {
            throw new Error('Failed to retrieve TENABLE_API_KEY. Secret may be missing or improperly configured.');
        }

        Logger.log(`Tenable API Key successfully retrieved.`);
        return secretData.secret_value;
    } catch (error) {
        Logger.log(`Error fetching Tenable API Key: ${error.message}`);
        throw new Error('Unable to fetch TENABLE_API_KEY. Check GitHub credentials and secret configuration.');
    }
}

// Helper: Generate JWT for GitHub App
function generateGitHubJwt(appId, privateKey) {
    const header = {
        alg: "RS256",
        typ: "JWT"
    };

    const payload = {
        iat: Math.floor(Date.now() / 1000), // Current time
        exp: Math.floor(Date.now() / 1000) + (10 * 60), // 10 minutes later
        iss: appId
    };

    const encodedHeader = Utilities.base64EncodeWebSafe(JSON.stringify(header));
    const encodedPayload = Utilities.base64EncodeWebSafe(JSON.stringify(payload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const signature = Utilities.computeRsaSha256Signature(unsignedToken, privateKey);
    const encodedSignature = Utilities.base64EncodeWebSafe(signature);
    return `${unsignedToken}.${encodedSignature}`;
}

// Helper: Get Installation Access Token
function getInstallationAccessToken(jwt, installationId) {
    const url = `https://api.github.com/app/installations/${installationId}/access_tokens`;
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: 'application/vnd.github.v3+json'
        }
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());

    return responseData.token;
}
