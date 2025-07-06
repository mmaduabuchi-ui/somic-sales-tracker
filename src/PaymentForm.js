import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function PaymentForm() {
  const [marketers, setMarketers] = useState([])
  const [selectedMarketer, setSelectedMarketer] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    fetchMarketers()
  }, [])

  const fetchMarketers = async () => {
    const { data, error } = await supabase.from('marketers').select('*')
    if (error) {
      alert('Error loading marketers')
    } else {
      setMarketers(data)
    }
  }

  const submitPayment = async (e) => {
    e.preventDefault()
    if (!selectedMarketer || !amount) return alert('Fill all fields')

    const { error } = await supabase.from('payments').insert({
      marketer_id: selectedMarketer,
      amount: parseFloat(amount)
    })

    if (error) {
      alert('Error saving payment: ' + error.message)
    } else {
      alert('✅ Payment logged!')
      setAmount('')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>💰 Log Payment</h2>
      <form onSubmit={submitPayment}>
        <label>Select Marketer:</label><br />
        <select value={selectedMarketer} onChange={e => setSelectedMarketer(e.target.value)}>
          <option value="">-- Select --</option>
          {marketers.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select><br /><br />

        <label>Amount Paid (₦):</label><br />
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
        /><br /><br />

        <button type="submit">Save Payment</button>
      </form>
    </div>
  )
}