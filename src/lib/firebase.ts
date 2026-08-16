import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "fluid-torch-mmbw7",
  appId: "1:469630965459:web:fd22e0e97ce9ba40a6a626",
  apiKey: "AIzaSyAR-1TAvQ1XHAdBHAOT-IYvO97fOik6IfE",
  authDomain: "fluid-torch-mmbw7.firebaseapp.com",
  storageBucket: "fluid-torch-mmbw7.firebasestorage.app",
  messagingSenderId: "469630965459"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, "ai-studio-mindmantra-77ceeff1-6ceb-4de8-8234-b5a55325d659");

export const auth = getAuth(app);
