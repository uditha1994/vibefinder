import { FIREBASE_CONFIG } from '../utils/constants.js';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const app = initializeApp(FIREBASE_CONFIG);

//initialize firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// ..initialize google auth provider
export const googleProvider = new GoogleAuthProvider();
//configure google auth provider
googleProvider.setCustomParameters({
    prompt: 'select_account' //show account selection
});

export default app;

//firebase configuration validate
export const validateFirebaseConfig = () => {
    const config = {
        hasAuth: !!auth,
        hasFirestore: !!db,
        projectId: FIREBASE_CONFIG.projectId
    };

    console.log('firebase configuration status: ',config);
    return config;
};

//check if firebase is properly initialized
export const isFirebaseInitialized = () => {
    try {
        return !!(auth && db && app);
    } catch (error) {
        console.error('Firebase initialization check failed: ',error);
        false;
    }
};