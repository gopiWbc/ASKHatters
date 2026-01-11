import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { firebaseFirestore } from '../firebase/config';

export const firestoreService = {
    // Collection reference helper
    getCollection: (collectionName: string) => {
        return firebaseFirestore.collection(collectionName);
    },

    // Document reference helper
    getDocument: (collectionName: string, docId: string) => {
        return firebaseFirestore.collection(collectionName).doc(docId);
    },

    // Add document
    addDocument: async (collectionName: string, data: any) => {
        try {
            return await firebaseFirestore.collection(collectionName).add({
                ...data,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
        } catch (error) {
            console.error('Error adding document: ', error);
            throw error;
        }
    },

    // Set document (with ID)
    setDocument: async (collectionName: string, docId: string, data: any) => {
        try {
            return await firebaseFirestore.collection(collectionName).doc(docId).set({
                ...data,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
        } catch (error) {
            console.error('Error setting document: ', error);
            throw error;
        }
    },

    // Get documents with optional query
    getDocuments: async (collectionName: string) => {
        try {
            const snapshot = await firebaseFirestore.collection(collectionName).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            console.error('Error getting documents: ', error);
            throw error;
        }
    },

    // Real-time listener helper
    subscribeToCollection: (
        collectionName: string,
        onNext: (snapshot: FirebaseFirestoreTypes.QuerySnapshot) => void,
        onError?: (error: Error) => void
    ) => {
        return firebaseFirestore.collection(collectionName).onSnapshot(onNext, onError);
    },
};
