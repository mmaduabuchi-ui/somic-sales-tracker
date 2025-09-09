import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dokoumwxepmywonoshoy.supabase.co' // 🔁 Replace with your real URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRva291bXd4ZXBteXdvbm9zaG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MTA0NTYsImV4cCI6MjA2NzM4NjQ1Nn0.EBCcYKmrrR7YYAEFCM7jPl4t4UueFCtC9GdKWdhCj8s' // 🔁 Replace with your anon public key

export const supabase = createClient(supabaseUrl, supabaseKey)
