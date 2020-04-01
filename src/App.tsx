import React from 'react';
import logo from './logo.svg';
import './App.css';

import Header from './Header';
import RepoSearch from './RepoSearch'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header/>
      </header>
      <RepoSearch />
    </div>
  );
}

export default App;
