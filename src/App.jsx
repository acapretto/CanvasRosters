import { useState } from 'react'
import SourcePicker from './components/SourcePicker'
import PasteRoster from './components/PasteRoster'
import TokenInput from './components/TokenInput'
import ClassSelector from './components/ClassSelector'
import SeatingConfig from './components/SeatingConfig'
import SeatingArrange from './components/SeatingArrange'
import ExportButton from './components/ExportButton'
import './index.css'

// Two routes to the same seating/export flow. Canvas fills in student IDs and
// emails automatically; the manual path works for any LMS, or none at all.
const FLOWS = {
  canvas: ['source', 'token', 'class', 'config', 'arrange', 'export'],
  manual: ['source', 'paste', 'config', 'arrange', 'export'],
}

const STEP_LABELS = {
  source: 'Start',
  token: 'Connect',
  class: 'Select Class',
  paste: 'Class List',
  config: 'Grid Size',
  arrange: 'Arrange',
  export: 'Download',
}

export default function App() {
  const [source, setSource] = useState(null) // 'canvas' | 'manual'
  const [step, setStep] = useState('source')
  const [token, setToken] = useState(null)
  const [domain, setDomain] = useState(null)
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [manualStudents, setManualStudents] = useState(null)
  const [rows, setRows] = useState(null)
  const [cols, setCols] = useState(null)
  const [allStudents, setAllStudents] = useState(null)
  const [seatingOrder, setSeatingOrder] = useState(null)

  function handlePickSource(which) {
    setSource(which)
    setStep(which === 'canvas' ? 'token' : 'paste')
  }

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

  function handleRosterReady(students, className) {
    setManualStudents(students)
    setSelectedClass({ id: 'manual', name: className })
    setStep('config')
  }

  function handleConfigured(r, c) {
    setRows(r)
    setCols(c)
    setStep('arrange')
  }

  function handleArranged(students, ordered) {
    setAllStudents(students)
    setSeatingOrder(ordered)
    setStep('export')
  }

  function clearSeating() {
    setRows(null)
    setCols(null)
    setAllStudents(null)
    setSeatingOrder(null)
  }

  // "Export a different class" means the class picker on Canvas, but the paste
  // screen on the manual path — there is no list to pick from.
  function handleResetToClass() {
    clearSeating()
    if (source === 'canvas') {
      setSelectedClass(null)
      setStep('class')
    } else {
      setStep('paste')
    }
  }

  // Canvas tokens can expire mid-session (they have a configurable lifetime and can
  // be revoked). When that happens deep in the flow, send the user straight back to
  // the token step instead of a dead end — clearSeating() plus a fresh 'token' step.
  function handleReauth() {
    clearSeating()
    setToken(null)
    setDomain(null)
    setClasses([])
    setSelectedClass(null)
    setStep('token')
  }

  function handleStartOver() {
    clearSeating()
    setSource(null)
    setToken(null)
    setDomain(null)
    setClasses([])
    setSelectedClass(null)
    setManualStudents(null)
    setStep('source')
  }

  const steps = FLOWS[source] || FLOWS.canvas
  const currentStepIndex = steps.indexOf(step)

  return (
    <div className="container">
      <header>
        <a
          href="https://www.foiledbymath.com"
          target="_blank"
          rel="noopener noreferrer"
          className="brand-lockup"
        >
          <img src="/fbm-logo.png" alt="" className="brand-logo" />
          <span className="brand-name">Foiled By Math</span>
        </a>
        <p className="brand-tagline">Faster Planning. Better Materials. Fewer Late Nights.</p>
        <h1>Canvas Rosters</h1>
        <p className="tagline">Export class rosters, seating charts, sign-in sheets &amp; grade books — free</p>
      </header>

      {step !== 'source' && (
        <nav className="step-indicator" aria-label="Progress">
          {steps.slice(1).map((s) => {
            const i = steps.indexOf(s)
            return (
              <div
                key={s}
                className={`step-dot${i < currentStepIndex ? ' completed' : ''}${s === step ? ' active' : ''}`}
                aria-current={s === step ? 'step' : undefined}
              >
                <span className="step-dot-label">{STEP_LABELS[s]}</span>
              </div>
            )
          })}
        </nav>
      )}

      <main>
        {step === 'source' && (
          <SourcePicker onPick={handlePickSource} />
        )}

        {step === 'token' && (
          <TokenInput onAuthenticated={handleAuthenticated} />
        )}

        {step === 'paste' && (
          <PasteRoster
            onReady={handleRosterReady}
            onBack={handleStartOver}
          />
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
            onBack={() => setStep(source === 'canvas' ? 'class' : 'paste')}
          />
        )}

        {step === 'arrange' && (
          <SeatingArrange
            token={token}
            domain={domain}
            selectedClass={selectedClass}
            providedStudents={manualStudents}
            rows={rows}
            cols={cols}
            onArranged={handleArranged}
            onBack={() => setStep('config')}
            onReauth={handleReauth}
          />
        )}

        {step === 'export' && (
          <ExportButton
            token={token}
            domain={domain}
            selectedClass={selectedClass}
            rows={rows}
            cols={cols}
            allStudents={allStudents}
            seatingOrder={seatingOrder}
            onBack={() => setStep('arrange')}
            onReset={handleResetToClass}
          />
        )}
      </main>

      <footer>
        <a
          href="https://www.foiledbymath.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-brand"
        >
          <img src="/fbm-logo.png" alt="" className="footer-logo" />
          <span className="footer-brand-name">Foiled By Math</span>
        </a>
        <p className="footer-tagline">Faster Planning. Better Materials. Fewer Late Nights.</p>
        <p className="footer-cta">
          Love Canvas Rosters?{' '}
          <a href="https://www.foiledbymath.com" target="_blank" rel="noopener noreferrer">
            Check out our other math teacher tools
          </a>
        </p>
        {step !== 'source' && (
          <button className="sign-out-link" onClick={handleStartOver}>
            {token ? 'Sign out / clear token' : 'Start over'}
          </button>
        )}
      </footer>
    </div>
  )
}
