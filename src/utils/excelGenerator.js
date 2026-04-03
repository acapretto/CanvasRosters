import ExcelJS from 'exceljs'

const NAVY = 'FF141D37'
const PINK = 'FFEC5D82'
const ORANGE = 'FFFF8C42'
const CREAM = 'FFFAF7F0'

const headerStyle = {
  fill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: NAVY },
  },
  font: {
    bold: true,
    color: { argb: 'FFFFFFFF' },
    size: 12,
  },
  alignment: {
    horizontal: 'center',
    vertical: 'center',
    wrapText: true,
  },
  border: {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  },
}

const cellStyle = {
  border: {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  },
}

export async function generateRosterExcel(students, className, rows, cols) {
  const workbook = new ExcelJS.Workbook()

  // Sheet 1: Roster
  const rosterSheet = workbook.addWorksheet('Roster')
  addRosterSheet(rosterSheet, students)

  // Sheet 2: Seating Chart
  const seatingSheet = workbook.addWorksheet('Seating Chart')
  addSeatingChartSheet(seatingSheet, students, rows, cols)

  // Sheet 3: Sign-In Sheet
  const signInSheet = workbook.addWorksheet('Sign-In Sheet')
  addSignInSheet(signInSheet, students)

  // Sheet 4: Grade Book
  const gradeBookSheet = workbook.addWorksheet('Grade Book')
  addGradeBookSheet(gradeBookSheet, students)

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

function addRosterSheet(sheet, students) {
  sheet.columns = [
    { header: 'Last Name', key: 'lastName', width: 15 },
    { header: 'First Name', key: 'firstName', width: 15 },
    { header: 'Student ID', key: 'studentId', width: 12 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Enrollment Status', key: 'status', width: 15 },
  ]

  // Style header
  sheet.getRow(1).eachCell((cell) => {
    Object.assign(cell, headerStyle)
  })

  // Add data
  students.forEach((student) => {
    sheet.addRow({
      lastName: student.sortable_name?.split(', ')[0] || '',
      firstName: student.sortable_name?.split(', ')[1] || '',
      studentId: student.id,
      email: student.email || '',
      status: student.enrollments?.[0]?.enrollment_state || '',
    })
  })

  // Freeze header
  sheet.views = [{ state: 'frozen', ySplit: 1 }]
}

function addSeatingChartSheet(sheet, students, rows, cols) {
  // Sort students alphabetically
  const sorted = [...students].sort((a, b) =>
    (a.sortable_name || '').localeCompare(b.sortable_name || '')
  )

  sheet.columns = Array.from({ length: cols }, (_, i) => ({
    header: `Col ${i + 1}`,
    key: `col${i}`,
    width: 20,
  }))

  // Style header
  sheet.getRow(1).eachCell((cell) => {
    Object.assign(cell, headerStyle)
  })

  // Fill grid with student names
  let studentIndex = 0
  for (let r = 0; r < rows; r++) {
    const row = sheet.addRow()
    for (let c = 0; c < cols; c++) {
      if (studentIndex < sorted.length) {
        const cell = row.getCell(c + 1)
        cell.value = sorted[studentIndex].name
        Object.assign(cell, cellStyle)
        studentIndex++
      }
    }
  }
}

function addSignInSheet(sheet, students) {
  const sorted = [...students].sort((a, b) =>
    (a.sortable_name || '').localeCompare(b.sortable_name || '')
  )

  // Headers: Name + 10 weekdays (Mon–Fri only, skipping Sat/Sun)
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
    width: 12,
  }))

  // Style header
  sheet.getRow(1).eachCell((cell) => {
    Object.assign(cell, headerStyle)
  })

  // Add student names
  sorted.forEach((student) => {
    sheet.addRow({
      col0: student.name,
    })
  })

  // Freeze header + name column
  sheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 1 }]
}

function addGradeBookSheet(sheet, students) {
  const sorted = [...students].sort((a, b) =>
    (a.sortable_name || '').localeCompare(b.sortable_name || '')
  )

  // Columns: Name + 10 empty grade columns
  const headers = ['Student Name', ...Array.from({ length: 10 }, (_, i) => `Assignment ${i + 1}`)]

  sheet.columns = headers.map((h) => ({
    header: h,
    key: h,
    width: 15,
  }))

  // Style header
  sheet.getRow(1).eachCell((cell) => {
    Object.assign(cell, headerStyle)
  })

  // Add student names
  sorted.forEach((student) => {
    sheet.addRow({
      'Student Name': student.name,
    })
  })

  // Freeze header + name column
  sheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 1 }]
}
