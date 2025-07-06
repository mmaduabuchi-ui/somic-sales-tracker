import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function TripForm({ user }) {
  const [bags, setBags] = useState(80)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Get marketer ID from 'marketers' table
    const { data: marketerData, error: marketerError } = await supabase
      .from('marketers')
      .select('*')
      .eq('email', user.email)
      .single()

    if (marketerError || !marketerData) {
      alert('Marketer not found. Contact admin.')
      setLoading(false)
      return
    }

    // Save trip
    const { error } = await supabase.from('trips').insert({
      marketer_id: marketerData.id,
      bags_sold: bags,
    })

    if (error) {
      alert('Trip not saved: ' + error.message)
    } else {
      alert('Trip saved successfully')
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Log Trip</h2>
      <form onSubmit={handleSubmit}>
        <label>Bags Sold:</label>
        <input
          type="number"
          value={bags}
          onChange={(e) => setBags(Number(e.target.value))}
          min={1}
          max={80}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Submit Trip'}
        </button>
      </form>
    </div>
  )
}