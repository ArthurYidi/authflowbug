# Auth Flow Bug: Minimal Reproducible Example

This repository contains a minimal reproducible example that demonstrates a bug in Chrome's `chrome.identity.launchWebAuthFlow` API. The issue occurs when a user enters incorrect credentials during the authentication process. Instead of showing the error page as expected, the authentication window closes abruptly.

## Bug Description

The issue arises when using the `chrome.identity.launchWebAuthFlow` and authentication server uses HTML Form Handling (Server-Side Handling). If the credentials entered by the user are invalid, the server returns an error page (HTTP 401). However, instead of displaying the error page in the authentication pop-up window, the window closes unexpectedly.

This behavior is problematic because:
- The user cannot see why their login attempt failed.
- The extension does not receive proper feedback about the failure (e.g., no redirect URL or error message is provided).

## Repository Structure

```
├── authServer/
│   └── server.js        # A simple HTTP server that simulates an authentication flow
├── extension/
│   ├── manifest.json    # Chrome extension manifest file
│   ├── option.html      # Extension options page
│   ├── option.js        # Options page JavaScript logic
│   └── serviceWorker.js # Background script for the extension
```

### Components

1. **Authentication Server (`authServer/server.js`)**:  
   A simple Node.js server that serves an HTML login form and processes authentication requests. It redirects to a success URL for valid credentials or displays an error page for invalid credentials.

2. **Chrome Extension**:  
   - **Options Page (`extension/option.html`)**: Contains a button to initiate the authentication flow.
   - **Client Logic (`extension/option.js`)**: Uses `chrome.identity.launchWebAuthFlow` to open the authentication window.
   - **Service Worker (`extension/serviceWorker.js`)**: Opens the options page when the extension is installed.

## Steps to Reproduce

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/authflowbug.git
   cd authflowbug
   ```

2. Install and run the authentication server:
   ```bash
   cd authServer
   node authServer/server.js
   ```
   The server will start at `http://localhost:3000`.

3. Load the Chrome extension:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top-right corner).
   - Click **Load unpacked** and select the `extension` folder in this repository.

4. Initiate the authentication flow:
   - Click the **Sign in** button on the options page.
   - The authentication window will open.

5. Test valid credentials:
   - Use the following credentials provided by the server:
     ```
     Username: demo
     Password: demo
     ```
   - The window will redirect to a success URL, and "Success!" will be displayed on the options page.

6. Test invalid credentials:
   - Enter any incorrect username or password.
   - Expected behavior: The authentication window should display an error page with a message like "Login Failed" and a "Try again" link.
   - Actual behavior: The authentication window closes abruptly without displaying the error page.

## Expected Behavior

When invalid credentials are entered, the error page should be displayed in the `launchWebAuthFlow` pop-up window so that users can retry their login attempt or understand why it failed.

**Expected page:**

<img width="255" alt="Screenshot 2024-12-10 at 4 09 29 PM" src="https://github.com/user-attachments/assets/353b45b7-9ba7-46ed-b70c-4ad62734af51">

## Actual Behavior

The `launchWebAuthFlow` pop-up window closes abruptly when invalid credentials are entered, leaving users without feedback on their failed login attempt.

## Example Video

https://github.com/user-attachments/assets/fc0d7a33-9dbd-4747-a579-e349a6af0b1c




