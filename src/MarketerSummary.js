// src/MarketerSummary.js
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function MarketerSummary() {
  const [trips, setTrips] = useState([])
  const [marketerEmail, setMarketerEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        alert('Not logged in')
        window.location.href = '/'
        return
      }

      const email = user.email
      setMarketerEmail(email)

      const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

      // ✅ Query the view instead of raw trips
      const { data, error: tripError } = await supabase
        .from('trip_with_amount')
        .select('*')
        .eq('marketer_id', user.id) // assuming marketer_id matches Supabase user.id
        .gte('trip_date', today)
        .lte('trip_date', today)
        .order('trip_date', { ascending: false })

      if (tripError) {
        console.error('Error fetching trips:', tripError.message)
      } else {
        setTrips(data)
      }

      setLoading(false)
    }

    fetchSummary()
  }, [])

  // ✅ Use DB-calculated fields directly
  const totalBags = trips.reduce((sum, trip) => sum + trip.bags_sold, 0)
  const totalAmount = trips.reduce((sum, trip) => sum + trip.amount, 0)

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
      <h2>Today's Trip Summary</h2>

      <button onClick={handleLogout} style={{ marginBottom: 10 }}>
        Logout
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p><strong>Marketer:</strong> {marketerEmail}</p>
          <p><strong>Total Trips:</strong> {trips.length}</p>
          <p><strong>Total Bags:</strong> {totalBags}</p>
          <p><strong>Total Amount:</strong> ₦{totalAmount.toLocaleString()}</p>

          <h3>Trip Breakdown</h3>
          <ul>
            {trips.map((trip) => (
              <li key={trip.id}>
                {trip.trip_date} — {trip.bags_sold} bags (₦{trip.amount.toLocaleString()})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}