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
  const BATCH_SIZE = 500; // Ek waqt mein 500 files delete karega

  console.log(`🚀 Searching for files in folder: "${FOLDER_PATH}"...`);

  try {
    const [files] = await bucket.getFiles({ prefix: FOLDER_PATH });
    const totalFiles = files.length;

    if (totalFiles === 0) {
      console.log(`⚠️ "${FOLDER_PATH}" folder mein koi file nahi mili.`);
      process.exit(0);
    }

    console.log(`📊 Total ${totalFiles} files mili hain. Batch deletion start ho rahi hai...`);

    let deletedCount = 0;
    let failedCount = 0;

    // Batches mein loop chalayen
    for (let i = 0; i < totalFiles; i += BATCH_SIZE) {
      const chunk = files.slice(i, i + BATCH_SIZE);
      
      console.log(`⏳ Processing batch ${i} to ${i + chunk.length}...`);

      const deletePromises = chunk.map(async (file) => {
        try {
          await file.delete();
          deletedCount++;
          console.log(`🗑️ Deleted [${deletedCount}/${totalFiles}]: ${file.name}`);
        } catch (err) {
          failedCount++;
          console.error(`❌ Failed to delete ${file.name}:`, err.message);
        }
      });

      // Is batch ki saari files delete hone ka wait karein
      await Promise.all(deletePromises);
    }

    console.log(`\n🎉 Deletion Complete!`);
    console.log(`✅ Successfully Deleted: ${deletedCount}`);
    console.log(`❌ Failed to Delete: ${failedCount}`);
    
  } catch (error) {
    console.error("❌ Error accessing storage:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

deleteKycFiles();
