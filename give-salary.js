const admin = require("firebase-admin");

// 1. Service Account Setup
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "starx-network.firebasestorage.app" 
});

const bucket = admin.storage().bucket();

async function deleteKycFiles() {
  const FOLDER_PATH = "kyc_verified/";

  console.log(`🚀 Searching for files in folder: "${FOLDER_PATH}"...`);

  try {
    const [files] = await bucket.getFiles({ prefix: FOLDER_PATH });
    const totalFiles = files.length;

    if (totalFiles === 0) {
      console.log(`⚠️ "${FOLDER_PATH}" folder mein koi file nahi mili.`);
      process.exit(0);
    }

    console.log(`📊 Total ${totalFiles} files mili hain. Deletion start ho rahi hai...`);

    let deletedCount = 0; // Kitni files delete ho chuki hain uska counter

    const deletePromises = files.map(async (file) => {
      try {
        await file.delete();
        deletedCount++;
        // Har file delete hone par progress show karega
        console.log(`🗑️ Deleted [${deletedCount}/${totalFiles}]: ${file.name}`);
      } catch (err) {
        // Agar kisi ek file mein error aaye toh script ruke na
        console.error(`❌ Failed to delete ${file.name}:`, err.message);
      }
    });

    // Sab files ki deletion ka wait karein
    await Promise.all(deletePromises);

    console.log(`\n🎉 Deletion Complete!`);
    console.log(`✅ Successfully Deleted: ${deletedCount}`);
    console.log(`❌ Failed to Delete: ${totalFiles - deletedCount}`);
    
  } catch (error) {
    console.error("❌ Error accessing storage:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

deleteKycFiles();
