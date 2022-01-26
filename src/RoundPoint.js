import React from 'react';
import App from './App';
import About from './About';
import Login from './Login';
import style from './navbar.module.css';
import {Route, Link, Redirect, BrowserRouter as Router, Switch} from 'react-router-dom';

const RoundPoint = () => {
    return (
        
    <Router>
      <div>
        <nav>
          <ul className = {style.ul}>
            <li className = {style.li}><Link to="/">Home</Link></li>
            <li className = {style.li}><Link to="/login">Inventory</Link></li>
            <li className = {style.li}><Link to="/about">About</Link></li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about"><About /></Route>
          <Route path="/login"><Login /></Route>
          <Route path="/"><App /></Route>
        </Switch>
      </div>
    </Router>
    
           
        

    );
}
export default RoundPoint;