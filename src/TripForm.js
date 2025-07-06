import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function TripForm() {
  const [quantity, setQuantity] = useState(80) // default per trip
  const [marketerEmail, setMarketerEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (user) {
        setMarketerEmail(user.email)
      } else {
        alert('Not logged in')
        window.location.href = '/'
      }
    }

    fetchUser()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('trips').insert([
      {
        marketer_email: marketerEmail,
        quantity: quantity,
        amount: quantity * 220
      }
    ])

    setLoading(false)

    if (error) {
      alert('Failed to save trip: ' + error.message)
    } else {
      alert('Trip saved successfully')
      // ✅ Redirect to trip summary
      window.location.href = '/marketer/summary'
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Log a New Trip</h2>
      <form onSubmit={handleSubmit}>
        <label>Quantity (bags): </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min={1}
          max={80}
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Submit Trip'}
        </button>
      </form>
    </div>
  )
}