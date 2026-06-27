const admin = require("../_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("../_lib/securityHelpers");

const VALID_ADDRESS_TYPES = ["apartment", "house", "office"];

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanAddressId(value) {
  const addressId = cleanString(value, 120);

  if (!addressId || addressId.includes("/")) {
    return "";
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(addressId)) {
    return "";
  }

  return addressId;
}

function cleanAddressType(value) {
  const addressType = cleanString(value, 30);
  return VALID_ADDRESS_TYPES.includes(addressType) ? addressType : "apartment";
}

function serializeTimestamp(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function serializeAddress(addressDoc) {
  const data = addressDoc.data() || {};

  return {
    id: addressDoc.id,
    label: data.label || "",
    addressType: data.addressType || "apartment",
    buildingName: data.buildingName || "",
    apartmentNumber: data.apartmentNumber || "",
    floorNumber: data.floorNumber || "",
    houseNumber: data.houseNumber || "",
    officeName: data.officeName || "",
    companyName: data.companyName || "",
    streetName: data.streetName || "",
    additionalInfo: data.additionalInfo || "",
    isDefault: Boolean(data.isDefault),
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
}

function cleanAddressData(body) {
  return {
    label: cleanString(body.label, 80),
    addressType: cleanAddressType(body.addressType),
    buildingName: cleanString(body.buildingName, 80),
    apartmentNumber: cleanString(body.apartmentNumber, 40),
    floorNumber: cleanString(body.floorNumber, 40),
    houseNumber: cleanString(body.houseNumber, 40),
    officeName: cleanString(body.officeName, 80),
    companyName: cleanString(body.companyName, 80),
    streetName: cleanString(body.streetName, 120),
    additionalInfo: cleanString(body.additionalInfo, 500)
  };
}

async function handleGet(req, res, uid) {
  const snapshot = await admin.firestore()
    .collection("users")
    .doc(uid)
    .collection("addresses")
    .limit(50)
    .get();

  const addresses = snapshot.docs.map(serializeAddress).sort(function (first, second) {
    return Number(Boolean(second.isDefault)) - Number(Boolean(first.isDefault));
  });

  return res.status(200).json({
    success: true,
    addresses
  });
}

async function handlePost(req, res, uid) {
  const db = admin.firestore();
  const body = req.body || {};
  const addressId = cleanAddressId(body.id || body.addressId);
  const addressData = cleanAddressData(body);

  if (!addressData.label) {
    return res.status(400).json({ error: "Please enter an address label." });
  }

  const addressesRef = db.collection("users").doc(uid).collection("addresses");
  const addressRef = addressId ? addressesRef.doc(addressId) : addressesRef.doc();
  const existingDoc = await addressRef.get();
  const firstAddressSnapshot = existingDoc.exists ? null : await addressesRef.limit(1).get();
  const shouldMakeDefault = body.isDefault === true || body.isDefault === "true" || (firstAddressSnapshot && firstAddressSnapshot.empty);

  const saveData = {
    ...addressData,
    createdAt: existingDoc.exists
      ? existingDoc.data().createdAt || admin.firestore.FieldValue.serverTimestamp()
      : admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  if (shouldMakeDefault) {
    const batch = db.batch();
    const defaultSnapshot = await addressesRef.where("isDefault", "==", true).get();

    defaultSnapshot.docs.forEach(function (defaultDoc) {
      if (defaultDoc.id !== addressRef.id) {
        batch.set(defaultDoc.ref, {
          isDefault: false,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      }
    });

    batch.set(addressRef, {
      ...saveData,
      isDefault: true
    }, { merge: true });

    await batch.commit();
  } else {
    await addressRef.set(saveData, { merge: true });
  }

  const savedDoc = await addressRef.get();

  return res.status(200).json({
    success: true,
    address: serializeAddress(savedDoc)
  });
}

async function handleDelete(req, res, uid) {
  const addressId = cleanAddressId((req.body || {}).id || (req.body || {}).addressId || (req.query || {}).id);

  if (!addressId) {
    return res.status(400).json({ error: "Missing address id." });
  }

  const db = admin.firestore();
  const addressesRef = db.collection("users").doc(uid).collection("addresses");
  const addressRef = addressesRef.doc(addressId);
  const addressDoc = await addressRef.get();
  const wasDefault = Boolean(addressDoc.exists && addressDoc.data().isDefault);

  await addressRef.delete();

  if (wasDefault) {
    const nextAddressSnapshot = await addressesRef.limit(1).get();

    if (!nextAddressSnapshot.empty) {
      await nextAddressSnapshot.docs[0].ref.set({
        isDefault: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }
  }

  return res.status(200).json({
    success: true
  });
}

module.exports = async function handler(req, res) {
  try {
    const decodedUser = await getUserFromRequest(req, {
      checkRevoked: true,
      requireCompletedTwoFactor: true
    });

    if (req.method === "GET") {
      return await handleGet(req, res, decodedUser.uid);
    }

    if (req.method === "POST") {
      return await handlePost(req, res, decodedUser.uid);
    }

    if (req.method === "DELETE") {
      return await handleDelete(req, res, decodedUser.uid);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Could not process address request."
    });
  }
};
