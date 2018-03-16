import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import { withJob } from 'react-jobs';

@withJob({
  work: () => new Promise(resolve => setTimeout(resolve, 2000)),
  shouldWorkAgain: () => false,
})
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
