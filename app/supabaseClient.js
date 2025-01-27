// app/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-public-api-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;