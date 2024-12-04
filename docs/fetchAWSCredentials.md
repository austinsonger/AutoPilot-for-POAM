
# fetch Function (AWS Inspector)

> This function securely receives AWS credentials via an HTTP POST request and stores them in global variables for further use in API requests.

## Key Steps
1. **Parse Incoming Data**:
   - Extracts AWS credentials and region from the request body.
2. **Store Credentials**:
   - Populates global variables with the received credentials.
3. **Log Success**:
   - Logs a message confirming receipt of credentials.
4. **Send Response**:
   - Returns a success message to the client.

## Code Walkthrough

### **Parse Incoming Data**
```javascript
const params = JSON.parse(e.postData.contents);
AWS_ACCESS_KEY = params.AWS_ACCESS_KEY;
AWS_SECRET_KEY = params.AWS_SECRET_KEY;
AWS_REGION = params.AWS_REGION;
```

### **Log Success**
```javascript
Logger.log("AWS secrets received securely.");
```

### **Send Response**
```javascript
return ContentService.createTextOutput("Secrets received successfully.");
```

## Workflow
1. A client sends AWS credentials via an HTTP POST request.
2. The function extracts the credentials and region from the request.
3. The credentials are stored in global variables.
4. A confirmation message is logged and returned to the client.

## Potential Enhancements
- Add validation to ensure all required fields are present in the request.
- Encrypt credentials before storing them in global variables.
