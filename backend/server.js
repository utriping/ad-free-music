// const express = require("express");
// const cors = require("cors");
// const { exec } = require("child_process");
// const path = require("path");
// const fs = require("fs");
// const { createClient } = require("@supabase/supabase-js");

// // 🛠️ Supabase Setup
// const SUPABASE_URL = "https://biviihxkwevconchhbtv.supabase.co";
// const SUPABASE_SERVICE_ROLE_KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdmlpaHhrd2V2Y29uY2hoYnR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkwNzY1MywiZXhwIjoyMDY3NDgzNjUzfQ.pSw-zQ7QGAoarCJ7ib8HfuWTV-LIj_AdNT4F1S8YJ90";

// const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// const app = express();
// app.use(cors());
// app.use(express.json());

// // 📁 Create downloads folder if not present
// const DOWNLOAD_DIR = path.join(__dirname, "downloads");
// if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

// // Paths
// const YT_DLP_PATH = path.join(
//   "C:",
//   "Users",
//   "anmol",
//   "AppData",
//   "Roaming",
//   "Python",
//   "Python311",
//   "Scripts",
//   "yt-dlp.exe"
// );

// const FFMPEG_DIR = "C:\\tools\\ffmpeg\\ffmpeg-7.1.1-essentials_build\\bin";

// // 🎵 Route to download and upload MP3
// app.post("/api/extract", async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: "URL is required" });

//   console.log(`Downloading from: ${url}`);

//   const command = `"${YT_DLP_PATH}" -x --audio-format mp3 --ffmpeg-location "${FFMPEG_DIR}" -o "${path.join(
//     DOWNLOAD_DIR,
//     "%(title)s.%(ext)s"
//   )}" "${url}"`;

//   exec(command, async (error, stdout, stderr) => {
//     if (error) {
//       console.error("yt-dlp stderr:", stderr);
//       console.error("yt-dlp stdout:", stdout);
//       return res.status(500).json({ error: "Download failed" });
//     }

//     const files = fs
//       .readdirSync(DOWNLOAD_DIR)
//       .filter((f) => f.endsWith(".mp3"));
//     if (files.length === 0)
//       return res.status(500).json({ error: "MP3 not found" });

//     const latestFile = files.reduce((a, b) =>
//       fs.statSync(path.join(DOWNLOAD_DIR, a)).mtime >
//       fs.statSync(path.join(DOWNLOAD_DIR, b)).mtime
//         ? a
//         : b
//     );

//     const fullLocalPath = path.join(DOWNLOAD_DIR, latestFile);
//     const fileBuffer = fs.readFileSync(fullLocalPath);

//     try {
//       const { data, error: uploadError } = await supabase.storage
//         .from("songs") // ✅ updated bucket name
//         .upload(`public/${latestFile}`, fileBuffer, {
//           contentType: "audio/mpeg",
//           upsert: true,
//         });

//       if (uploadError) {
//         console.error(uploadError);
//         return res.status(500).json({ error: "Upload to Supabase failed" });
//       }

//       const { data: publicUrlData } = supabase.storage
//         .from("songs")
//         .getPublicUrl(`public/${latestFile}`);

//       fs.unlinkSync(fullLocalPath); // Optional: delete after upload

//       return res.json({ url: publicUrlData.publicUrl });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ error: "Upload failed" });
//     }
//   });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// );

const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
// 🛠️ Supabase Setup with Environment Variables
const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://biviihxkwevconchhbtv.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdmlpaHhrd2V2Y29uY2hoYnR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkwNzY1MywiZXhwIjoyMDY3NDgzNjUzfQ.pSw-zQ7QGAoarCJ7ib8HfuWTV-LIj_AdNT4F1S8YJ90";

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY is required");
  console.error(
    "Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables"
  );
  console.error("You can find it in your Supabase Dashboard > Settings > API");
  process.exit(1);
}

// Create Supabase clients:
// Service role key has admin privileges and can:
// 1. Verify any user's JWT token (bypasses RLS)
// 2. Perform admin operations like storage uploads
// 3. Access all data regardless of RLS policies
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Main client for token verification and general operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const app = express();
app.use(cors());

app.use(express.json());

// 🔐 Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    // Verify the token with Supabase using service role key
    // Create a temporary client with the user's token to verify it
    // The service role key allows us to verify any user's token
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      console.error("Token verification error:", error);
      return res.status(403).json({
        error: "Invalid or expired token",
        details: error.message,
      });
    }

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ error: "Authentication failed" });
  }
};

// 📁 Create downloads folder if not present
const DOWNLOAD_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

// 🔧 Sanitize filename for Supabase storage
// Supabase storage keys cannot contain spaces, parentheses, brackets, and other special chars
// Allowed characters: alphanumeric, hyphens, underscores, periods
const sanitizeKey = (filename) => {
  if (!filename) return "unnamed.mp3";

  // Step 1: Replace spaces with underscores
  let sanitized = filename.replace(/\s+/g, "_");

  // Step 2: Remove brackets, parentheses, braces, quotes, and other problematic chars
  sanitized = sanitized
    .replace(/[()[\]{}<>]/g, "") // remove brackets, parentheses, braces
    .replace(/['"^`]/g, "") // remove quotes and other odd chars
    .replace(/[^a-zA-Z0-9._-]/g, "_"); // replace any remaining invalid chars with underscore

  // Step 3: Clean up multiple underscores
  sanitized = sanitized.replace(/_{2,}/g, "_");

  // Step 4: Remove leading/trailing underscores, periods, or hyphens
  sanitized = sanitized.replace(/^[._-]+|[._-]+$/g, "");

  // Step 5: Ensure it doesn't start with a period or hyphen (invalid in some systems)
  sanitized = sanitized.replace(/^[.-]+/, "");

  // Step 6: Limit length (Supabase storage keys have length limits)
  if (sanitized.length > 255) {
    const ext = path.extname(sanitized);
    const nameWithoutExt = sanitized.slice(0, 255 - ext.length);
    sanitized = nameWithoutExt + ext;
  }

  // Step 7: Ensure we have a valid filename
  if (!sanitized || sanitized.length === 0) {
    sanitized = "unnamed.mp3";
  }

  return sanitized;
};

// 🔧 Platform-aware paths
const getYtDlpPath = () => {
  if (process.platform === "win32") {
    // Windows (for local development)
    return path.join(
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
  } else {
    // Linux/Unix (for deployment)
    return "yt-dlp"; // Assumes it's in PATH
  }
};

const getFfmpegPath = () => {
  if (process.platform === "win32") {
    // Windows
    return "C:\\tools\\ffmpeg\\ffmpeg-7.1.1-essentials_build\\bin";
  } else {
    // Linux/Unix
    return "/usr/bin"; // Common path, or just use "ffmpeg" if in PATH
  }
};

// 🔐 Auth Routes
app.post("/api/auth/verify", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        error: "Invalid token",
        details: error.message,
      });
    }

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({ user, valid: true });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});
app.post("/api/create-playlist", authenticateToken, async (req, res) => {
  //get user id
  //get the name and songs from req.body
  //copy selected songs data from the songs/public/userId/Downloads into the folder
  //store the data in songs/public/userId/{playlistName}
  /*req.body={
    name:PlayList1,
    songs:[
    {
      name:
      fileName:
      url:
      id:
    }
  ]
  }*/
  try {
    const userId = req.user.id;
    const { name: playlistName, songs: songsData } = req.body;
    if (!playlistName || !Array.isArray(songsData) || songsData.length == 0)
      return res.status(400).json({
        message:
          "Insufficient data from the user, songs name missing or playlist name missing ",
      });
    const songsPath = `public/${userId}/${playlistName}/${playlistName}.json`;
    const { error } = await supabaseAdmin.storage.from("songs").upload(
      songsPath,
      JSON.stringify({
        name: playlistName,
        songs: songsData,
        createdAt: new Date().toISOString(),
      }),
      {
        contentType: "application/json",
        upsert: true,
      }
    );
    if (error) {
      throw err;
    }
    return res
      .status(201)
      .json({ message: "Playlist was created successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "There was some problem while creating the sever" });
  }
});
// 🎵 Route to download and upload MP3 (Protected)
app.post("/api/extract", authenticateToken, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  console.log(`Downloading from: ${url}`);

  const ytDlpPath = getYtDlpPath();
  const ffmpegPath = getFfmpegPath();

  // Build command based on platform
  const command =
    process.platform === "win32"
      ? `"${ytDlpPath}" -x --audio-format mp3 --ffmpeg-location "${ffmpegPath}" -o "${path.join(
          DOWNLOAD_DIR,
          "%(title)s.%(ext)s"
        )}" "${url}"`
      : `${ytDlpPath} -x --audio-format mp3 --ffmpeg-location ${ffmpegPath} -o "${path.join(
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
      // Use admin client for storage operations
      // Store files in user-specific folders: public/{userId}/{filename}
      const userId = req.user.id;
      const timestamp = Date.now();

      // Sanitize the filename to remove invalid characters for Supabase storage
      const safe = sanitizeKey(latestFile);

      // Ensure userId doesn't have invalid chars (shouldn't, but just in case)
      const safeUserId = userId.replace(/[^a-zA-Z0-9._-]/g, "");

      const uploadedFileName = `public/${safeUserId}/Downloads/${timestamp}-${safe}`;

      // Debug logging
      console.log(`📤 Upload attempt:`);
      console.log(`   Original: ${latestFile}`);
      console.log(`   Sanitized: ${safe}`);
      console.log(`   User ID: ${userId}`);
      console.log(`   Full path: ${uploadedFileName}`);

      const { data, error: uploadError } = await supabaseAdmin.storage
        .from("songs")
        .upload(uploadedFileName, fileBuffer, {
          contentType: "audio/mpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        console.error("Attempted upload path:", uploadedFileName);
        return res.status(500).json({
          error: "Upload to Supabase failed",
          details: uploadError.message || "Unknown error",
        });
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("songs")
        .getPublicUrl(uploadedFileName);

      // Clean up local file (only if it exists)
      try {
        if (fs.existsSync(fullLocalPath)) {
          fs.unlinkSync(fullLocalPath);
          console.log(`✅ Cleaned up local file: ${latestFile}`);
        }
      } catch (unlinkError) {
        // Log but don't fail the request if cleanup fails
        console.warn(`⚠️ Could not delete local file: ${unlinkError.message}`);
      }

      return res.json({ url: publicUrlData.publicUrl });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
});

// 🏥 Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 🔐 User info endpoint (Protected)
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        created_at: req.user.created_at,
      },
    });
  } catch (err) {
    console.error("User info error:", err);
    res.status(500).json({ error: "Failed to get user info" });
  }
});

// 📥 Get user's downloads endpoint (Protected)
app.get("/api/downloads", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userFolder = `public/${userId}/Downloads`;

    // List files in the user-specific folder
    const { data, error: listError } = await supabaseAdmin.storage
      .from("songs")
      .list(userFolder, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "desc" },
      });

    if (listError) {
      // If user folder doesn't exist yet, return empty array
      if (
        listError.message?.includes("not found") ||
        listError.statusCode === "404"
      ) {
        return res.json({ downloads: [] });
      }
      throw listError;
    }

    if (!data || data.length === 0) {
      return res.json({ downloads: [] });
    }

    // Get URLs for each file
    const downloads = data
      .filter((file) => file.name && !file.name.endsWith(".part"))
      .map((file) => {
        const { data: urlData } = supabaseAdmin.storage
          .from("songs")
          .getPublicUrl(`${userFolder}/${file.name}`);

        // Extract original filename (remove timestamp prefix)
        const originalName = file.name
          .replace(/^\d+-/, "")
          .replace(/\.mp3$/, "");

        return {
          name: originalName,
          fileName: file.name,
          url: urlData.publicUrl,
          created_at: file.created_at,
          updated_at: file.updated_at,
        };
      });

    res.status(200).json({ downloads });
  } catch (err) {
    console.error("Downloads fetch error:", err);
    res.status(500).json({ error: "Failed to fetch downloads" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
