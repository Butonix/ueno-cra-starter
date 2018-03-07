import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import App from '../App';

// Create express app
const app = express();
const { REMOTE_PORT: port } = process.env;

// Serve built content
app.use('/static', express.static('./dist/static'));

// Serve react app
app.get('/', (req, res) => {
  // Write doctype to response
  res.write('<!DOCTYPE html>');

  // Stream react to response
  ReactDOMServer.renderToNodeStream(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>App</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__devServerPort = ${port};`,
          }}
        />
      </head>
      <body>
        <div id="root">
          <App />
        </div>
        <script src={`http://localhost:${port}/static/js/bundle.js`} />,
        <script
          src={`http://localhost:${port}/static/js/vendors~main.chunk.js`}
        />,
        <script src={`http://localhost:${port}/static/js/main.chunk.js`} />,
      </body>
    </html>
  ).pipe(res);
});

export default app;
