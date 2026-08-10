export default function SourcePicker({ onPick }) {
  return (
    <div className="step">
      <h2>Where's your class list?</h2>
      <p>
        Both options work the same way from here — you'll get a roster, seating chart,
        sign-in sheet, and grade book. Nothing is stored on our servers.
      </p>

      <div className="source-options">
        <button className="source-card" onClick={() => onPick('canvas')}>
          <span className="source-card-title">Pull it from Canvas</span>
          <span className="source-card-body">
            Paste a Canvas access token and pick a class. Best if you're on Canvas and want
            student IDs and emails filled in automatically.
          </span>
          <span className="source-card-cta">Connect Canvas →</span>
        </button>

        <button className="source-card" onClick={() => onPick('manual')}>
          <span className="source-card-title">Paste or upload a list</span>
          <span className="source-card-body">
            Copy a column of names out of any gradebook or spreadsheet, or upload a CSV.
            Works with Google Classroom, Schoology, PowerSchool, Infinite Campus — or a
            list you typed yourself.
          </span>
          <span className="source-card-cta">Paste a list →</span>
        </button>
      </div>
    </div>
  )
}
