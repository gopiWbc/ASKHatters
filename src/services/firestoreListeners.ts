import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type UnsubscribeFn = () => void;

/**
 * Listen to messages for a chat in Firestore (ordered by created_at asc).
 * Returns an unsubscribe function.
 */
export const listenToMessages = (
  chatId: string,
  onData: (messages: FirebaseFirestoreTypes.DocumentData[]) => void,
  onError?: (err: unknown) => void,
): UnsubscribeFn => {
  if (!chatId) return () => {};
  const ref = firestore().collection('chats').doc(chatId).collection('messages');
  const q = ref.orderBy('created_at', 'asc');
  const unsubscribe = q.onSnapshot(
    (snap: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>) => {
      const messages = snap.docs.map(
        (
          doc: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
        ) => ({ id: doc.id, ...doc.data() }),
      );
      onData(messages);
    },
    (err: unknown) => {
      if (onError) onError(err);
      else console.error('listenToMessages error', err);
    },
  );
  return unsubscribe;
};

/**
 * Listen to a chat document for metadata/status changes.
 */
export const listenToChat = (
  chatId: string,
  onData: (chat: FirebaseFirestoreTypes.DocumentData | null) => void,
  onError?: (err: unknown) => void,
): UnsubscribeFn => {
  if (!chatId) return () => {};
  const ref = firestore().collection('chats').doc(chatId);
  const unsubscribe = ref.onSnapshot(
    (doc: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>) => {
      if (doc.exists) onData({ id: doc.id, ...doc.data() });
      else onData(null);
    },
    (err: unknown) => {
      if (onError) onError(err);
      else console.error('listenToChat error', err);
    },
  );
  return unsubscribe;
};
