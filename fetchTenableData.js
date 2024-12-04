let TENABLE_API_KEY = '';

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  TENABLE_API_KEY = params.TENABLE_API_KEY;

  Logger.log("Tenable API key received securely.");
  return ContentService.createTextOutput("API key received successfully.");
}

function fetchTenableData() {
    // Ensure the API key is fetched from GitHub
    try {
        TENABLE_API_KEY = fetchTenableApiKeyFromGitHub();
    } catch (error) {
        Logger.log(`Error setting TENABLE_API_KEY: ${error.message}`);
        throw new Error('Tenable API key retrieval failed. Aborting data fetch.');
    }

    if (!TENABLE_API_KEY) {
        throw new Error('Tenable API key not set. Ensure the key is passed securely.');
    }

    const TENABLE_BASE_URL = 'https://federal.tenable.com';
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${TENABLE_API_KEY}`,
            'Accept': 'application/json'
        }
    };

    try {
        // Fetch assets (to map vulnerabilities to assets)
        const assetsResponse = UrlFetchApp.fetch(`${TENABLE_BASE_URL}/assets`, requestOptions);
        const assetsData = JSON.parse(assetsResponse.getContentText());

        // Fetch vulnerabilities
        const vulnsResponse = UrlFetchApp.fetch(`${TENABLE_BASE_URL}/vulnerabilities/export`, requestOptions);
        const vulnsData = JSON.parse(vulnsResponse.getContentText());

        // Process and format the data
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
}