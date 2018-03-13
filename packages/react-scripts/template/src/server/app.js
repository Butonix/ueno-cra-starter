import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import App from '../App';

// Create express app
const app = express();
const isDev =
  typeof WEBPACK_MODE !== 'undefined' && WEBPACK_MODE === 'development';
const { REMOTE_PORT: port, HOST: host = 'localhost' } = process.env;
const buildDir = isDev
  ? './node_modules/@ueno/react-scripts/config/build'
  : './build';

// Serve static assets
app.use('/static', express.static(`${buildDir}/static`));
app.use(express.static('public'));

// Inject webpackDevServer hack
const webpackDevServerInject = { __html: `window.__devServerPort = ${port};` };

// Get server manifest
const manifest = (() => {
  try {
    return JSON.parse(
      fs.readFileSync(`${buildDir}/asset-manifest.json`, 'utf8')
    );
  } catch (err) {
    console.error('Failed reading asset-manifest.json');
  }
  return {};
})();

// Serve react app
app.get('*', (req, res) => {
  // Write doctype to response
  res.write('<!DOCTYPE html>');

  // Stream react to response
  ReactDOMServer.renderToNodeStream(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,shrink-to-fit=no"
        />
        <meta name="theme-color" content="#000000" />
        <title>React App</title>
        <link rel="stylesheet" href={manifest['main.css']} />
      </head>
      <body>
        <div id="root">
          <App />
        </div>
        {isDev && <script dangerouslySetInnerHTML={webpackDevServerInject} />}
        {isDev && <script src={`http://${host}:${port}/static/js/bundle.js`} />}
        {isDev && (
          <script
            src={`http://${host}:${port}/static/js/vendors~main.chunk.js`}
          />
        )}
        {isDev && (
          <script src={`http://${host}:${port}/static/js/main.chunk.js`} />
        )}
        {!isDev && <script src={manifest['runtime~main.js']} />}
        {!isDev && <script src={manifest['vendors~main.js']} />}
        {!isDev && <script src={manifest['main.js']} />}
      </body>
    </html>
  ).pipe(res);
});

export default app;
