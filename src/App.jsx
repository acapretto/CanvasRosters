import { useState } from 'react'
import './App.css'

export default function App() {
  const [step, setStep] = useState('token') // token, class, config, export

  return (
    <div className="container">
      <header>
        <h1>Canvas Rosters</h1>
        <p className="tagline">Free classroom rosters, seating charts & more</p>
      </header>

      <main>
        {step === 'token' && (
          <div className="step">
            <h2>Step 1: Canvas API Token</h2>
            <p>Paste your Canvas API token to get started.</p>
            <input type="password" placeholder="Paste your Canvas API token here" />
            <button onClick={() => setStep('class')}>Next: Select Class</button>
          </div>
        )}

        {step === 'class' && (
          <div className="step">
            <h2>Step 2: Select Class</h2>
            <p>Choose which Canvas class you want to export.</p>
            <button onClick={() => setStep('config')}>Next: Configure Seating</button>
          </div>
        )}

        {step === 'config' && (
          <div className="step">
            <h2>Step 3: Configure Seating Chart</h2>
            <p>Choose rows and columns for your seating chart.</p>
            <button onClick={() => setStep('export')}>Next: Export</button>
          </div>
        )}

        {step === 'export' && (
          <div className="step">
            <h2>Step 4: Download Your Roster</h2>
            <p>Your Excel file is ready!</p>
            <button className="primary">📥 Download Roster.xlsx</button>
          </div>
        )}
      </main>

      <footer>
        <p>
          Love Canvas Rosters? <a href="https://www.foiledbymath.com">Check out our other tools</a>
        </p>
      </footer>
    </div>
  )
}
