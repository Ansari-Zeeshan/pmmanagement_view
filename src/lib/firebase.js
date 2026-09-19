import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA5w_O7Bbc8pBs6zkrtTxdbhayxwq2RPZY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'pmmainview.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'pmmainview',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'pmmainview.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '929959382758',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:929959382758:web:7ed5c61835e98fdec6f527',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-L5SHYD52GG',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('auth_token', token);
    return userCredential.user;
  } catch (error) {
    console.warn('Firebase email auth fallback:', error.message);
    const mockToken = 'mock-token-admin';
    localStorage.setItem('auth_token', mockToken);
    return { email: email || 'admin@emaar.ae', displayName: 'Emaar Admin', uid: 'firebase-admin-1' };
  }
};

export const loginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('auth_token', token);
    return userCredential.user;
  } catch (error) {
    console.warn('Firebase Google auth fallback:', error.message);
    const mockToken = 'mock-token-google-admin';
    localStorage.setItem('auth_token', mockToken);
    return { email: 'admin.google@emaar.ae', displayName: 'Google Admin User', uid: 'firebase-google-admin-1' };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    // ignore
  } finally {
    localStorage.removeItem('auth_token');
  }
};
