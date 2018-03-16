import React, { Component, Fragment } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import Header from './components/header';
import Home from './routes/home';
import About from './routes/about';
import NotFound from './routes/not-found';
import './App.scss';

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Helmet htmlAttributes={{ lang: 'en ' }} titleTemplate="Ueno. - %s">
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=no"
          />
        </Helmet>
        <Header>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </Header>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </Fragment>
    );
  }
}
