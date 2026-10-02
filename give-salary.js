const admin = require("firebase-admin");

// Service Account & Realtime Database Setup
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com"
});

const db = admin.database();

async function calculateTotalUserBalance() {
  console.log("🚀 Realtime Database ke 'Users' folder se data fetch kiya ja raha hai...");

  try {
    // 1. First attempt: Capital 'Users'
    let snapshot = await db.ref("Users").once("value");

    // 2. Fallback: Lowercase 'users' if capital returns null
    if (!snapshot.exists()) {
      console.log("⚠️ 'Users' node blank mila, 'users' (lowercase) check ho raha hai...");
      snapshot = await db.ref("users").once("value");
    }

    if (!snapshot.exists()) {
      console.log("⚠️ Realtime Database me 'Users' ya 'users' node nahi mila.");
      process.exit(0);
    }

    const usersData = snapshot.val();
    let totalBalance = 0;
    let totalUsers = 0;

    console.log("⏳ Processing all user balances...\n");

    for (const key in usersData) {
      if (Object.prototype.hasOwnProperty.call(usersData, key)) {
        const userNode = usersData[key];

        if (userNode && typeof userNode === "object") {
          if (userNode.balance !== undefined && userNode.balance !== null) {
            const userBalance = parseFloat(userNode.balance) || 0;
            totalBalance += userBalance;
            totalUsers++;
          }
        }
      }
    }

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
  } finally {
    process.exit(0);
  }
}

calculateTotalUserBalance();
