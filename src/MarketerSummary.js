import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { PRICE_PER_BAG } from './constants'

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

      const { data, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('marketer_email', email)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false })

      if (tripError) {
        console.error('Error fetching trips:', tripError.message)
      } else {
        setTrips(data)
      }

      setLoading(false)
    }

    fetchSummary()
  }, [])

  const totalBags = trips.reduce((sum, trip) => sum + trip.quantity, 0)
  const totalAmount = totalBags * PRICE_PER_BAG

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
                {new Date(trip.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                — {trip.quantity} bags (₦{trip.amount})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}