/**
 * Parse a pasted or uploaded class list into Canvas-shaped student objects.
 *
 * Every downstream component (SeatingArrange, excelGenerator) expects the shape
 * Canvas returns, so manual imports are normalized to match rather than
 * special-cased throughout the app:
 *
 *   { id, name, sortable_name, email, enrollments: [] }
 *
 * Accepts anything a teacher is likely to have on hand: a column copied out of
 * Excel or Google Sheets, a CSV export from any gradebook, or names typed one
 * per line. Nothing here talks to a network — parsing is entirely local.
 */

const HEADER_HINTS = {
  last: ['last name', 'last', 'surname', 'family name', 'lastname'],
  first: ['first name', 'first', 'given name', 'firstname'],
  full: ['name', 'student', 'student name', 'full name', 'display name'],
  email: ['email', 'e-mail', 'email address', 'student email'],
  id: ['id', 'student id', 'sis id', 'sis user id', 'number'],
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function detectDelimiter(lines) {
  const sample = lines.slice(0, 10)
  if (sample.some(l => l.includes('\t'))) return '\t'
  // Only treat commas as a delimiter when they appear consistently on most
  // lines. A single column of "Last, First" values also contains commas, and
  // splitting those would shatter every name into two useless fields.
  const withComma = sample.filter(l => l.includes(',')).length
  if (withComma === 0) return null
  const counts = sample.filter(l => l.includes(',')).map(l => splitCsvLine(l, ',').length)
  const allSame = counts.every(c => c === counts[0])
  if (allSame && counts[0] > 2) return ','

  if (allSame && counts[0] === 2 && withComma === sample.length) {
    // Genuinely ambiguous: "Smith, John" and "John Smith,js@x.edu" both split
    // into two cells. Decide on content rather than shape.
    const split = sample.map(l => splitCsvLine(l, ','))
    if (matchHeader(split[0])) return ','
    const looksTabular = split.some(cells =>
      cells.some(c => EMAIL_RE.test(c) || /^\d+$/.test(c))
    )
    if (looksTabular) return ','
    // Every cell is a bare word or two — read it as one column of "Last, First".
    return null
  }
  return withComma === sample.length ? ',' : null
}

function splitCsvLine(line, delim) {
  const out = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { cur += '"'; i++ }
      else quoted = !quoted
    } else if (ch === delim && !quoted) {
      out.push(cur); cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out.map(c => c.trim())
}

function matchHeader(cells) {
  const lower = cells.map(c => c.toLowerCase().trim())
  const idx = { last: -1, first: -1, full: -1, email: -1, id: -1 }
  for (const [key, hints] of Object.entries(HEADER_HINTS)) {
    idx[key] = lower.findIndex(c => hints.includes(c))
  }
  // A header row must identify at least one name column.
  const hasName = idx.full >= 0 || (idx.last >= 0 && idx.first >= 0) || idx.last >= 0
  return hasName ? idx : null
}

/** "Smith, John" or "John Smith" -> { first, last } */
export function splitName(raw) {
  const s = (raw || '').replace(/\s+/g, ' ').trim()
  if (!s) return { first: '', last: '' }
  if (s.includes(',')) {
    const [last, ...rest] = s.split(',')
    return { last: last.trim(), first: rest.join(',').trim() }
  }
  const parts = s.split(' ')
  if (parts.length === 1) return { first: parts[0], last: '' }
  return { first: parts.slice(0, -1).join(' '), last: parts[parts.length - 1] }
}

/**
 * @param {string} text raw pasted text or file contents
 * @param {{swapNameOrder?: boolean}} opts swapNameOrder flips the assumed
 *        first/last order for single-column lists without a comma.
 * @returns {{students: Array, warnings: string[], usedHeader: boolean}}
 */
export function parseRoster(text, opts = {}) {
  const warnings = []
  const lines = (text || '')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return { students: [], warnings: ['No names found.'], usedHeader: false }

  const delim = detectDelimiter(lines)
  let header = null
  let rows

  if (delim) {
    rows = lines.map(l => splitCsvLine(l, delim))
    header = matchHeader(rows[0])
    if (header) rows = rows.slice(1)
  } else {
    rows = lines.map(l => [l])
  }

  const seen = new Set()
  const students = []

  rows.forEach((cells, i) => {
    let first = ''
    let last = ''
    let email = ''
    let sid = ''

    if (header) {
      if (header.first >= 0 && header.last >= 0) {
        first = cells[header.first] || ''
        last = cells[header.last] || ''
      } else if (header.full >= 0) {
        ({ first, last } = splitName(cells[header.full]))
      } else if (header.last >= 0) {
        ({ first, last } = splitName(cells[header.last]))
      }
      if (header.email >= 0) email = cells[header.email] || ''
      if (header.id >= 0) sid = cells[header.id] || ''
    } else {
      // No header. Use the first cell that isn't an email or a bare number.
      const nameCell = cells.find(c => c && !EMAIL_RE.test(c) && !/^\d+$/.test(c)) || ''
      ;({ first, last } = splitName(nameCell))
      email = cells.find(c => EMAIL_RE.test(c)) || ''
    }

    if (opts.swapNameOrder && first && last) {
      const t = first; first = last; last = t
    }

    const display = [first, last].filter(Boolean).join(' ').trim()
    if (!display) {
      warnings.push(`Line ${i + 1 + (header ? 1 : 0)} had no readable name — skipped.`)
      return
    }

    const key = display.toLowerCase()
    if (seen.has(key)) {
      warnings.push(`"${display}" appears more than once — kept the first.`)
      return
    }
    seen.add(key)

    students.push({
      id: sid || `manual-${students.length + 1}`,
      name: display,
      sortable_name: last ? `${last}, ${first}`.trim().replace(/,\s*$/, '') : display,
      email,
      enrollments: [],
      __manual: true,
    })
  })

  if (students.length === 0) warnings.push('No usable names found.')
  return { students, warnings, usedHeader: !!header }
}
