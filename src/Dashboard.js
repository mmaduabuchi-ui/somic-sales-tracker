import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import SummaryView from './SummaryView'
import PaymentForm from './PaymentForm'
import DebtSummary from './DebtSummary'

export default function Dashboard() {
  const [trips, setTrips] = useState([])

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('id, bags_sold, amount, trip_date, marketers(name)')
      .order('trip_date', { ascending: false })

    if (error) {
      alert('Error fetching trips: ' + error.message)
    } else {
      setTrips(data)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🧾 CEO Dashboard – All Sales</h2>

      {/* Trip Table */}
      <table border="1" cellPadding="8" style={{ marginBottom: 30 }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Marketer</th>
            <th>Bags Sold</th>
            <th>Amount (₦)</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.trip_date}</td>
              <td>{trip.marketers?.name || 'Unknown'}</td>
              <td>{trip.bags_sold}</td>
              <td>₦{trip.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sales Summaries */}
      <SummaryView type="daily" />
      <SummaryView type="weekly" />
      <SummaryView type="monthly" />

      {/* Payment Form */}
      <PaymentForm />

      {/* Debt Summary */}
      <DebtSummary />
    </div>
  )
}