import axios from 'axios'

const CANVAS_BASE_URL = 'https://canvas.instructure.com/api/v1'

export async function getClasses(token) {
  try {
    const response = await axios.get(`${CANVAS_BASE_URL}/courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        per_page: 100,
        enrollment_state: 'active',
      },
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid or expired Canvas token. Please check and try again.')
    }
    throw new Error(`Failed to fetch classes: ${error.message}`)
  }
}

export async function getStudents(token, courseId) {
  try {
    const response = await axios.get(`${CANVAS_BASE_URL}/courses/${courseId}/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        per_page: 100,
        include: ['enrollments'],
      },
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch students: ${error.message}`)
  }
}
