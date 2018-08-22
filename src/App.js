import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
//import Events from './Events'
const calendarId = process.env.REACT_APP_CALENDAR_ID
const calendarApiKey = process.env.REACT_APP_CALENDAR_API_KEY
const calendarClientId = process.env.REACT_APP_CALENDAR_CLIENT_ID
const eventBriteKey = process.env.REACT_APP_EVENTBRITE_API_KEY
const meetupApiKey = process.env.REACT_APP_MEETUP_API_KEY
const latitude = 40.7358
const longitude = -74.0036
const discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
let url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${calendarApiKey}`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eBevents: [],
      googleEvents: []
    }
  }
  componentDidMount = async () => {
    this.initGapi()
    const file = await axios.get('http://files.olo.com/pizzas.json')
    console.log(file)
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
        this.getCalEvents()
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
    this.state.eBevents.forEach(event => {
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

  getCalEvents = () => {
    window.gapi.client.calendar.events.list({
      calendarId
    })
    .then((events) => this.setState({googleEvents: events.result.items}))
    .catch(err => console.error(err.message))
  }

  getEBEvents = () => {
    axios.get(`https://www.eventbriteapi.com/v3/events/search/?q=tech%20javascript&sort_by=date&location.latitude=${latitude}&location.longitude=${longitude}&location.within=10mi&token=${eventBriteKey}`)
    .then(events => {
      const newEvents = events.data.events.filter(event => !this.state.googleEvents.find(googleEvent => {
        return googleEvent.summary === event.name.text
      }))
      this.setState(() => ({ eBevents: newEvents }))
    })
  }

  getMUEvents = () => {
    axios.get(`https://api.meetup.com/find/upcoming_events?key=${meetupApiKey}topic_category=tech&lat=${latitude}&lon=${longitude}&radius=10sign=true`)
    .then((events) => console.log(events))
    // .then(events => {
    //   const newEvents = events.data.events.filter(event => !this.state.googleEvents.find(googleEvent => {
    //     return googleEvent.summary === event.name.text
    //   }))
    //   this.setState(() => ({ eBevents: newEvents }))
    // })
  }

  createEvent = (newEvent) => {
    window.gapi.client.calendar.events.insert({
      calendarId,
      resource: newEvent
    })
    .then(event => {
      this.setState(prevState => {
        const newState = [...prevState.googleEvents, event.result]
        return {googleEvents: newState}
      })
    })
    .catch(err => console.error(err.message))
  }

  clearEvents = () => {
    this.state.googleEvents.forEach(event => {
      this.deleteEvent(event.id)
    })
  }

  deleteEvent = (eventId) => {
    window.gapi.client.calendar.events.delete({
      calendarId,
      eventId
    })
    .then(thing =>
      console.log(thing))
    .catch(err => console.error(err.message))
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
        <button onClick={this.getEBEvents}>Get EB Events</button>
        <button onClick={this.getMUEvents}>Get MU Events</button>
      </div>
    );
  }
}

export default App;
