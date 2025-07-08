import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { CEO_EMAIL } from './constants'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ Check if already logged in, and redirect
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        if (user.email === CEO_EMAIL) {
          window.location.href = '/ceo/dashboard'
        } else {
          window.location.href = '/marketer/trip'
        }
      }
    }

    checkUser()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({ email })

    setLoading(false)

    if (error) {
      alert('Login failed: ' + error.message)
    } else {
      alert('Magic link sent! Check your email.')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>
    </div>
  )
}