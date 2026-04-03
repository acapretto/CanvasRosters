import axios from 'axios'

const PROXY_URL = '/.netlify/functions/canvas-proxy'

async function proxyRequest(token, domain, path, params) {
  const response = await axios.post(PROXY_URL, { domain, token, path, params })
  return response.data
}

export async function getClasses(token, domain) {
  try {
    return await proxyRequest(token, domain, '/api/v1/courses', {
      per_page: 100,
      enrollment_state: 'active',
    })
  } catch (error) {
    const status = error.response?.status
    if (status === 401) throw new Error('Invalid or expired Canvas token. Please check and try again.')
    if (status === 404) throw new Error('Canvas domain not found. Check your institution URL.')
    if (!error.response) throw new Error('Network error. Check your internet connection or Canvas domain.')
    throw new Error(`Failed to fetch classes: ${error.message}`)
  }
}

export async function getStudents(token, courseId, domain) {
  try {
    return await proxyRequest(token, domain, `/api/v1/courses/${courseId}/students`, {
      per_page: 200,
      include: ['enrollments'],
    })
  } catch (error) {
    const status = error.response?.status
    if (status === 401) throw new Error('Canvas token expired. Please re-authenticate.')
    if (status === 404) throw new Error('Class not found.')
    throw new Error(`Failed to fetch students: ${error.message}`)
  }
}
