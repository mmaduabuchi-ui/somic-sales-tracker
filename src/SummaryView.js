import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function SummaryView({ type = 'daily' }) {
  const [data, setData] = useState([])

  const viewName = {
    daily: 'daily_summary',
    weekly: 'weekly_summary',
    monthly: 'monthly_summary'
  }[type]

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from(viewName).select('*')
      if (error) {
        alert('Error: ' + error.message)
      } else {
        setData(data)
      }
    }

    fetchData()
  }, [viewName])

  return (
    <div style={{ padding: 20 }}>
      <h3>{type.toUpperCase()} Summary</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Marketer</th>
            <th>{type === 'monthly' ? 'Month' : type === 'weekly' ? 'Week' : 'Day'}</th>
            <th>Bags Sold</th>
            <th>Amount (₦)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.marketer}</td>
              <td>{row.day || row.week_start || row.month}</td>
              <td>{row.total_bags}</td>
              <td>₦{row.total_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}