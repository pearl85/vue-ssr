const fs = require('fs');
const path = require('path');
const express = require('express');
const vueServerRenderer = require('vue-server-renderer');
const app = express();
// Server-Side Bundle File
const serverBundleFilePath = path.join(__dirname, '../dist/bundle.server.js')
const serverBundleFileCode = fs.readFileSync(serverBundleFilePath, 'utf8');
const bundleRenderer = vueServerRenderer.createBundleRenderer(serverBundleFileCode);
// Client-Side Bundle File
const clientBundleFilePath = path.join(__dirname, '../dist/bundle.client.js');
const clientBundleFileUrl = '/dist/bundle.client.js';
// Server-Side Rendering
app.get('/', function (req, res) {
  bundleRenderer.renderToString((err, html) => {
    if (err){
      res.status(500).send(`
        <h1>Error: ${err.message}</h1>
        <pre>${err.stack}</pre>
      `);
    } else {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Server Side Rendering + Client Side Rendering</title>
          </head>
          <body>
            ${html}
           <script src="${clientBundleFileUrl}"></script>
          </body>
        </html>`);
    }
  });
});
// Client-Side Bundle File
app.get(clientBundleFileUrl, function (req, res) {
  const clientBundleFileCode = fs.readFileSync(clientBundleFilePath, 'utf8');
  res.send(clientBundleFileCode);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});