'use strict'
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import firebase from 'firebase'
import oAuth from 'firebase/auth'
import Events from './Events'
const calendarId = process.env.REACT_APP_CALENDAR_ID
const calendarApiKey = process.env.REACT_APP_CALENDAR_API_KEY
const calendarClientId = process.env.REACT_APP_CALENDAR_CLIENT_ID
const eventBriteKey = process.env.REACT_APP_EVENTBRITE_API_KEY
const firebaseKey = process.env.REACT_APP_FIREBASE_API_KEY
const latitude = 40.7358
const longitude = -74.0036
const discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
let url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${calendarApiKey}`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: {}
    }
  }
  componentDidMount = async () => {
    this.initGapi()
    const events = await axios.get(`https://www.eventbriteapi.com/v3/events/search/?q=tech%20javascript&sort_by=date&location.latitude=${latitude}&location.longitude=${longitude}&location.within=10mi&token=${eventBriteKey}`)
    this.setState(() => ({ events: events.data.events }))
    console.log(this.state.events)
  }

  initGapi = () => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/client.js';
    script.async = true
    script.onload = () => {
      window.gapi.load('client:auth2', this.initClient)
    }

    document.body.appendChild(script)
  }

  initClient = () => {
    window.gapi.client.init({
      apiKey: calendarApiKey,
      clientId: calendarClientId,
      discoveryDocs: discoveryDocs,
      scope: 'https://www.googleapis.com/auth/calendar'
    }).then(() => {
      window.gapi.client.load('calendar', 'v3', () => {
        console.log(window.gapi.client.calendar)
      })
      // window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus)
      // this.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
      //this.setState(() => ({ gapiReady: true }))
    })
  }

  updateSigninStatus = (isSignedIn) => {
    // When signin status changes, this function is called.
    // If the signin status is changed to signedIn, we make an API call.
    if (isSignedIn) {
      this.bulkEventCreator()
    }
  }

  handleSignInClick = () => {
    window.gapi.auth2.getAuthInstance().signIn()
  }

  handleSignOutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut()
  }

  bulkEventCreator = () => {
    this.state.events.forEach(event => {
      const newEvent = {
        summary: event.name.text,
        description: event.description.text,
        start: {
          dateTime: event.start.local + '-08:00',
          timeZone: event.start.timezone
        },
        end: {
          dateTime: event.end.local + '-08:00',
          timeZone: event.end.timezone
        },
      }
      this.createEvent(newEvent)
    })
  }

  getEvents = () => {
    console.log('this is clear', window.gapi.client.calendar.calendars )
    window.gapi.client.calendar.events.list({
      calendarId
    }).then((events) => console.log(events))
  }

  createEvent = (newEvent) => {
      window.gapi.client.calendar.events.insert({
        calendarId,
        resource: newEvent
      }).then((event) => console.log(event))
  }

  clearEvents = () => {
      window.gapi.client.calendar.events.delete({
        calendarId,
        eventId: '6sem393s9a2qo0rlns3v697g7v'
      }).then(thing =>
        console.log(thing)
      ).catch(err => console.error(err.message))
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
        <button onClick={this.handleSignInClick}>Google Sign In</button>
        <button onClick={this.handleSignOutClick}>Google Sign Out</button>
        <button onClick={this.bulkEventCreator}>Create Event</button>
        <button onClick={this.clearEvents}>Clear Events</button>
        <button onClick={this.getEvents}>Get Events</button>
      </div>
    );
  }
}

export default App;
