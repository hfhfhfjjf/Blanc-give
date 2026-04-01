const admin = require("firebase-admin");

// 1. Service Account Setup
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://starx-network-default-rtdb.firebaseio.com"
});

const db = admin.database();

// ⚠️ Final Exact List (55 Users for Ambassador Badge)
const TARGET_UIDS = [
  "KKrLzf3n8JY3ceoewBScqcogvPC2",
  "fkP1CcAVVTSSLCziEMW9OGLcEFh1",
  "SiScarwJztRHuujpy4VWXjctTki2",
  "vNA5awpqy2d9dAJaBe5k5LfZOQO2",
  "8K11g3pl0kMjjiRT1ftkPnNLhz52",
  "F4CAeXQGl4PTttaD8mmtVQntzyW2",
  "PiGcRsQmkTVtsUxV07Uo3pRrR2c2",
  "jy8vMfqWo6RuwMAnRTk11IrGYZ32",
  "6lU0lAilzveunPkABwxGTUNtoed2",
  "6Kug4tQbL6aFTTD4Jw95NvJ73JI3",
  "HEbjRcYKBLYkOhqHZIU8aWomX9M2",
  "x17wZseSmAOAIQq3J2WkIVKeOKq1",
  "E4w81dod7XUF8ec8kIilGfkPOdO2",
  "nH1ComFO7Je6GMfFX5sOvKBk2Xs1",
  "YclTkCkiTFgBMB9qvelakPCmKI93",
  "fIFAjhEeNRPBDDrNvVvIAK9lXys2",
  "eQSBVz6AZdbIPq6YlNYt5UWhQBN2",
  "yKhVbYkPz0NObpNm4mTdkpQfmPt1",
  "ZyRrcXC56JW45jrkdpOUlWJRfm63",
  "YWhrlUjnc7Nk8udRwSlL00iPFIh2",
  "uOkThAbi8dh10pkcorFKE7k98ZK2",
  "78WZ4MENo8SsoNmwCOt4yhYEFD03",
  "X8gbm0QxRuMZD0FqXhmYt6UzPZC3",
  "iGtBY1GM2PXGLMbrWNssV749k0a2",
  "piGYlVwARCUNYnKTCZ8oFcOEYsi1",
  "S4m4O7XgEyfJb5ZPR7MYNWzHaY93",
  "WEm3Drbb2dXF3iG6gArQHyT8WK03",
  "8ay4ij3RMxO1kuWVoDVGu8jrxji2",
  "4Db4QcfSqfNk6F5MPGk6Cy0FJ5P2",
  "agTboyUvq3cE4aWu8CT2Po39vh42",
  "BkF05S2Y4xhlS9ub99Z2D1kgGmR2",
  "0IBWBx0ul5R8Hd2JHdUp9fmlQx82",
  "Dbd1sno2a7OzgXc6Frca0Pr5tAK2", 
  "TxOXkUFmb2bVPadwTusJxWUzrqH3", 
  "7RQwg3vKbxfkry7jZdtrHcsTvZw1", 
  "oYDI0bVu4QVwRThzUaHdd9XH4jq2", 
  "o5a3X22anVW0hayzBb306ueW5M62", 
  "BijEYBvvoqe9P2noAvuiC40xoc23", 
  "TG1IPPj53SV2A4Ett2mR5f6Wa4H2", 
  "E9NiJ6jCUmY9QopyGmyKoiqOCxy1", 
  "3SNfX9MXyWUUTsq4jEBb3MraY4a2", 
  "AWZS8wp5mBQcDCZHIKFansfQxev2", 
  "AHNlGIgakoNX29RXmbtxmN0qbom2",
  "GcKqQJAnJjga51ORyXGYDi5J6lu2",
  "ZFgXpgaA6hTiAdLbMkdYkJ2htDV2",
  "2QDiaN4Dv0bJ8MfkobozTYUL7p83",
  "f1eu4Rsj3AgucpPcy13YZjRrtAY2",
  "rZC9lTvHfmc22Xe4wqQ8wpWvwX63",
  "MkqirOPAFjUL30RpHSZKdchn6Eh2",
  "dCviWXh7ctaEMll55YksWffiusk1",
  "ohzoXYdOkLWfhz6d9iTyugcUQeR2",
  "bNKKYicpsHOFbJL4emXOqEQLY7J2",
  // --- Naye UIDs ---
  "NkBf6oiYyYcFImLmEqj9NXNWXXQ2",
  "JsftFGrGbAhdTyuyhe8vuIZpCbH3",
  "I6HyLRb7ZNUP1w0pgx3Oy3uPxIz1"
];

async function assignAmbassadorBadges() {
  console.log(`🚀 Assigning Ambassador Badges to ${TARGET_UIDS.length} users...`);
  try {
    const updates = {};

    TARGET_UIDS.forEach((uid) => {
      // ✅ Set isAmbassador to true
      updates[`users/${uid}/isAmbassador`] = true;
    });

    if (Object.keys(updates).length > 0) {
      await db.ref().update(updates);
      console.log(`🎉 Success! Ambassador badge added for ${TARGET_UIDS.length} users.`);
    } else {
      console.log("❌ No UIDs provided in the list.");
    }
  } catch (error) {
    console.error("❌ Error setting badges:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

assignAmbassadorBadges();
