import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const firebaseAuth = auth();
export const firebaseFirestore = firestore();

export { FirebaseAuthTypes, FirebaseFirestoreTypes };
