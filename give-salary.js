const admin = require("firebase-admin");

// 1. Service Account Setup
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com"
});

const db = admin.database();

async function distributeReferralReward() {
  const TARGET_REFERRAL = "sinbadnetwork";
  const REWARD_AMOUNT = 200;

  console.log(`🚀 Searching for users referred by: ${TARGET_REFERRAL}...`);

  try {
    // Database se un users ko query kar rahe hain jinhone "sinbadnetwork" code use kiya hai
    const snapshot = await db.ref("users")
      .orderByChild("referredBy")
      .equalTo(TARGET_REFERRAL)
      .once("value");

    if (!snapshot.exists()) {
      console.log(`⚠️ No users found who used referral code: ${TARGET_REFERRAL}`);
      process.exit(0);
    }

    const updates = {};
    let totalUsers = 0;

    snapshot.forEach((childSnap) => {
      const uid = childSnap.key;
      updates[`users/${uid}/balance`] = admin.database.ServerValue.increment(REWARD_AMOUNT);
      updates[`users/${uid}/lastRewardTime`] = admin.database.ServerValue.TIMESTAMP;
      totalUsers++;
    });

    if (Object.keys(updates).length > 0) {
      await db.ref().update(updates);
      console.log(`🎉 Success! Added ${REWARD_AMOUNT} STRX to ${totalUsers} users.`);
    }
  } catch (error) {
    console.error("❌ Error distributing referral reward:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

distributeReferralReward();
