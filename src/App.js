import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './Login'
import TripForm from './TripForm'
import Dashboard from './Dashboard'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const isCEO = session?.user.email === 'oguchinanu.mmaduabuchi@gmail.com'

  return (
    <div>
      {!session ? (
        <Login />
      ) : (
        <div style={{ padding: 20 }}>
          <h2>Welcome: {session.user.email}</h2>
          {isCEO ? <Dashboard /> : <TripForm user={session.user} />}
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
        </div>
      )}
    </div>
  )
}

export default App