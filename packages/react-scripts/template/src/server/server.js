import express from 'express';
import { render, staticDir } from '@ueno/react-scripts/server';
import Store from '../store';
import App from '../App';

// Create express app
const app = express();

// Serve static assets
app.use('/static', express.static(staticDir));

// Serve public files
app.use(express.static('public'));

// Serve react app
app.get('*', (req, res) => {
  const store = new Store();
  render(App, store)(req, res);
});

export default app;
