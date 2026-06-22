const admin = require("./_lib/firebaseAdmin");

const {
  signInWithPassword,
  createSiteSessionFromIdToken,
  createLoginChallenge
} = require("./_lib/securityHelpers");

function getMaskedEmail(email) {
  if (!email || !email.includes("@")) {
    return "your email";
  }

  const parts = email.split("@");
  const name = parts[0];
  const domain = parts.slice(1).join("@");

  if (name.length <= 2) {
    return name.charAt(0) + "***@" + domain;
  }

  return name.charAt(0) + "***" + name.charAt(name.length - 1) + "@" + domain;
}

function getFirstName(fullName) {
  return String(fullName || "").trim().split(/\s+/)[0] || "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Please enter your email and password." });
    }

    const signInData = await signInWithPassword(String(email).trim(), String(password));
    const uid = signInData.localId;

    if (!uid || !signInData.idToken) {
      return res.status(400).json({ error: "Incorrect email or password." });
    }

    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    let userData = userDoc.exists ? userDoc.data() : {};

    if (!userDoc.exists) {
      userData = {
        fullName: "",
        phone: "",
        email: signInData.email || String(email).trim()
      };

      await userRef.set({
        ...userData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }

    const twoFactor = userData.twoFactor || {};
    const appEnabled = Boolean(twoFactor.appEnabled);
    const emailEnabled = Boolean(twoFactor.emailEnabled);

    if (appEnabled || emailEnabled) {
      await createLoginChallenge(uid, res, {
        email: signInData.email || userData.email || String(email).trim(),
        twoFactor: {
          appEnabled,
          emailEnabled
        }
      });

      return res.status(200).json({
        success: true,
        requiresTwoFactor: true,
        methods: {
          app: appEnabled,
          email: emailEnabled
        },
        maskedEmail: getMaskedEmail(signInData.email || userData.email || String(email).trim())
      });
    }

    await createSiteSessionFromIdToken(signInData.idToken, res);

    return res.status(200).json({
      success: true,
      requiresTwoFactor: false,
      user: {
        uid,
        email: signInData.email || userData.email || String(email).trim(),
        fullName: userData.fullName || "",
        firstName: getFirstName(userData.fullName || "")
      }
    });
  } catch (error) {
    return res.status(400).json({
      error: "Incorrect email or password."
    });
  }
};
