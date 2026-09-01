const admin = require("firebase-admin");

// 1. Service Account Setup
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com"
});

const db = admin.database();

async function distributeReferralReward() {
  const TARGET_REFERRAL = "sinbadnetwork".trim().toLowerCase();
  const REWARD_AMOUNT = 200;

  console.log(`🚀 Searching for users referred by: "${TARGET_REFERRAL}"...`);

  try {
    // 1. All users fetch kar rahe hain taake exact/case issue na aaye
    const snapshot = await db.ref("users").once("value");

    if (!snapshot.exists()) {
      console.log("⚠️ Database mein 'users' node nahi mila. Path check karein!");
      process.exit(0);
    }

    const updates = {};
    let totalMatched = 0;
    let totalScanned = 0;

    // 2. Loop through every user and match referredBy
    snapshot.forEach((childSnap) => {
      totalScanned++;
      const uid = childSnap.key;
      const userData = childSnap.val();

      if (userData && userData.referredBy) {
        const userReferredBy = String(userData.referredBy).trim().toLowerCase();

        if (userReferredBy === TARGET_REFERRAL) {
          updates[`users/${uid}/balance`] = admin.database.ServerValue.increment(REWARD_AMOUNT);
          updates[`users/${uid}/lastRewardTime`] = admin.database.ServerValue.TIMESTAMP;
          totalMatched++;
        }
      }
    });

    console.log(`📊 Total ${totalScanned} users scan kiye gaye.`);

    if (totalMatched > 0) {
      await db.ref().update(updates);
      console.log(`🎉 Success! ${totalMatched} users ke balance mein ${REWARD_AMOUNT} STRX add ho gaye.`);
    } else {
      console.log(`⚠️ Database mein kisi bhi user ke 'referredBy' field mein "${TARGET_REFERRAL}" nahi mila.`);
    }
  } catch (error) {
    console.error("❌ Error distributing referral reward:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

distributeReferralReward();
