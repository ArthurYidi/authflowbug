const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const url = require("url");

const PORT = 3000;
const user = { username: "demo", password: "demo" };

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // authentication page with simple html form
  if (path === "/" && req.method === "GET") {
    // chrome extension id used for callback redirect
    const { id } = parsedUrl.query;
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sign In</title>
        </head>
        <body>
            <div class="login-container">
                <h2>Welcome Back</h2>
                <form action="/login" method="POST">
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <pre>Valid user: Username: "${user.username}" and Password: "${user.password}"</pre>
                    <input type="hidden" id="id" name="id" value="${id}">
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </body>
        </html>        
    `);
  } else if (path === "/login" && req.method === "POST") {
    // Handle form submission
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const formData = querystring.parse(body);
      const { username, password, id } = formData;

      // Check credentials
      const isValidUser =
        user.username === username && user.password === password;

      if (isValidUser) {
        res.writeHead(303, {
          Location: `https://${id}.chromiumapp.org/success`,
        });
        res.end();
      } else {
        // ASSERTION: Expected the following error page to be shown in launchWebAuthFlow
        res.writeHead(401, { "Content-Type": "text/html" });
        res.end(`
            <h1>Login Failed</h1>
            <p>Invalid username or password</p>
            <a href="/">Try again</a>
        `);
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Sample auth server running at http://localhost:${PORT}/`);
});
