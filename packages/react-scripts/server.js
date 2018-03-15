/* global WEBPACK_MODE */
'use strict';

const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Helmet = require('react-helmet').default;
const { StaticRouter } = require('react-router-dom');
const asyncBootstrapper = require('react-async-bootstrapper').default;
const {
  AsyncComponentProvider,
  createAsyncContext,
} = require('react-async-component');

const appDirectory = fs.realpathSync(process.cwd());
const isDev =
  typeof WEBPACK_MODE !== 'undefined' && WEBPACK_MODE === 'development';
const { REMOTE_PORT: port, HOST: host = 'localhost' } = process.env;
const buildDir = path.join(
  appDirectory,
  isDev ? './node_modules/@ueno/react-scripts/config/build' : './build'
);

// Get server manifest
const getManifest = () => {
  try {
    return JSON.parse(
      fs.readFileSync(`${buildDir}/asset-manifest.json`, 'utf8')
    );
  } catch (err) {
    console.error('Failed reading asset-manifest.json');
  }
  return {};
};

let manifest = getManifest();

// Inject webpackDevServer hack
const writeWindow = items =>
  Object.entries(items).map(([key, value]) => `window.__${key} = ${value};`)
    .join`\n`;

const render = App => (req, res) => {
  const asyncComponentsContext = createAsyncContext();

  // Get error
  const reactRouterContext = {
    status: 200,
  };

  const globalVariables = writeWindow({
    devServerPort: port,
    asyncComponentsRehydrateState: JSON.stringify(
      asyncComponentsContext.getState()
    ),
  });

  const scripts = [];

  if (isDev) {
    // Inject scripts from client development server
    scripts.push(`http://${host}:${port}/static/js/bundle.js`);
    scripts.push(`http://${host}:${port}/static/js/vendors~main.chunk.js`);
    scripts.push(`http://${host}:${port}/static/js/main.chunk.js`);

    // Update manifest
    manifest = getManifest();
  } else {
    scripts.push(manifest['runtime~main.js']);
    scripts.push(manifest['vendors~main.js']);
    scripts.push(manifest['main.js']);
  }

  // Stream react to response
  const app = React.createElement(
    AsyncComponentProvider,
    { asyncContext: asyncComponentsContext },
    React.createElement(
      StaticRouter,
      { location: req.url, context: reactRouterContext },
      React.createElement(App, null)
    )
  );

  asyncBootstrapper(app).then(() => {
    const helmet = Helmet.renderStatic();

    res.writeHead(reactRouterContext.status, {
      'Content-Type': 'text/html; utf-8',
    });
    res.write('<!DOCTYPE>');
    res.write(`<html ${helmet.htmlAttributes.toString()}>
  <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    <link rel="stylesheet" href="${manifest['main.css']}" />
    <script>${globalVariables}</script>
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <div id="root">`);

    const reactStream = ReactDOMServer.renderToNodeStream(app);
    // Pipe stream to response
    reactStream.pipe(res, { end: false });
    reactStream.on('end', () => {
      res.write(`</div>
      ${scripts.map(url => `<script src="${url}"></script>`).join`\n      `}
    </body>
  </html>`);
      res.end();
    });
  });
};

module.exports = {
  render,
  buildDir,
  staticDir: path.join(buildDir, 'static'),
};
