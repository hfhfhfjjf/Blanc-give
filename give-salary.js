const admin = require("firebase-admin");

// 1. Service Account Setup
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com"
});

const db = admin.database();

// ⚠️ Custom Payout List (Har UID ke samne uski exact amount)
const CUSTOM_PAYOUTS = {
  "txOXkUFmb2bVPadwTusJxWUzrqH3": 30000,
  "7RQwg3vKbxfkry7jZdtrHcsTvZw1": 20000,
  "oYDI0bVu4QVwRThzUaHdd9XH4jq2": 35000,
  "o5a3X22anVW0hayzBb306ueW5M62": 200000,
  "BijEYBvvoqe9P2noAvuiC40xoc23": 35000,
  "TG1IPPj53SV2A4Ett2mR5f6Wa4H2": 60000,
  "E9NiJ6jCUmY9QopyGmyKoiqOCxy1": 45000,
  "3SNfX9MXyWUUTsq4jEBb3MraY4a2": 100000,
  "AWZS8wp5mBQcDCZHIKFansfQxev2": 100000,
  "4Db4QcfSqfNk6F5MPGk6Cy0FJ5P2": 18000,
  "HAt49Q5ePwfAtnrIoATjFy7RyQ72": 30000,
  "iTvBMEaID8VbwcB6ThesvDB0eRH2": 20000,
  "sOJ8J1S5AWgjkb0JAyKHNBp4fYD3": 25000
};

async function distributeCustomSalary() {
  const totalUsers = Object.keys(CUSTOM_PAYOUTS).length;
  console.log(`🚀 Starting Custom Payout for ${totalUsers} specific users...`);

  try {
    const updates = {};

    // Har UID aur uski amount ko read karke updates banayenge
    Object.entries(CUSTOM_PAYOUTS).forEach(([uid, amount]) => {
      // ✅ Safe Atomic Increment (Purana balance + User ki specific amount)
      updates[`users/${uid}/balance`] = admin.database.ServerValue.increment(amount);
      
      // Optional: Track last payment time
      updates[`users/${uid}/lastSalaryTime`] = admin.database.ServerValue.TIMESTAMP;
    });

    // Bulk Update to Realtime Database
    if (Object.keys(updates).length > 0) {
      await db.ref().update(updates);
      console.log(`🎉 Success! Alag-alag amounts ${totalUsers} users ke accounts mein add ho gayi hain.`);
    } else {
      console.log("❌ Koi data nahi mila update karne ke liye.");
    }

  } catch (error) {
    console.error("❌ Error distributing custom salary:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

distributeCustomSalary();
