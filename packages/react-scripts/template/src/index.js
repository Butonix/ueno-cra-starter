import React from 'react';
import ReactDOM from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import asyncBootstrapper from 'react-async-bootstrapper';
import { AsyncComponentProvider } from 'react-async-component';
import App from './routes';
import * as serviceWorker from './serviceWorker';

// Does the user's browser support the HTML5 history API?
// If the user's browser doesn't support the HTML5 history API then we
// will force full page refreshes on each page change.
const supportsHistory = 'pushState' in window.history;

// Get any rehydrateState for the async components.
// eslint-disable-next-line no-underscore-dangle
const asyncComponentsRehydrateState = window.__asyncComponentsRehydrateState;

const app = (
  <AsyncComponentProvider rehydrateState={asyncComponentsRehydrateState}>
    <BrowserRouter forceRefresh={!supportsHistory}>
      <App />
    </BrowserRouter>
  </AsyncComponentProvider>
);

asyncBootstrapper(app).then(() => {
  // Render the app to #root
  ReactDOM.hydrate(app, document.getElementById('root'));
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

// Add HMR
if (module.hot) {
  module.hot.accept('./routes', () => {
    const NextApp = require('./routes').default;
    ReactDOM.render(<NextApp />, document.getElementById('root'));
  });
}
