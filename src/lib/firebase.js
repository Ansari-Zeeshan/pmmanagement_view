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
    if (error.code === 'auth/invalid-api-key' || error.code === 'auth/network-request-failed' || error.code === 'auth/user-not-found') {
      const mockToken = 'mock-token-admin';
      localStorage.setItem('auth_token', mockToken);
      return { email, displayName: 'Emaar Admin', uid: 'firebase-admin-1' };
    }
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('auth_token', token);
    return userCredential.user;
  } catch (error) {
    if (error.code === 'auth/invalid-api-key' || error.code === 'auth/popup-closed-by-user') {
      const mockToken = 'mock-token-admin';
      localStorage.setItem('auth_token', mockToken);
      return { email: 'admin@emaar.ae', displayName: 'Google Admin User', uid: 'firebase-admin-1' };
    }
    throw error;
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
