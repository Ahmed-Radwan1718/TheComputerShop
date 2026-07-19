const admin = require("firebase-admin");

if (!admin.apps.length) {
  const firebaseOptions = {
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  };

  if (process.env.FIREBASE_DATABASE_URL) {
    firebaseOptions.databaseURL = process.env.FIREBASE_DATABASE_URL;
  }

  admin.initializeApp(firebaseOptions);
}

module.exports = admin;
