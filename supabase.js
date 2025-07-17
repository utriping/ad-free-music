
// supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://biviihxkwevconchhbtv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdmlpaHhrd2V2Y29uY2hoYnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDc2NTMsImV4cCI6MjA2NzQ4MzY1M30.2chp2V_64tmKQnvvcTRSVUSiNMWDaeOHSzI2KG77fMY"; // Only use anon key in frontend
export const supabase = createClient(supabaseUrl, supabaseKey);


