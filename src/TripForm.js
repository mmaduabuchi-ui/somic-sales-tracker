import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { CEO_EMAIL, PRICE_PER_BAG } from './constants'

export default function TripForm() {
  const [quantity, setQuantity] = useState(80)
  const [marketerEmail, setMarketerEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        alert('Not logged in')
        window.location.href = '/'
        return
      }

      // 🚫 Block CEO from accessing this page
      if (user.email === CEO_EMAIL) {
        alert('CEO is not allowed to log trips')
        window.location.href = '/ceo/dashboard'
        return
      }

      setMarketerEmail(user.email)
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
        amount: quantity * PRICE_PER_BAG, // ✅ Auto-calculate amount
        paid: 0                            // ✅ Marketers can't log payment
      },
    ])

    setLoading(false)

    if (error) {
      alert('Failed to save trip: ' + error.message)
    } else {
      alert('Trip saved successfully')
      window.location.href = '/marketer/summary'
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Log a New Trip</h2>
      <form onSubmit={handleSubmit}>
        <label>Quantity (bags):</label>
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