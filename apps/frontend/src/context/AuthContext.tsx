import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  AuthError,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";

const firebaseAuthErrorMessages: { [key: string]: string } = {
  "auth/email-already-in-use":
    "The email address is already in use by another account.",
  "auth/invalid-email": "The email address is not valid.",
  "auth/operation-not-allowed": "Email/password accounts are not enabled.",
  "auth/weak-password": "The password is not strong enough.",
  "auth/user-disabled":
    "The user account has been disabled by an administrator.",
  "auth/user-not-found": "There is no user corresponding to the given email.",
  "auth/wrong-password":
    "The password is invalid for the given email, or the account corresponding to the email does not have a password set.",
  "auth/too-many-requests":
    "We have blocked all requests from this device due to unusual activity. Try again later.",
  "auth/invalid-credential": "Incorrect email or password",
  // Add more Firebase Auth error codes as needed
};

const AuthContext = createContext<{
  user: User | null;
  initializing: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}>({
  user: null,
  initializing: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setInitializing(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      const error = e as AuthError;
      if (error.code in firebaseAuthErrorMessages) {
        throw new Error(firebaseAuthErrorMessages[error.code]);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        throw new Error(e.toString());
      }
    }
  }

  async function signUp(email: string, password: string) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      const error = e as AuthError;
      if (error.code in firebaseAuthErrorMessages) {
        throw new Error(firebaseAuthErrorMessages[error.code]);
      }
    }
  }

  async function signOut() {
    return await fbSignOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
