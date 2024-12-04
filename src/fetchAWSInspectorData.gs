let AWS_ACCESS_KEY = '';
let AWS_SECRET_KEY = '';
let AWS_REGION = '';

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  AWS_ACCESS_KEY = params.AWS_ACCESS_KEY;
  AWS_SECRET_KEY = params.AWS_SECRET_KEY;
  AWS_REGION = params.AWS_REGION;
  Logger.log("AWS secrets received securely.");
  return ContentService.createTextOutput("Secrets received successfully.");
}

function fetchAWSInspectorData() {
    if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY || !AWS_REGION) {
      throw new Error('AWS credentials or region not set. Fetch credentials first.');
    }
  // Ensure AWS credentials are fetched
  fetchAwsCredentialsFromGitHub();

  const payload = JSON.stringify({
    maxResults: 100 // Adjust based on API limits
  });
  const INSPECTOR_API_URL = `https://inspector2.${AWS_REGION}.amazonaws.com/findings/list`;
  const requestHeaders = generateAwsHeaders('POST', INSPECTOR_API_URL, payload);

  try {
    const findingsResponse = UrlFetchApp.fetch(INSPECTOR_API_URL, {
      method: 'POST',
      headers: requestHeaders,
      payload: payload
    });
    const findingsData = JSON.parse(findingsResponse.getContentText());
    return findingsData.findings.map(finding => ({
      "Weakness Name": finding.title,
      "CVE": finding.vulnerabilities?.[0]?.id || 'N/A',
      "Asset Identifier": finding.resources?.map(resource => resource.id).join(', ') || 'N/A',
      "Severity": finding.severity,
      "Description": finding.description || '',
      "Discovery Date": finding.firstObservedAt || 'N/A',
      "Source": "AWS Inspector"
    }));
  } catch (error) {
    Logger.log(`Error fetching AWS Inspector data: ${error.message}`);
    throw new Error('Failed to fetch AWS Inspector data. Please check your API credentials and network connectivity.');
  }
}
function generateAwsHeaders(method, url, payload) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ''); // Format as YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8); // YYYYMMDD
  const host = `inspector2.${AWS_REGION}.amazonaws.com`;
  const canonicalUri = '/findings/list';
  const canonicalQueryString = '';
  const canonicalHeaders = `host:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-date';

  const payloadHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, payload)
    .map(b => ('0' + (b & 0xFF).toString(16)).slice(-2))
    .join('');

  const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${AWS_REGION}/inspector2/aws4_request`;

  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, canonicalRequest)
    .map(b => ('0' + (b & 0xFF).toString(16)).slice(-2))
    .join('')}`;

  const signingKey = getSignatureKey(AWS_SECRET_KEY, dateStamp, AWS_REGION, 'inspector2');
  const signature = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_256, stringToSign, signingKey)
    .map(b => ('0' + (b & 0xFF).toString(16)).slice(-2))
    .join('');

  return {
    'Content-Type': 'application/json',
    'X-Amz-Date': amzDate,
    'Authorization': `${algorithm} Credential=${AWS_ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
  };
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_256, dateStamp, `AWS4${key}`);
  const kRegion = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_256, regionName, kDate);
  const kService = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_256, serviceName, kRegion);
  const kSigning = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_256, 'aws4_request', kService);
  return kSigning;
}
