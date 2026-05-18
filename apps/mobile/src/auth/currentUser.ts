import auth from '@react-native-firebase/auth';

export function getCurrentUserId(): string | null {
    return auth().currentUser?.uid ?? null;
}
