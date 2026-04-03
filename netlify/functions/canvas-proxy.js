// Serverless proxy for Canvas API — eliminates CORS risk from browser requests
// Receives POST { domain, token, path, params } and forwards to Canvas server-side

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: 'Invalid JSON body' }
  }

  const { domain, token, path, params } = body

  if (!domain || !token || !path) {
    return { statusCode: 400, body: 'Missing required fields: domain, token, path' }
  }

  // Sanitize domain — strip protocol and trailing slash
  const clean = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')

  // Only allow calls to /api/v1/* paths
  if (!path.startsWith('/api/v1/')) {
    return { statusCode: 403, body: 'Only /api/v1/* paths are allowed' }
  }

  const url = new URL(`https://${clean}${path}`)

  // Append query params, handling array values (e.g. include[]=enrollments)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(`${key}[]`, v))
      } else {
        url.searchParams.set(key, String(value))
      }
    })
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    const text = await response.text()

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: text,
    }
  } catch (error) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Proxy request failed: ${error.message}` }),
    }
  }
}
