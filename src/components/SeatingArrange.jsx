import { useState, useEffect, useRef } from 'react'
import { getStudents } from '../utils/canvasApi'

export default function SeatingArrange({ token, domain, selectedClass, providedStudents, rows, cols, onArranged, onBack }) {
  const [students, setStudents] = useState(null)
  const [grid, setGrid] = useState([]) // flat array of length rows*cols, each slot = student obj or null
  const [unplaced, setUnplaced] = useState([]) // students not on the grid
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const dragItem = useRef(null) // { source: 'grid'|'unplaced', index: number }

  useEffect(() => {
    fetchStudents()
  }, [])

  /** Seat an already-sorted list, overflowing anyone past the last chair. */
  function seat(data) {
    const sorted = [...data].sort((a, b) =>
      (a.sortable_name || '').localeCompare(b.sortable_name || '')
    )
    const totalSlots = rows * cols
    const placed = Array(totalSlots).fill(null)
    const overflow = []
    sorted.forEach((s, i) => {
      if (i < totalSlots) placed[i] = s
      else overflow.push(s)
    })
    setGrid(placed)
    setUnplaced(overflow)
  }

  async function fetchStudents() {
    setLoading(true)
    setError('')

    // Manual imports arrive already parsed — there is nothing to fetch.
    if (providedStudents) {
      setStudents(providedStudents)
      seat(providedStudents)
      setLoading(false)
      return
    }

    try {
      const data = await getStudents(token, selectedClass.id, domain)
      if (data.length === 0) {
        setError('No students found in this class.')
        return
      }
      setStudents(data)
      seat(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDragStart(source, index) {
    dragItem.current = { source, index }
  }

  function handleDropOnGrid(targetIndex) {
    if (!dragItem.current) return
    const { source, index: srcIndex } = dragItem.current
    dragItem.current = null

    setGrid(prev => {
      const next = [...prev]
      if (source === 'grid') {
        // Swap grid cells
        const temp = next[targetIndex]
        next[targetIndex] = next[srcIndex]
        next[srcIndex] = temp
      } else {
        // From unplaced to grid
        const student = unplaced[srcIndex]
        const displaced = next[targetIndex]
        next[targetIndex] = student
        setUnplaced(prev => {
          const u = [...prev]
          u.splice(srcIndex, 1)
          if (displaced) u.push(displaced)
          return u
        })
      }
      return next
    })
  }

  function handleDropOnUnplaced() {
    if (!dragItem.current) return
    const { source, index: srcIndex } = dragItem.current
    dragItem.current = null

    if (source === 'grid') {
      const student = grid[srcIndex]
      if (!student) return
      setGrid(prev => {
        const next = [...prev]
        next[srcIndex] = null
        return next
      })
      setUnplaced(prev => [...prev, student])
    }
  }

  function handleExport() {
    // Build ordered list: grid slots in order (skip nulls), then unplaced
    const ordered = grid.filter(Boolean)
    onArranged(students, ordered)
  }

  function handleAutoSort() {
    seat([...grid.filter(Boolean), ...unplaced])
  }

  if (loading) {
    return (
      <div className="step">
        <h2>Loading Students...</h2>
        <p>
          {providedStudents
            ? <>Setting up seats for <strong>{selectedClass.name}</strong></>
            : <>Fetching roster from Canvas for <strong>{selectedClass.name}</strong></>}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="step">
        <h2>Arrange Seating</h2>
        <div className="error-message" role="alert">{error}</div>
        <button className="secondary" onClick={onBack}>Back</button>
      </div>
    )
  }

  return (
    <div className="step">
      <h2>Arrange Seating</h2>
      <p>
        Drag and drop to rearrange seats for <strong>{selectedClass.name}</strong>.
        {students && <span> ({students.length} students, {rows * cols} seats)</span>}
      </p>

      <div className="arrange-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {grid.map((student, i) => (
          <div
            key={i}
            className={`arrange-cell${student ? ' occupied' : ' empty'}`}
            draggable={!!student}
            onDragStart={() => student && handleDragStart('grid', i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDropOnGrid(i)}
          >
            {student ? (
              <span className="arrange-name">{student.name}</span>
            ) : (
              <span className="arrange-empty-label">empty</span>
            )}
          </div>
        ))}
      </div>

      <div className="arrange-front-label">FRONT OF ROOM</div>

      {unplaced.length > 0 && (
        <div className="arrange-unplaced"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnUnplaced}
        >
          <h3>Unplaced Students ({unplaced.length})</h3>
          <div className="arrange-unplaced-list">
            {unplaced.map((student, i) => (
              <div
                key={student.id}
                className="arrange-chip"
                draggable
                onDragStart={() => handleDragStart('unplaced', i)}
              >
                {student.name}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="button-row">
        <button className="primary" onClick={handleExport}>
          Generate Spreadsheet
        </button>
        <button className="secondary" onClick={handleAutoSort}>
          Reset to A-Z
        </button>
        <button className="secondary" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  )
}
