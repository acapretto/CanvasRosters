import { useState, useMemo, useRef } from 'react'
import { parseRoster } from '../utils/parseRoster'

const PLACEHOLDER = `Smith, John
Doe, Jane
Ruiz, Alex

...or paste a whole column straight out of a spreadsheet,
or a CSV with Last Name, First Name, Email headers.`

export default function PasteRoster({ onReady, onBack }) {
  const [text, setText] = useState('')
  const [className, setClassName] = useState('')
  const [swapNameOrder, setSwapNameOrder] = useState(false)
  const [fileError, setFileError] = useState('')
  const fileRef = useRef(null)

  // Parsing is cheap and local, so re-run on every keystroke. The teacher sees
  // exactly what will land in the spreadsheet before committing to it.
  const { students, warnings } = useMemo(
    () => parseRoster(text, { swapNameOrder }),
    [text, swapNameOrder]
  )

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileError('')
    if (file.size > 1024 * 1024) {
      setFileError('That file is larger than 1 MB — is it definitely a class list?')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setText(String(reader.result || ''))
      if (!className) setClassName(file.name.replace(/\.[^.]+$/, ''))
    }
    reader.onerror = () => setFileError("Couldn't read that file. Try pasting the names instead.")
    reader.readAsText(file)
  }

  function handleContinue() {
    onReady(students, className.trim() || 'My Class')
  }

  return (
    <div className="step">
      <h2>Paste your class list</h2>
      <p>
        One student per line. "Smith, John" and "John Smith" both work, and a CSV with
        headers works too. This all happens in your browser — the list is never uploaded.
      </p>

      <label className="field-label" htmlFor="className">Class name</label>
      <input
        id="className"
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        placeholder="Algebra 1 — Period 3"
        autoComplete="off"
      />

      <label className="field-label" htmlFor="rosterText">Students</label>
      <textarea
        id="rosterText"
        className="roster-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={10}
        spellCheck={false}
      />

      <div className="paste-actions">
        <button className="secondary" onClick={() => fileRef.current?.click()}>
          Upload a CSV instead
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt,text/csv,text/plain"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
        {text && (
          <button className="secondary" onClick={() => { setText(''); setFileError('') }}>
            Clear
          </button>
        )}
      </div>

      {fileError && <div className="error-message" role="alert">{fileError}</div>}

      {students.length > 0 && (
        <div className="roster-preview">
          <div className="roster-preview-head">
            <h3>Preview — {students.length} student{students.length === 1 ? '' : 's'}</h3>
            <label className="swap-toggle">
              <input
                type="checkbox"
                checked={swapNameOrder}
                onChange={(e) => setSwapNameOrder(e.target.checked)}
              />
              First and last names are backwards
            </label>
          </div>
          <ol className="roster-preview-list">
            {students.slice(0, 60).map((s) => (
              <li key={s.id}>
                {s.name}
                {s.email && <span className="roster-preview-email"> {s.email}</span>}
              </li>
            ))}
          </ol>
          {students.length > 60 && (
            <p className="roster-preview-more">…and {students.length - 60} more.</p>
          )}
        </div>
      )}

      {warnings.length > 0 && text.trim() && (
        <div className="warning-message" role="status">
          {warnings.slice(0, 5).map((w, i) => <div key={i}>{w}</div>)}
          {warnings.length > 5 && <div>…and {warnings.length - 5} more.</div>}
        </div>
      )}

      <div className="button-row">
        <button className="primary" onClick={handleContinue} disabled={students.length === 0}>
          Use these {students.length || ''} students
        </button>
        <button className="secondary" onClick={onBack}>Back</button>
      </div>
    </div>
  )
}
