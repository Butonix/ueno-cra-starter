/* eslint-disable no-console */
import express from 'express';
import app from './app';
const { PORT } = process.env;

// Start server
const server = app.listen(PORT, err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(
    `\n\nStarted server on http://localhost:${PORT} 🦄\nPress Ctrl-C to stop.\n`
  );
});

// HMR Support
if (module.hot) {
  let _app = app;
  module.hot.accept('./app', () => {
    server.removeListener('request', _app);
    import('./app')
      .then(module => {
        _app = module.default;
        server.on('request', _app);
      })
      .catch(err => {
        console.log('Failed to hot-reload server!', err);
      });
  });
  module.hot.accept();
  module.hot.dispose(server.close);
}
