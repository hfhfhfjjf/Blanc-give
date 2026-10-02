const admin = require("firebase-admin");

// 1. Service Account & Realtime Database Setup
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com" // Aapki RTDB URL
});

const db = admin.database();

async function calculateTotalUserBalance() {
  console.log("🚀 Realtime Database se users ka balance calculate karna start ho raha hai...");

  try {
    // Agar users root path par hain toh db.ref() use hoga, agar "/users" folder me hain toh db.ref("users") karen
    const snapshot = await db.ref().once("value");

    if (!snapshot.exists()) {
      console.log("⚠️ Database me koi data nahi mila.");
      process.exit(0);
    }

    const allData = snapshot.val();
    let totalBalance = 0;
    let totalUsers = 0;

    console.log("⏳ Processing all user nodes...\n");

    for (const key in allData) {
      if (Object.prototype.hasOwnProperty.call(allData, key)) {
        const userNode = allData[key];

        // Ensure current node user object hai aur usme balance field maujood hai
        if (userNode && typeof userNode === "object" && userNode.balance !== undefined) {
          const userBalance = parseFloat(userNode.balance) || 0;
          totalBalance += userBalance;
          totalUsers++;
        }
      }
    }

    // Millions aur Billions format calculations
    const inMillions = (totalBalance / 1_000_000).toFixed(2);
    const inBillions = (totalBalance / 1_000_000_000).toFixed(2);

    console.log("==================================================");
    console.log(`👥 Total Users Found: ${totalUsers.toLocaleString()}`);
    console.log(`💰 Total Exact Balance: ${totalBalance.toFixed(4)} STRX`);
    
    if (totalBalance >= 1_000_000_000) {
      console.log(`🔥 Total Formatted Balance: ${inBillions} BILLION STRX (${inMillions}M STRX)`);
    } else {
      console.log(`🔥 Total Formatted Balance: ${inMillions} MILLION STRX (${inMillions}M STRX)`);
    }
    console.log("==================================================");

  } catch (error) {
    console.error("❌ Error reading Realtime Database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

calculateTotalUserBalance();
