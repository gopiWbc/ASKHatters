import { useState, useEffect } from 'react';
import { firebaseAuth } from '../firebase/config';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export const useAuth = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

    useEffect(() => {
        const subscriber = firebaseAuth.onAuthStateChanged((userState) => {
            setUser(userState);
            if (initializing) setInitializing(false);
        });
        return subscriber; // unsubscribe on unmount
    }, [initializing]);

    return {
        user,
        initializing,
        signIn: (email: string, pass: string) => firebaseAuth.signInWithEmailAndPassword(email, pass),
        signUp: (email: string, pass: string) => firebaseAuth.createUserWithEmailAndPassword(email, pass),
        signOut: () => firebaseAuth.signOut(),
    };
};
