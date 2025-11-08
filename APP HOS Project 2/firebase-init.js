const firebaseConfig = {
  apiKey: "AIzaSyB2tBHpsJZC36M96exoneVoxQHeqLaB7nc",
  authDomain: "hostel-outpass-system-925d8.firebaseapp.com",
  projectId: "hostel-outpass-system-925d8",
  storageBucket: "hostel-outpass-system-925d8.firebasestorage.app",  // Fixed here - removed extra quotes
  messagingSenderId: "411088673781",
  appId: "1:411088673781:web:fa9ac3622b6f7ac09edebc",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
