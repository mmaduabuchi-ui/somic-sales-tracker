import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function MarketerSummary() {
  const [trips, setTrips] = useState([])
  const [marketerEmail, setMarketerEmail] = useState('')
  const [totalBags, setTotalBags] = useState(0)

  useEffect(() => {
    const fetchSummary = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) {
        alert('Not logged in')
        return
      }

      const email = user.email
      setMarketerEmail(email)

      const today = new Date().toISOString().slice(0, 10)
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('marketer_email', email)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)

      if (error) {
        console.error('Error fetching trips:', error.message)
      } else {
        setTrips(data)
        const total = data.reduce((sum, trip) => sum + trip.quantity, 0)
        setTotalBags(total)
      }
    }

    fetchSummary()
  }, [])

  const pricePerBag = 210
  const totalAmount = totalBags * pricePerBag

  return (
    <div style={{ padding: 20 }}>
      <h2>{marketerEmail}'s Trip Summary (Today)</h2>
      <p>Total Trips: {trips.length}</p>
      <p>Total Bags: {totalBags}</p>
      <p>Total Amount: ₦{totalAmount.toLocaleString()}</p>

      <h3>Trip Breakdown</h3>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            {new Date(trip.created_at).toLocaleTimeString()} — {trip.quantity} bags
          </li>
        ))}
      </ul>
    </div>
  )
}