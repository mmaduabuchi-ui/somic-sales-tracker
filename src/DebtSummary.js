import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function DebtSummary() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchDebt = async () => {
      const { data, error } = await supabase.from('marketer_debt_summary').select('*')
      if (error) {
        alert('Error loading debt summary: ' + error.message)
      } else {
        setData(data)
      }
    }

    fetchDebt()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Marketer Debt Summary</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Marketer</th>
            <th>Total Sales (₦)</th>
            <th>Total Paid (₦)</th>
            <th>Outstanding Debt (₦)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.marketer}</td>
              <td>₦{row.total_sales}</td>
              <td>₦{row.total_paid}</td>
              <td style={{ color: 'red' }}>₦{row.debt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}