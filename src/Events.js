import React, { Component } from 'react'

class Events extends Component {
  constructor(props) {
    super(props)
    this.state = { events: {} }
  }
  componentDidMount = async () => {
    console.log(window.gapi.client.calendar)
    //const events = await window.gapi.client.calendar.calendarList.get()
    //console.log(events)
  }

  render () {
    return <h3>Ahh real monsters!</h3>
  }
}

export default Events
