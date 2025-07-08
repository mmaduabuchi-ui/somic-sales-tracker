import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { Link } from 'react-router-dom'
import { CEO_EMAIL } from './constants'

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user || user.email !== CEO_EMAIL) {
        alert('Access denied')
        window.location.href = '/'
      } else {
        setUserEmail(user.email)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert('Logout failed: ' + error.message)
    } else {
      alert('Logged out')
      window.location.href = '/'
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>CEO Dashboard</h2>
      <p><strong>Welcome:</strong> {userEmail}</p>

      <button onClick={handleLogout} style={{ marginBottom: 20 }}>
        Logout
      </button>

      <div style={{ marginTop: 30 }}>
        <h3>CEO Tools</h3>
        <ul>
          <li>
            <Link to="/ceo/edit-trips">Edit Trips & Payments</Link>
          </li>
          {/* You can add more CEO tools here later */}
        </ul>
      </div>
    </div>
  )
}