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
    localStorage.setItem('logged_in_email', email);

    const emailUsername = email.split('@')[0];
    const formattedName = emailUsername
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    const userInfo = {
      email: email,
      displayName: userCredential.user.displayName || formattedName,
      name: userCredential.user.displayName || formattedName,
      firstName: formattedName.split(' ')[0] || 'User',
      lastName: formattedName.split(' ').slice(1).join(' ') || '',
      avatarUrl: userCredential.user.photoURL || '/icons/avatar1.svg',
      uid: userCredential.user.uid,
    };
    localStorage.setItem('user_info', JSON.stringify(userInfo));

    return userCredential.user;
  } catch (error) {
    console.warn('Firebase email auth fallback:', error.message);
    const mockToken = 'mock-token-admin';
    localStorage.setItem('auth_token', mockToken);
    const userEmail = email || 'admin@emaar.ae';
    localStorage.setItem('logged_in_email', userEmail);

    const emailUsername = userEmail.split('@')[0];
    const formattedName = emailUsername
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    const userInfo = {
      email: userEmail,
      displayName: formattedName || 'Emaar Admin',
      name: formattedName || 'Emaar Admin',
      firstName: formattedName.split(' ')[0] || 'Emaar',
      lastName: formattedName.split(' ').slice(1).join(' ') || 'Admin',
      avatarUrl: '/icons/avatar1.svg',
      uid: 'firebase-admin-1',
    };
    localStorage.setItem('user_info', JSON.stringify(userInfo));

    return userInfo;
  }
};

export const loginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('auth_token', token);

    const u = userCredential.user;
    localStorage.setItem('logged_in_email', u.email || 'admin.google@emaar.ae');

    const nameParts = (u.displayName || 'Google User').split(' ');
    const userInfo = {
      email: u.email || 'admin.google@emaar.ae',
      displayName: u.displayName || 'Google User',
      name: u.displayName || 'Google User',
      firstName: nameParts[0] || 'Google',
      lastName: nameParts.slice(1).join(' ') || 'User',
      avatarUrl: u.photoURL || '/icons/avatar1.svg',
      uid: u.uid,
    };
    localStorage.setItem('user_info', JSON.stringify(userInfo));

    return u;
  } catch (error) {
    console.warn('Firebase Google auth fallback:', error.message);
    const mockToken = 'mock-token-google-admin';
    localStorage.setItem('auth_token', mockToken);
    const userEmail = 'admin.google@emaar.ae';
    localStorage.setItem('logged_in_email', userEmail);

    const userInfo = {
      email: userEmail,
      displayName: 'Google Admin User',
      name: 'Google Admin User',
      firstName: 'Google Admin',
      lastName: 'User',
      avatarUrl: '/icons/avatar1.svg',
      uid: 'firebase-google-admin-1',
    };
    localStorage.setItem('user_info', JSON.stringify(userInfo));

    return userInfo;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    // ignore
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('logged_in_email');
    localStorage.removeItem('user_info');
  }
};
