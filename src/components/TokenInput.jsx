import { useState, useEffect } from 'react'
import { saveToken, getToken, hasEncryptedToken, clearToken } from '../utils/encryption'
import { getClasses } from '../utils/canvasApi'

const DOMAIN_KEY = 'fbm_canvas_domain'

export default function TokenInput({ onAuthenticated }) {
  const [domain, setDomain] = useState('')
  const [token, setToken] = useState('')
  const [saveLocally, setSaveLocally] = useState(false)
  const [password, setPassword] = useState('')
  const [unlockPassword, setUnlockPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [storedDomain, setStoredDomain] = useState(null)
  const [showManual, setShowManual] = useState(false)

  useEffect(() => {
    if (hasEncryptedToken()) {
      const d = localStorage.getItem(DOMAIN_KEY)
      if (d) setStoredDomain(d)
      else setShowManual(true)
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const cleanDomain = domain.trim()
    const cleanToken = token.trim()

    if (!cleanDomain) {
      setError('Please enter your Canvas domain (e.g. school.instructure.com).')
      return
    }
    if (!cleanToken) {
      setError('Please enter your Canvas API token.')
      return
    }
    if (saveLocally && !password) {
      setError('Enter a password to encrypt your saved token.')
      return
    }

    setLoading(true)
    try {
      const classes = await getClasses(cleanToken, cleanDomain)
      localStorage.setItem(DOMAIN_KEY, cleanDomain)
      saveToken(cleanToken, saveLocally ? password : null)
      onAuthenticated(cleanToken, cleanDomain, classes)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleUnlock(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const savedToken = getToken(unlockPassword)
      const savedDomain = storedDomain
      const classes = await getClasses(savedToken, savedDomain)
      onAuthenticated(savedToken, savedDomain, classes)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleForget() {
    clearToken()
    localStorage.removeItem(DOMAIN_KEY)
    setStoredDomain(null)
    setShowManual(false)
  }

  // Returning user with encrypted token
  if (storedDomain && !showManual) {
    return (
      <div className="step">
        <h2>Welcome Back</h2>
        <p>You have a saved token for <strong>{storedDomain}</strong>. Enter your password to continue.</p>
        <form onSubmit={handleUnlock}>
          <div className="form-group">
            <label className="form-label" htmlFor="unlock-password">Password</label>
            <input
              id="unlock-password"
              type="password"
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              placeholder="Enter your encryption password"
              disabled={loading}
              autoFocus
            />
          </div>
          {error && <div className="error-message" role="alert">{error}</div>}
          <div className="button-row">
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Connecting...' : 'Unlock & Continue'}
            </button>
            <button type="button" className="secondary" onClick={handleForget}>
              Use Different Token
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="step">
      <h2>Step 1: Connect to Canvas</h2>
      <p>Enter your Canvas domain and API token to fetch your class rosters.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="canvas-domain">Canvas Domain</label>
          <input
            id="canvas-domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="school.instructure.com"
            disabled={loading}
            autoFocus
          />
          <span className="form-hint">Your school's Canvas URL (without https://)</span>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="api-token">Canvas API Token</label>
          <input
            id="api-token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your Canvas API token here"
            disabled={loading}
          />
          <span className="form-hint">
            Generate at: Canvas → Account → Settings → New Access Token
          </span>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={saveLocally}
              onChange={(e) => setSaveLocally(e.target.checked)}
              disabled={loading}
            />
            Save token locally (encrypted)
          </label>
        </div>

        {saveLocally && (
          <div className="form-group">
            <label className="form-label" htmlFor="encrypt-password">Encryption Password</label>
            <input
              id="encrypt-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password to protect your token"
              disabled={loading}
            />
            <span className="form-hint">You'll need this to unlock next time. Do not forget it.</span>
          </div>
        )}

        {error && <div className="error-message" role="alert">{error}</div>}

        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Connecting to Canvas...' : 'Connect to Canvas'}
        </button>
      </form>

      <div className="privacy-note">
        Your token never leaves your browser. All Canvas API calls are made directly from your device.
      </div>
    </div>
  )
}
