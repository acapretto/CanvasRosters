import ExcelJS from 'exceljs'

const NAVY = 'FF141D37'
const CREAM = 'FFFAF7F0'
const STRIPE_LIGHT = 'FFF5F5F5'
const STRIPE_WHITE = 'FFFFFFFF'

const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }
const headerFont = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
const headerAlign = { horizontal: 'center', vertical: 'middle', wrapText: true }
const thinBorder = {
  top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
}

function applyHeader(row) {
  row.eachCell((cell) => {
    cell.fill = headerFill
    cell.font = headerFont
    cell.alignment = headerAlign
    cell.border = thinBorder
  })
  row.height = 28
}

function applyStripes(sheet, startRow, endRow, colCount) {
  for (let r = startRow; r <= endRow; r++) {
    const row = sheet.getRow(r)
    const isEven = (r - startRow) % 2 === 0
    for (let c = 1; c <= colCount; c++) {
      const cell = row.getCell(c)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? STRIPE_WHITE : STRIPE_LIGHT },
      }
      cell.border = thinBorder
      cell.alignment = { vertical: 'middle' }
    }
  }
}

// seatingOrder is an array of student objects in the drag-drop arrangement order
// If null, falls back to alphabetical
export async function generateRosterExcel(students, className, rows, cols, seatingOrder) {
  const workbook = new ExcelJS.Workbook()

  const rosterSheet = workbook.addWorksheet('Roster')
  addRosterSheet(rosterSheet, students)

  const seatingSheet = workbook.addWorksheet('Seating Chart')
  addSeatingChartSheet(seatingSheet, students, rows, cols, seatingOrder)

  const signInSheet = workbook.addWorksheet('Sign-In Sheet')
  addSignInSheet(signInSheet, students)

  const gradeBookSheet = workbook.addWorksheet('Grade Book')
  addGradeBookSheet(gradeBookSheet, students)

  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

function addRosterSheet(sheet, students) {
  sheet.columns = [
    { header: 'Last Name', key: 'lastName', width: 18 },
    { header: 'First Name', key: 'firstName', width: 18 },
    { header: 'Student ID', key: 'studentId', width: 14 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Status', key: 'status', width: 14 },
  ]

  applyHeader(sheet.getRow(1))

  students.forEach((student) => {
    sheet.addRow({
      lastName: student.sortable_name?.split(', ')[0] || '',
      firstName: student.sortable_name?.split(', ')[1] || '',
      studentId: student.id,
      email: student.email || '',
      status: student.enrollments?.[0]?.enrollment_state || '',
    })
  })

  applyStripes(sheet, 2, students.length + 1, 5)
  sheet.views = [{ state: 'frozen', ySplit: 1 }]
}

function addSeatingChartSheet(sheet, students, rows, cols, seatingOrder) {
  const ordered = seatingOrder || [...students].sort((a, b) =>
    (a.sortable_name || '').localeCompare(b.sortable_name || '')
  )

  // No column headers — the whole sheet is the visual grid
  for (let c = 1; c <= cols; c++) {
    sheet.getColumn(c).width = 18
  }

  const deskFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CREAM } }
  const deskBorder = {
    top: { style: 'medium', color: { argb: NAVY } },
    left: { style: 'medium', color: { argb: NAVY } },
    bottom: { style: 'medium', color: { argb: NAVY } },
    right: { style: 'medium', color: { argb: NAVY } },
  }
  const deskFont = { size: 10, color: { argb: 'FF333333' } }
  const deskAlign = { horizontal: 'center', vertical: 'middle', wrapText: true }

  // Title row
  const titleRow = sheet.getRow(1)
  titleRow.getCell(1).value = 'SEATING CHART'
  titleRow.getCell(1).font = { bold: true, size: 14, color: { argb: NAVY } }
  titleRow.height = 30

  // Build desk grid starting at row 3
  let studentIndex = 0
  for (let r = 0; r < rows; r++) {
    const excelRow = sheet.getRow(r * 2 + 3) // double-spaced rows for square look
    excelRow.height = 50 // tall rows = square cells

    // Spacer row between desk rows
    if (r < rows - 1) {
      sheet.getRow(r * 2 + 4).height = 12
    }

    for (let c = 0; c < cols; c++) {
      const cell = excelRow.getCell(c + 1)
      if (studentIndex < ordered.length) {
        cell.value = ordered[studentIndex].name || ''
        studentIndex++
      } else {
        cell.value = ''
      }
      cell.fill = deskFill
      cell.border = deskBorder
      cell.font = deskFont
      cell.alignment = deskAlign
    }
  }

  // Label at bottom
  const footerRowNum = rows * 2 + 4
  const footerRow = sheet.getRow(footerRowNum)
  footerRow.getCell(1).value = 'FRONT OF ROOM'
  footerRow.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF999999' } }
  footerRow.getCell(1).alignment = { horizontal: 'center' }
  if (cols > 1) {
    sheet.mergeCells(footerRowNum, 1, footerRowNum, cols)
  }
}

function addSignInSheet(sheet, students) {
  const sorted = [...students].sort((a, b) =>
    (a.sortable_name || '').localeCompare(b.sortable_name || '')
  )

  const headers = ['Student Name']
  const startDate = new Date()
  let weekdayCount = 0
  let offset = 0
  while (weekdayCount < 10) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + offset)
    const day = date.getDay()
    if (day !== 0 && day !== 6) {
      headers.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
      weekdayCount++
    }
    offset++
  }

  sheet.columns = headers.map((h, i) => ({
    header: h,
    key: `col${i}`,
    width: i === 0 ? 22 : 14,
  }))

  applyHeader(sheet.getRow(1))

  sorted.forEach((student) => {
    const row = sheet.addRow({ col0: student.name })
    row.height = 24
  })

  applyStripes(sheet, 2, sorted.length + 1, headers.length)
  sheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 1 }]
}

function addGradeBookSheet(sheet, students) {
  const sorted = [...students].sort((a, b) =>
    (a.sortable_name || '').localeCompare(b.sortable_name || '')
  )

  const headers = ['Student Name', ...Array.from({ length: 10 }, (_, i) => `Assignment ${i + 1}`)]

  sheet.columns = headers.map((h, i) => ({
    header: h,
    key: h,
    width: i === 0 ? 22 : 14,
  }))

  applyHeader(sheet.getRow(1))

  sorted.forEach((student) => {
    const row = sheet.addRow({ 'Student Name': student.name })
    row.height = 24
  })

  applyStripes(sheet, 2, sorted.length + 1, headers.length)
  sheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 1 }]
}
