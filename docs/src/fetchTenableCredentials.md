
# fetch Function (Tenable)

> This function securely receives the Tenable API key via an HTTP POST request and stores it in a global variable for further use in API requests.

## Key Steps
1. **Parse Incoming Data**:
   - Extracts the Tenable API key from the request body.

2. **Store API Key**:
   - Populates the global variable with the received API key.

3. **Log Success**:
   - Logs a message confirming receipt of the API key.

4. **Send Response**:
   - Returns a success message to the client.

## Code Walkthrough

### **Parse Incoming Data**
```javascript
const params = JSON.parse(e.postData.contents);
TENABLE_API_KEY = params.TENABLE_API_KEY;
```

### **Log Success**
```javascript
Logger.log("Tenable API key received securely.");
```

### **Send Response**
```javascript
return ContentService.createTextOutput("API key received successfully.");
```

## Workflow
1. A client sends the Tenable API key via an HTTP POST request.
2. The function extracts the API key from the request.
3. The API key is stored in a global variable.
4. A confirmation message is logged and returned to the client.

## Potential Enhancements
- Validate the API key format before storing it.
- Add encryption to securely store the API key.
