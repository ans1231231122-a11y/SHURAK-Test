/**
 * شُرَاك | SHURAK - إعدادات Firebase
 * ---------------------------------
 * استبدل القيم أدناه بمفاتيح مشروعك من Firebase Console.
 * لا تضع المفاتيح السرية (Service Account) هنا أبداً.
 */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/*
  طريقة التفعيل لاحقاً:

  1. أنشئ مشروع في https://console.firebase.google.com
  2. فعّل Authentication → Sign-in method → Google
  3. أنشئ قاعدة Firestore
  4. انسخ الإعدادات هنا
  5. أضف مكتبات Firebase في index.html:

     <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-app-compat.js"></script>
     <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-auth-compat.js"></script>
     <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore-compat.js"></script>
     <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-storage-compat.js"></script>

  6. ثم في app.js:
     firebase.initializeApp(firebaseConfig);
     const auth = firebase.auth();
     const db = firebase.firestore();
*/

// حالياً: النسخة تعمل بدون Firebase (بيانات تجريبية + localStorage)
console.log("شُرَاك: Firebase config جاهز للربط (حالياً وضع تجريبي)");
