import React, { Component, Fragment } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Header from '../components/header';
import Home from './home';
import About from './about';
import NotFound from './not-found';
import '../index.css';

export default class App extends Component {
  render() {
    return (
      <Fragment>
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
