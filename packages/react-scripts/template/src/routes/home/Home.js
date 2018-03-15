import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';

export default class Home extends PureComponent {
  render() {
    return (
      <div>
        <Helmet title="Home" />
        <h1>Home route</h1>
      </div>
    );
  }
}
