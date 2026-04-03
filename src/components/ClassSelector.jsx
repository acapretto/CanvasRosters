import { useState } from 'react'

export default function ClassSelector({ classes, onSelect, onBack }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  // Canvas returns many types of courses; filter out unnamed/null-named ones
  const filtered = classes
    .filter((c) => c.name && c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))

  function handleContinue() {
    if (selected) onSelect(selected)
  }

  return (
    <div className="step">
      <h2>Step 2: Select a Class</h2>
      <p>Choose which class you want to export. Only active classes are shown.</p>

      {classes.length === 0 ? (
        <div className="empty-state">
          No active classes found in this Canvas account. Make sure you are enrolled as a teacher.
        </div>
      ) : (
        <>
          {classes.length > 5 && (
            <div className="form-group">
              <label className="form-label" htmlFor="class-search">Search classes</label>
              <input
                id="class-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by class name..."
                autoFocus
              />
            </div>
          )}

          <div className="class-list" role="listbox" aria-label="Available classes">
            {filtered.length === 0 ? (
              <div className="empty-state">No classes match your search.</div>
            ) : (
              filtered.map((course) => (
                <div
                  key={course.id}
                  className={`class-item${selected?.id === course.id ? ' selected' : ''}`}
                  role="option"
                  aria-selected={selected?.id === course.id}
                  onClick={() => setSelected(course)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelected(course)}
                >
                  <div className="class-name">{course.name}</div>
                  {course.course_code && (
                    <div className="class-code">{course.course_code}</div>
                  )}
                </div>
              ))
            )}
          </div>

          {filtered.length > 0 && (
            <div className="button-row">
              <button className="primary" onClick={handleContinue} disabled={!selected}>
                Continue with {selected ? `"${selected.name}"` : 'selected class'}
              </button>
              <button className="secondary" onClick={onBack}>
                Back
              </button>
            </div>
          )}
        </>
      )}

      {!filtered.length && classes.length > 0 && (
        <button className="secondary" onClick={onBack}>Back</button>
      )}
    </div>
  )
}
