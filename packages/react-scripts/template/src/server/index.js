/* eslint-disable no-console */
import express from 'express';
import app from './app';

// Get listening port
const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('[EXPRESS] Server started!');
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
        console.log('[EXPRESS] Restarted');
      })
      .catch(err => {
        console.log('[EXPRESS] Failed to hot-reload server!', err);
      });
  });
  module.hot.accept();
  module.hot.dispose(server.close);
}
