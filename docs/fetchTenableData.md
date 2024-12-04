
# fetchTenableData Function

## Overview
This function fetches vulnerability and asset data from the Tenable API using a dynamically retrieved API key. It processes the data into a structured format for further use.

## Key Steps
1. **Fetch API Key**:
   - Retrieves the API key securely, either passed via HTTP POST or fetched from GitHub.

2. **Define API URL and Headers**:
   - Sets the base URL and authorization headers for Tenable API requests.

3. **Fetch Asset and Vulnerability Data**:
   - Sends GET requests to fetch asset and vulnerability data.

4. **Process and Format Data**:
   - Maps vulnerabilities to associated assets and structures the data into a simplified format.

## Code Walkthrough

### **Fetch API Key**
```javascript
try {
  TENABLE_API_KEY = fetchTenableApiKeyFromGitHub();
} catch (error) {
  Logger.log(`Error setting TENABLE_API_KEY: ${error.message}`);
  throw new Error('Tenable API key retrieval failed. Aborting data fetch.');
}

if (!TENABLE_API_KEY) {
  throw new Error('Tenable API key not set. Ensure the key is passed securely.');
}
```

### **Define API URL and Headers**
```javascript
const TENABLE_BASE_URL = 'https://federal.tenable.com';
const requestOptions = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${TENABLE_API_KEY}`,
    'Accept': 'application/json'
  }
};
```

### **Fetch Asset and Vulnerability Data**
```javascript
try {
  const assetsResponse = UrlFetchApp.fetch(`${TENABLE_BASE_URL}/assets`, requestOptions);
  const assetsData = JSON.parse(assetsResponse.getContentText());

  const vulnsResponse = UrlFetchApp.fetch(`${TENABLE_BASE_URL}/vulnerabilities/export`, requestOptions);
  const vulnsData = JSON.parse(vulnsResponse.getContentText());
```

### **Process and Format Data**
```javascript
  const processedData = vulnsData.map(vuln => {
    const associatedAssets = assetsData.assets.filter(asset => asset.vulnerabilities.includes(vuln.id));
    const assetIdentifiers = associatedAssets.map(asset => asset.hostnames || asset.ipv4 || asset.ipv6).join(', ');

    return {
      "Weakness Name": vuln.plugin_name,
      "CVE": vuln.cve || 'N/A',
      "Asset Identifier": assetIdentifiers,
      "Severity": vuln.severity,
      "Description": vuln.description || '',
      "Discovery Date": vuln.discovery_date || 'N/A',
      "Source": "Tenable"
    };
  });

  return processedData;
} catch (error) {
  Logger.log(`Error fetching Tenable data: ${error.message}`);
  throw new Error('Failed to fetch Tenable data. Please check your API credentials and network connectivity.');
}
```

## Example Workflow
1. Retrieves the API key dynamically.
2. Fetches asset and vulnerability data from the Tenable API.
3. Maps vulnerabilities to assets and formats the data for further processing.

## Potential Enhancements
- Add error handling for specific Tenable API errors.
- Implement caching for API responses to reduce redundant calls.
