import { useState } from 'react'
import { getStudents } from '../utils/canvasApi'
import { generateRosterExcel } from '../utils/excelGenerator'

export default function ExportButton({ token, domain, selectedClass, rows, cols, onBack, onReset }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [studentCount, setStudentCount] = useState(null)

  async function handleExport() {
    setLoading(true)
    setError('')
    setSuccess(false)
    setStudentCount(null)

    try {
      const students = await getStudents(token, selectedClass.id, domain)

      if (students.length === 0) {
        setError('No students found in this class. Check the class enrollment in Canvas.')
        return
      }

      setStudentCount(students.length)
      const blob = await generateRosterExcel(students, selectedClass.name, rows, cols)

      const safeName = selectedClass.name.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, '_')
      const filename = `${safeName}_Rosters.xlsx`

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="step">
      <h2>Step 4: Download Your Roster</h2>
      <p>
        Ready to export <strong>{selectedClass.name}</strong> — seating chart set to {rows} rows × {cols} columns.
      </p>

      <div className="export-details">
        <div className="sheet-list">
          <div className="sheet-item">Roster — names, IDs, emails, enrollment status</div>
          <div className="sheet-item">Seating Chart — {rows * cols} seat grid, alphabetical</div>
          <div className="sheet-item">Sign-In Sheet — 10 school day columns</div>
          <div className="sheet-item">Grade Book — student names + 10 blank assignment columns</div>
        </div>
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}

      {success && (
        <div className="success-message" role="status">
          Downloaded successfully! {studentCount} students across 4 sheets.
          <br />
          <span className="success-hint">Need another class? Use the buttons below.</span>
        </div>
      )}

      <div className="button-row">
        <button className="primary" onClick={handleExport} disabled={loading}>
          {loading ? 'Generating spreadsheet...' : success ? 'Download Again' : 'Download Roster.xlsx'}
        </button>
        <button className="secondary" onClick={onBack} disabled={loading}>
          Change Seating
        </button>
        <button className="secondary" onClick={onReset} disabled={loading}>
          Export Different Class
        </button>
      </div>
    </div>
  )
}
