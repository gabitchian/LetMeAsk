/* eslint-disable react/react-in-jsx-scope */
import {
  createContext, ReactNode, useEffect, useState,
} from 'react';
import { firebase, auth } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

type AuthContextProviderProps = {
    children: ReactNode;
}

export default ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((loggedUser) => {
      if (loggedUser) {
        const { displayName, photoURL, uid } = loggedUser;

        if (!displayName || !photoURL) throw new Error('Missing information from Google Account');

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) throw new Error('Missing information from Google Account');

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};
