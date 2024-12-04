let AWS_ACCESS_KEY = '';
let AWS_SECRET_KEY = '';
let AWS_REGION = '';

function fetchAwsCredentialsFromGitHub() {
  // AWS GitHub Integration
  const APP_ID = '1076988';
  const INSTALLATION_ID = '57936909';

  // Retrieve private key from Script Properties
  const PRIVATE_KEY = PropertiesService.getScriptProperties().getProperty('GITHUB_APP_AWS_SECRETS');
  if (!PRIVATE_KEY) {
    throw new Error('Private key not found in Script Properties. Ensure it is set correctly as GITHUB_APP_AWS_SECRETS.');
  }

  const REPO_OWNER = 'CirrusMD';
  const REPO_NAME = 'AutoPilot';

  const jwt = generateGitHubJwt(APP_ID, PRIVATE_KEY);
  const accessToken = getInstallationAccessToken(jwt, INSTALLATION_ID);

  AWS_ACCESS_KEY = fetchGitHubSecret(accessToken, REPO_OWNER, REPO_NAME, 'DEVOPS_DOOP_AUTOMATION_AWS_ACCESS_KEY_ID');
  AWS_SECRET_KEY = fetchGitHubSecret(accessToken, REPO_OWNER, REPO_NAME, 'DEVOPS_DOOP_AUTOMATION_AWS_SECRET_ACCESS_KEY');
  AWS_REGION = 'us-east-1'; // Set the region explicitly
}

function fetchGitHubSecret(accessToken, repoOwner, repoName, secretName) { // Helper: Fetch a GitHub Secret
  const secretsUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/actions/secrets/${secretName}`;
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json'
    }
  };
  const response = UrlFetchApp.fetch(secretsUrl, options);
  const secretData = JSON.parse(response.getContentText());
  return secretData.secret_value || 'N/A';
}

function generateGitHubJwt(appId, privateKey) { // Helper: Generate JWT for GitHub App
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

function getInstallationAccessToken(jwt, installationId) { // Helper: Get Installation Access Token
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

function fetchAWSData() { // Use AWS Credentials
  fetchAwsCredentialsFromGitHub();
  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': `AWS4-HMAC-SHA256 Credential=${AWS_ACCESS_KEY}/${getCurrentDate()}/${AWS_REGION}/execute-api/aws4_request, SignedHeaders=host;x-amz-date, Signature=${generateAwsSignature()}`,
      'x-amz-date': new Date().toISOString(),
      'Content-Type': 'application/json'
    }
  };
  const url = `https://sts.${AWS_REGION}.amazonaws.com`;
  const response = UrlFetchApp.fetch(url, requestOptions);
  Logger.log(response.getContentText());
}

function getCurrentDate() { // Helper: Get Current Date for AWS Signing
  const now = new Date();
  return `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCDate()).padStart(2, '0')}`;
}