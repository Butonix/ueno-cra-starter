import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';

export default class About extends PureComponent {
  render() {
    return (
      <div>
        <Helmet title="About" />
        <h1>About route</h1>
      </div>
    );
  }
}
