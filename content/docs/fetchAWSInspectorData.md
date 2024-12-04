
# fetchAWSInspectorData Function

> This function fetches vulnerability data from AWS Inspector, dynamically generating AWS Signature Version 4 headers for secure authentication. It processes and formats the data into a structured format.

## Key Steps
1. **Check for Credentials**:
   - Verifies that AWS credentials (`AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, and `AWS_REGION`) are set.
   - Throws an error if credentials are missing.

2. **Generate Request Payload**:
   - Prepares a payload for querying AWS Inspector for findings.

3. **Generate Headers**:
   - Uses the `generateAwsHeaders` function to create AWS Signature Version 4 headers for secure API requests.

4. **Fetch Data**:
   - Sends a POST request to AWS Inspector's API to retrieve findings.

5. **Process Response**:
   - Parses the JSON response to extract and format vulnerability data into a simplified structure.

## Code Walkthrough

### **Check for Credentials**
```javascript
if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY || !AWS_REGION) {
  throw new Error('AWS credentials or region not set. Fetch credentials first.');
}
```

### **Generate Request Payload**
```javascript
const payload = JSON.stringify({
  maxResults: 100 // Adjust based on API limits
});
const INSPECTOR_API_URL = `https://inspector2.${AWS_REGION}.amazonaws.com/findings/list`;
```

### **Generate Headers**
```javascript
const requestHeaders = generateAwsHeaders('POST', INSPECTOR_API_URL, payload);
```

### **Fetch and Process Data**
```javascript
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
```

## Workflow
1. The function checks if AWS credentials are set.
2. Sends a POST request to AWS Inspector's API.
3. Retrieves and formats the vulnerability data for further use.

## Potential Enhancements
- Add more detailed logging for troubleshooting.
- Implement retries for failed API requests.


# generateAwsHeaders Function

> This function generates AWS Signature Version 4 headers for secure authentication with AWS APIs. It is used in conjunction with AWS Inspector and other AWS services.

## Key Steps
1. **Prepare Canonical Request**:
   - Constructs a canonical representation of the request, including method, URI, headers, and payload.

2. **Generate String to Sign**:
   - Combines the canonical request, credential scope, and current date into a string for signing.

3. **Create Signing Key**:
   - Derives a signing key using the AWS secret key, date, region, and service.

4. **Generate Signature**:
   - Signs the string-to-sign using the derived signing key.

5. **Return Headers**:
   - Constructs and returns the required headers, including the Authorization header.

## Code Walkthrough

### **Prepare Canonical Request**
```javascript
const canonicalRequest = `${method}
${canonicalUri}
${canonicalQueryString}
${canonicalHeaders}
${signedHeaders}
${payloadHash}`;
```

### **Generate String to Sign**
```javascript
const stringToSign = `${algorithm}
${amzDate}
${credentialScope}
${Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, canonicalRequest)
  .map(b => ('0' + (b & 0xFF).toString(16)).slice(-2))
  .join('')}`;
```

### **Create Signing Key**
```javascript
const signingKey = getSignatureKey(AWS_SECRET_KEY, dateStamp, AWS_REGION, 'inspector2');
```

### **Generate Signature**
```javascript
const signature = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_256, stringToSign, signingKey)
  .map(b => ('0' + (b & 0xFF).toString(16)).slice(-2))
  .join('');
```

### **Return Headers**
```javascript
return {
  'Content-Type': 'application/json',
  'X-Amz-Date': amzDate,
  'Authorization': `${algorithm} Credential=${AWS_ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
};
```

## Workflow
1. Constructs a canonical request based on the HTTP method, URI, headers, and payload.
2. Generates a string-to-sign based on the canonical request and credential scope.
3. Creates a signing key using the AWS secret key, date, region, and service.
4. Signs the string-to-sign to produce a signature.
5. Returns headers, including the Authorization header, for the AWS API request.

## Potential Enhancements
- Modularize the function to support multiple AWS services dynamically.
- Add more detailed error handling for invalid payloads or missing parameters.

