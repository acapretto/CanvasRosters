import CryptoJS from 'crypto-js'

const STORAGE_KEY = 'fbm_canvas_token'

export function saveToken(token, password = null) {
  if (!password) {
    // Save unencrypted (for this session only, will clear on refresh)
    sessionStorage.setItem('fbm_canvas_token_session', token)
    return
  }

  // Encrypt and save to localStorage
  const encrypted = CryptoJS.AES.encrypt(token, password).toString()
  localStorage.setItem(STORAGE_KEY, encrypted)
  localStorage.setItem('fbm_canvas_token_encrypted', 'true')
}

export function getToken(password = null) {
  // Check session storage first
  const sessionToken = sessionStorage.getItem('fbm_canvas_token_session')
  if (sessionToken) {
    return sessionToken
  }

  // Check localStorage
  const storedToken = localStorage.getItem(STORAGE_KEY)
  if (!storedToken) {
    return null
  }

  if (!password) {
    throw new Error('Token is encrypted. Please provide password.')
  }

  try {
    const decrypted = CryptoJS.AES.decrypt(storedToken, password).toString(CryptoJS.enc.Utf8)
    return decrypted
  } catch (error) {
    throw new Error('Incorrect password.')
  }
}

export function clearToken() {
  sessionStorage.removeItem('fbm_canvas_token_session')
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem('fbm_canvas_token_encrypted')
}

export function hasEncryptedToken() {
  return localStorage.getItem('fbm_canvas_token_encrypted') === 'true'
}
