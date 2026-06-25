function cleanString(value) {
  return String(value || "").trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const projectId = cleanString(process.env.FIREBASE_PROJECT_ID);
  const apiKey = cleanString(process.env.FIREBASE_WEB_API_KEY);
  const authDomain = cleanString(process.env.FIREBASE_AUTH_DOMAIN) || (projectId ? projectId + ".firebaseapp.com" : "");
  const appId = cleanString(process.env.FIREBASE_APP_ID);

  if (!projectId || !apiKey || !authDomain || !appId) {
    return res.status(500).json({ error: "Firebase client configuration is not complete." });
  }

  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");

  return res.status(200).json({
    firebase: {
      apiKey,
      authDomain,
      projectId,
      appId,
      storageBucket: cleanString(process.env.FIREBASE_STORAGE_BUCKET),
      messagingSenderId: cleanString(process.env.FIREBASE_MESSAGING_SENDER_ID),
      measurementId: cleanString(process.env.FIREBASE_MEASUREMENT_ID)
    }
  });
};
