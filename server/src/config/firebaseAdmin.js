import admin from 'firebase-admin';
import logger from '../utils/logger.js';

let isFirebaseAdminInitialized = false;

export const initFirebaseAdmin = () => {
  try {
    if (admin.apps.length === 0) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (projectId && clientEmail && privateKey && !privateKey.includes('...')) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        isFirebaseAdminInitialized = true;
        logger.info('Firebase Admin SDK initialized successfully.');
      } else {
        logger.warn('Firebase Admin SDK initialized in Development Mock Mode (missing or placeholder service account keys).');
      }
    }
  } catch (error) {
    logger.error(`Firebase Admin SDK initialization error: ${error.message}`);
  }
};

export const verifyIdToken = async (idToken) => {
  if (isFirebaseAdminInitialized) {
    return await admin.auth().verifyIdToken(idToken);
  }

  // Development / Mock fallback token verification
  if (process.env.NODE_ENV !== 'production') {
    if (idToken.startsWith('mock-token-') || idToken === 'dev-demo-token') {
      const parts = idToken.split('-');
      const userId = parts[2] || 'demo-user-123';
      return {
        uid: `firebase-${userId}`,
        email: `${userId}@emaar.ae`,
        name: 'Demo Admin User',
        picture: 'icons/avatar1.svg',
        email_verified: true,
      };
    }
  }

  throw new Error('Invalid or unverified authentication token.');
};

export default admin;
