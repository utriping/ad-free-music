const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

// 🛠️ Supabase Setup
const SUPABASE_URL = "https://biviihxkwevconchhbtv.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdmlpaHhrd2V2Y29uY2hoYnR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkwNzY1MywiZXhwIjoyMDY3NDgzNjUzfQ.pSw-zQ7QGAoarCJ7ib8HfuWTV-LIj_AdNT4F1S8YJ90";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// 📁 Create downloads folder if not present
const DOWNLOAD_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

// Paths
const YT_DLP_PATH = path.join(
  "C:",
  "Users",
  "anmol",
  "AppData",
  "Roaming",
  "Python",
  "Python311",
  "Scripts",
  "yt-dlp.exe"
);

const FFMPEG_DIR = "C:\\tools\\ffmpeg\\ffmpeg-7.1.1-essentials_build\\bin";

// 🎵 Route to download and upload MP3
app.post("/api/extract", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  console.log(`Downloading from: ${url}`);

  const command = `"${YT_DLP_PATH}" -x --audio-format mp3 --ffmpeg-location "${FFMPEG_DIR}" -o "${path.join(
    DOWNLOAD_DIR,
    "%(title)s.%(ext)s"
  )}" "${url}"`;

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error("yt-dlp stderr:", stderr);
      console.error("yt-dlp stdout:", stdout);
      return res.status(500).json({ error: "Download failed" });
    }

    const files = fs
      .readdirSync(DOWNLOAD_DIR)
      .filter((f) => f.endsWith(".mp3"));
    if (files.length === 0)
      return res.status(500).json({ error: "MP3 not found" });

    const latestFile = files.reduce((a, b) =>
      fs.statSync(path.join(DOWNLOAD_DIR, a)).mtime >
      fs.statSync(path.join(DOWNLOAD_DIR, b)).mtime
        ? a
        : b
    );

    const fullLocalPath = path.join(DOWNLOAD_DIR, latestFile);
    const fileBuffer = fs.readFileSync(fullLocalPath);

    try {
      const { data, error: uploadError } = await supabase.storage
        .from("songs") // ✅ updated bucket name
        .upload(`public/${latestFile}`, fileBuffer, {
          contentType: "audio/mpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error(uploadError);
        return res.status(500).json({ error: "Upload to Supabase failed" });
      }

      const { data: publicUrlData } = supabase.storage
        .from("songs")
        .getPublicUrl(`public/${latestFile}`);

      fs.unlinkSync(fullLocalPath); // Optional: delete after upload

      return res.json({ url: publicUrlData.publicUrl });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
