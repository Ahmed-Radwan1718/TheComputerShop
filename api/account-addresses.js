const admin = require("./_lib/firebaseAdmin");

const {
  getUserFromRequest
} = require("./_lib/securityHelpers");

const VALID_ADDRESS_TYPES = ["apartment", "house", "office"];

function cleanString(value) {
  return String(value || "").trim();
}

function cleanAddressType(value) {
  const addressType = cleanString(value);

  return VALID_ADDRESS_TYPES.includes(addressType) ? addressType : "apartment";
}

function cleanAddressId(value) {
  const addressId = cleanString(value);

  if (!addressId) {
    return "";
  }

  if (!/^[a-zA-Z0-9_-]{8,80}$/.test(addressId)) {
    return "";
  }

  return addressId;
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

function cleanAddressData(rawData) {
  const data = rawData || {};

  return {
    label: cleanString(data.label),
    addressType: cleanAddressType(data.addressType),
    buildingName: cleanString(data.buildingName),
    apartmentNumber: cleanString(data.apartmentNumber),
    floorNumber: cleanString(data.floorNumber),
    houseNumber: cleanString(data.houseNumber),
    officeName: cleanString(data.officeName),
    companyName: cleanString(data.companyName),
    streetName: cleanString(data.streetName),
    additionalInfo: cleanString(data.additionalInfo)
  };
}

function validateAddressData(addressData) {
  if (!addressData.label) {
    return "Please name this address.";
  }

  if (addressData.label.length > 80) {
    return "Address label must be 80 characters or less.";
  }

  if (!addressData.streetName) {
    return "Please enter the street name.";
  }

  if (addressData.streetName.length > 120) {
    return "Street name must be 120 characters or less.";
  }

  const textFields = [
    "buildingName",
    "apartmentNumber",
    "floorNumber",
    "houseNumber",
    "officeName",
    "companyName",
    "additionalInfo"
  ];

  for (const field of textFields) {
    if (addressData[field] && addressData[field].length > 160) {
      return "Address details must be 160 characters or less.";
    }
  }

  return "";
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
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
}

async function handleGet(req, res, uid) {
  const db = admin.firestore();

  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("addresses")
    .orderBy("updatedAt", "desc")
    .limit(50)
    .get();

  const addresses = snapshot.docs.map(serializeAddress);

  return res.status(200).json({
    success: true,
    addresses
  });
}

async function handlePost(req, res, uid) {
  const db = admin.firestore();
  const addressData = cleanAddressData(req.body || {});
  const validationError = validateAddressData(addressData);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const requestedAddressId = cleanAddressId((req.body || {}).addressId);
  const addressesRef = db.collection("users").doc(uid).collection("addresses");

  let addressRef;

  if (requestedAddressId) {
    addressRef = addressesRef.doc(requestedAddressId);

    const existingAddress = await addressRef.get();

    if (!existingAddress.exists) {
      return res.status(404).json({ error: "Address not found." });
    }

    await addressRef.set({
      ...addressData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } else {
    addressRef = addressesRef.doc();

    await addressRef.set({
      ...addressData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  const savedAddress = await addressRef.get();

  return res.status(200).json({
    success: true,
    address: serializeAddress(savedAddress)
  });
}

async function handleDelete(req, res, uid) {
  const db = admin.firestore();
  const addressId = cleanAddressId((req.body || {}).addressId);

  if (!addressId) {
    return res.status(400).json({ error: "Missing address id." });
  }

  const addressRef = db
    .collection("users")
    .doc(uid)
    .collection("addresses")
    .doc(addressId);

  const addressDoc = await addressRef.get();

  if (!addressDoc.exists) {
    return res.status(404).json({ error: "Address not found." });
  }

  await addressRef.delete();

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
    return res.status(error.statusCode || 401).json({
      error: error.message || "Please log in again."
    });
  }
};
