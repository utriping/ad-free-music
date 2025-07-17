import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://biviihxkwevconchhbtv.supabase.co"; //
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdmlpaHhrd2V2Y29uY2hoYnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDc2NTMsImV4cCI6MjA2NzQ4MzY1M30.2chp2V_64tmKQnvvcTRSVUSiNMWDaeOHSzI2KG77fMY"; // 🔁 Replace this
const supabase = createClient(supabaseUrl, supabaseKey);

// async function fetchSongs() {
//   const { data, error } = await supabase.storage
//     .from("songs") // Your bucket name
//     .list("", {
//       // 👈 This targets the "public" folder inside the bucket
//       search: "",
//     });

//   if (error) {
//     console.error("❌ Error listing songs:", error.message);
//     return;
//   }
//   console.log(data);

// async function debugListAll() {
//   const { data, error } = await supabase.storage.from("songs").list("", {
//     limit: 100,
//     offset: 0,
//   });

//   if (error) {
//     console.error("Error listing files:", error);
//   } else {
//     console.log("Files at root:", data);
//   }
// console.log(supabase);

//   const { data, err } = await supabase.storage.from("songs").list("", {
//     limit: 5,
//     offset: 0,
//     sortBy: { column: "name", order: "asc" },
//   });
//   if (err) console.log(err);
//   else console.log(data);

//   const { data: buckets } = await supabase.storage.listBuckets();
//   console.log("Available buckets:", buckets);

async function testSongsBucket() {
  try {
    const { data: files, error } = await supabase.storage
      .from("songs")
      .list("");

    console.log("Files in songs bucket:", files);
    console.log("Error:", error);
  } catch (err) {
    console.error("Test error:", err);
  }
}
// }

//   const songs = data.map((file) => ({
//     name: file.name,
//     url: supabase.storage.from("songs").getPublicUrl(`public/${file.name}`).data
//       .publicUrl,
//   }));

//   console.log("✅ Songs JSON:", songs);
//   return songs;
// }

// fetchSongs();
testSongsBucket();
