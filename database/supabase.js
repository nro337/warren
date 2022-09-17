import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://eabdenzxtwtdatgofbxn.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYmRlbnp4dHd0ZGF0Z29mYnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM0MjQwODAsImV4cCI6MTk3OTAwMDA4MH0.BQccwBCCT4LcXy0DxhN-2CjOUezcSRgM0pE0t4mxLbc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})