import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

import Login from './Login'
import TripForm from './TripForm'
import MarketerSummary from './MarketerSummary'
import Dashboard from './Dashboard' // CEO Dashboard
import CEOTripEditor from './CEOTripEditor'
import { CEO_EMAIL } from './constants'

export default function App() {
  const [session, setSession] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error fetching session:', error.message)
      } else {
        setSession(data.session)
      }
      setCheckingAuth(false)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  if (checkingAuth) {
    return <p>Loading...</p>
  }

  const userEmail = session?.user?.email

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Marketer Routes */}
        <Route
          path="/marketer/trip"
          element={
            userEmail && userEmail !== CEO_EMAIL ? <TripForm /> : <Navigate to="/" />
          }
        />
        <Route
          path="/marketer/summary"
          element={
            userEmail && userEmail !== CEO_EMAIL ? <MarketerSummary /> : <Navigate to="/" />
          }
        />

        {/* CEO Routes */}
        <Route
          path="/ceo/dashboard"
          element={
            userEmail === CEO_EMAIL ? <Dashboard /> : <Navigate to="/" />
          }
        />
        <Route
          path="/ceo/edit-trips"
          element={
            userEmail === CEO_EMAIL ? <CEOTripEditor /> : <Navigate to="/" />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}