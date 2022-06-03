import * as admin from "firebase-admin";
// import * as serviceAccount from "./key.json";
import "dotenv/config";

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDS);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://dwf-m6-desafio-c066f-default-rtdb.firebaseio.com",
});

const rtdb = admin.database();
const firestore = admin.firestore();
const fieldValue = admin.firestore.FieldValue;
export { rtdb, firestore, fieldValue };
