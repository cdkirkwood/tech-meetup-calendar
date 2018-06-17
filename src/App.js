'use strict'
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import firebase from 'firebase'
import oAuth from 'firebase/auth'
const eventBriteKey = process.env.REACT_APP_EVENTBRITE_API_KEY
const firebaseKey = process.env.REACT_APP_FIREBASE_API_KEY
const  latitude = 40.7358
const longitude = -74.0036

class App extends Component {
  componentDidMount = async() => {
     // Initialize Firebase
     var config = {
      apiKey: firebaseKey,
      authDomain: 'tech-meetup-calendar.firebaseapp.com',
      databaseURL: 'https://tech-meetup-calendar.firebaseio.com',
      projectId: 'tech-meetup-calendar',
      storageBucket: '',
      messagingSenderId: '995392498240'
    };
    firebase.initializeApp(config);
    // const events = await axios.get(`https://www.eventbriteapi.com/v3/events/search/?location.latitude=${latitude}&location.longitude=${longitude}&location.within=10mi&token=${eventBriteKey}`)

    const events =  await axios.get(`https://www.eventbriteapi.com/v3/events/search/?q=tech%20javascript&sort_by=date&location.latitude=${latitude}&location.longitude=${longitude}&location.within=10mi&token=${eventBriteKey}`)
    const categories = await axios.get(`https://www.eventbriteapi.com/v3/subcategories/?token=${eventBriteKey}`)
    console.log(categories)
  }

  handleClick = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/calendar')
    const result = await firebase.auth().signInWithPopup(provider)
    console.log(result.user)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.handleClick}>Google Sign In</button>
      </div>
    );
  }
}

export default App;
