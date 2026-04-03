import { useState } from 'react'

export default function SeatingConfig({ selectedClass, onConfigure, onBack }) {
  const [rows, setRows] = useState(5)
  const [cols, setCols] = useState(6)
  const [error, setError] = useState('')

  function handleChange(setter) {
    return (e) => {
      const val = parseInt(e.target.value, 10)
      setter(isNaN(val) ? '' : val)
      setError('')
    }
  }

  function handleContinue() {
    if (!rows || rows < 1 || rows > 20) {
      setError('Rows must be between 1 and 20.')
      return
    }
    if (!cols || cols < 1 || cols > 20) {
      setError('Columns must be between 1 and 20.')
      return
    }
    onConfigure(rows, cols)
  }

  const capacity = (rows || 0) * (cols || 0)

  return (
    <div className="step">
      <h2>Step 3: Seating Chart Size</h2>
      <p>
        Configure the seating chart grid for <strong>{selectedClass.name}</strong>.
        Students will be placed alphabetically left-to-right, top-to-bottom.
      </p>

      <div className="seating-inputs">
        <div className="form-group">
          <label className="form-label" htmlFor="rows">Rows</label>
          <input
            id="rows"
            type="number"
            min="1"
            max="20"
            value={rows}
            onChange={handleChange(setRows)}
            style={{ width: '100px' }}
          />
        </div>
        <div className="seating-x">×</div>
        <div className="form-group">
          <label className="form-label" htmlFor="cols">Columns</label>
          <input
            id="cols"
            type="number"
            min="1"
            max="20"
            value={cols}
            onChange={handleChange(setCols)}
            style={{ width: '100px' }}
          />
        </div>
      </div>

      {rows > 0 && cols > 0 && (
        <div className="capacity-note">
          Grid holds <strong>{capacity} seats</strong>.
        </div>
      )}

      <div className="seating-preview" aria-label="Seating chart preview">
        {Array.from({ length: Math.min(rows || 0, 8) }, (_, r) => (
          <div key={r} className="preview-row">
            {Array.from({ length: Math.min(cols || 0, 10) }, (_, c) => (
              <div key={c} className="preview-cell" />
            ))}
          </div>
        ))}
        {(rows > 8 || cols > 10) && (
          <div className="preview-overflow">
            Preview truncated — full grid will appear in spreadsheet
          </div>
        )}
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}

      <div className="button-row">
        <button className="primary" onClick={handleContinue}>
          Generate Spreadsheet
        </button>
        <button className="secondary" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  )
}
