import { useState } from 'react'
import TokenInput from './components/TokenInput'
import ClassSelector from './components/ClassSelector'
import SeatingConfig from './components/SeatingConfig'
import ExportButton from './components/ExportButton'
import './index.css'

const STEPS = ['token', 'class', 'config', 'export']

const STEP_LABELS = {
  token: '1. Connect',
  class: '2. Select Class',
  config: '3. Seating',
  export: '4. Download',
}

export default function App() {
  const [step, setStep] = useState('token')
  const [token, setToken] = useState(null)
  const [domain, setDomain] = useState(null)
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [rows, setRows] = useState(null)
  const [cols, setCols] = useState(null)

  function handleAuthenticated(t, d, c) {
    setToken(t)
    setDomain(d)
    setClasses(c)
    setStep('class')
  }

  function handleClassSelected(course) {
    setSelectedClass(course)
    setStep('config')
  }

  function handleConfigured(r, c) {
    setRows(r)
    setCols(c)
    setStep('export')
  }

  function handleResetToClass() {
    setSelectedClass(null)
    setRows(null)
    setCols(null)
    setStep('class')
  }

  function handleSignOut() {
    setToken(null)
    setDomain(null)
    setClasses([])
    setSelectedClass(null)
    setRows(null)
    setCols(null)
    setStep('token')
  }

  const currentStepIndex = STEPS.indexOf(step)

  return (
    <div className="container">
      <header>
        <h1>Canvas Rosters</h1>
        <p className="tagline">Export class rosters, seating charts, sign-in sheets & grade books — free</p>
      </header>

      {step !== 'token' && (
        <nav className="step-indicator" aria-label="Progress">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`step-dot${i < currentStepIndex ? ' completed' : ''}${s === step ? ' active' : ''}`}
              aria-current={s === step ? 'step' : undefined}
            >
              <span className="step-dot-label">{STEP_LABELS[s]}</span>
            </div>
          ))}
        </nav>
      )}

      <main>
        {step === 'token' && (
          <TokenInput onAuthenticated={handleAuthenticated} />
        )}

        {step === 'class' && (
          <ClassSelector
            classes={classes}
            onSelect={handleClassSelected}
            onBack={() => setStep('token')}
          />
        )}

        {step === 'config' && (
          <SeatingConfig
            selectedClass={selectedClass}
            onConfigure={handleConfigured}
            onBack={() => setStep('class')}
          />
        )}

        {step === 'export' && (
          <ExportButton
            token={token}
            domain={domain}
            selectedClass={selectedClass}
            rows={rows}
            cols={cols}
            onBack={() => setStep('config')}
            onReset={handleResetToClass}
          />
        )}
      </main>

      <footer>
        <p>
          Love Canvas Rosters?{' '}
          <a href="https://www.foiledbymath.com" target="_blank" rel="noopener noreferrer">
            Check out our other math teacher tools
          </a>
        </p>
        {token && (
          <button className="sign-out-link" onClick={handleSignOut}>
            Sign out / clear token
          </button>
        )}
      </footer>
    </div>
  )
}
