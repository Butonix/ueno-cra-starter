import React, { Component } from 'react';
import logo from './logo.svg';
import s from './App.css';

export default class App extends Component {
  render() {
    return (
      <div className={s.App}>
        <header className={s.App__header}>
          <img src={logo} className={s.App__logo} alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className={s.App__link}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React Now
          </a>
        </header>
      </div>
    );
  }
}
