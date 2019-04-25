import React, { Component } from 'react';
import StreamrClient from 'streamr-client'
import './index.css'
const client = new StreamrClient({
    auth: {
        apiKey: process.env.REACT_APP_STREAMR_API_KEY
    }
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      doorOpens: []
    }
  const subscribe = async () => {
    const sub = await client.subscribe(
      {
          stream: process.env.REACT_APP_STREAM_ID,
          resend: {
            from: {
              timestamp: (Date.now()-86400000) // Last 24h
            }
          }
      },
      (message, metadata) => {
        // console.log(new Date(message.timestamp))
        // console.log(message.timestamp)
        this.setState(prevState => ({
          doorOpens: [message, ...prevState.doorOpens]
        }))          
      }
    )
    sub.on('subscribed', () => {
      console.log(`Subscribed to ${sub.streamId}`)
    })
    sub.on('unsubscribed', () => {
      console.log(`Unsubscribed from ${sub.streamId}`)
    })
  }
  subscribe()

}

  renderOpened = (opened) => {
    return (
      <div className="opened">
        <p style={{fontWeight: 'bold', fontSize: "1.4vw"}}>{new Date(opened.timestamp).toString()}</p>
        <p>Ruuvi id: {opened.deviceUuid}</p>
        <p>G-force of event: {opened.gForce}</p>
        <p>Mean G-force: {opened.gForceMean}</p>
        <p>zScore: {opened.zScoreG}</p>

      </div>
    )
  }

  render() {
    return (
      <div className="wrapper">
        <h1>
          Fridge door last 24h
        </h1>
        {this.state.doorOpens.map(open =>
            this.renderOpened(open)
          )}
      </div>
    );
  }
}

export default App;
