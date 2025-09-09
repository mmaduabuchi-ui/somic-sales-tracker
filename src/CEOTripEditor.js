import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { CEO_EMAIL } from './constants'

export default function CEOTripEditor() {
  const [trips, setTrips] = useState([])
  const [editingTripId, setEditingTripId] = useState(null)
  const [newPaid, setNewPaid] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user || user.email !== CEO_EMAIL) {
        alert('Access denied')
        window.location.href = '/'
        return
      }

      setUserEmail(user.email)

      const { data, error: fetchError } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        alert('Failed to load trips: ' + fetchError.message)
      } else {
        setTrips(data)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert('Error logging out: ' + error.message)
    } else {
      window.location.href = '/' // redirect after logout
    }
  }

  const handleEdit = (trip) => {
    setEditingTripId(trip.id)
    setNewPaid(trip.paid)
  }

  const handleUpdate = async (tripId) => {
    const { error } = await supabase
      .from('trips')
      .update({ paid: Number(newPaid) })
      .eq('id', tripId)

    if (error) {
      alert('Failed to update: ' + error.message)
    } else {
      alert('Payment updated')
      setEditingTripId(null)
      setNewPaid('')
      window.location.reload()
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>CEO – Edit Trip Payments</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      
      <p><strong>Logged in as:</strong> {userEmail}</p>

      <table border="1" cellPadding={8} cellSpacing={0}>
        <thead>
          <tr>
            <th>Marketer</th>
            <th>Date</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Debt</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.marketer_email}</td>
              <td>{new Date(trip.created_at).toLocaleDateString()}</td>
              <td>{trip.quantity}</td>
              <td>₦{trip.amount}</td>
              <td>
                {editingTripId === trip.id ? (
                  <input
                    type="number"
                    value={newPaid}
                    onChange={(e) => setNewPaid(e.target.value)}
                  />
                ) : (
                  `₦${trip.paid}`
                )}
              </td>
              <td>₦{trip.amount - trip.paid}</td>
              <td>
                {editingTripId === trip.id ? (
                  <button onClick={() => handleUpdate(trip.id)}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(trip)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}