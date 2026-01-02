import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBShfZffHQFt4SYi1TQn-2px40B8koADWI",
  authDomain: "portfolio-like-system.firebaseapp.com",
  projectId: "portfolio-like-system",
  storageBucket: "portfolio-like-system.firebasestorage.app",
  messagingSenderId: "380998673316",
  appId: "1:380998673316:web:7881a56b1d01a17e6bd731",
  measurementId: "G-8DMKTE1RZ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get likes for a project
export const getProjectLikes = async (projectId) => {
  try {
    const docRef = doc(db, 'projectLikes', projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().count || 0;
    } else {
      // Initialize the document if it doesn't exist
      await setDoc(docRef, { count: 0 });
      return 0;
    }
  } catch (error) {
    console.error('Error getting likes:', error);
    return 0;
  }
};

// Increment like for a project
export const incrementProjectLike = async (projectId) => {
  try {
    const docRef = doc(db, 'projectLikes', projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        count: increment(1)
      });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    
    // Return the new count
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.data().count;
  } catch (error) {
    console.error('Error incrementing like:', error);
    return null;
  }
};

// Decrement like for a project
export const decrementProjectLike = async (projectId) => {
  try {
    const docRef = doc(db, 'projectLikes', projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentCount = docSnap.data().count || 0;
      if (currentCount > 0) {
        await updateDoc(docRef, {
          count: increment(-1)
        });
      }
    }
    
    // Return the new count
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.data()?.count || 0;
  } catch (error) {
    console.error('Error decrementing like:', error);
    return null;
  }
};

export { db };
