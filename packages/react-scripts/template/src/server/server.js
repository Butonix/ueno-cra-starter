import express from 'express';
import { render, staticDir } from '@ueno/react-scripts/server';
import App from '../routes';

// Create express app
const app = express();

// Serve static assets
app.use('/static', express.static(staticDir));

// Serve public files
app.use(express.static('public'));

// Serve react app
app.get('*', render(App));

export default app;
