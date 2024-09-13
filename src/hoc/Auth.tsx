import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import http, { STORAGE_KEY } from 'components/util/http';
import jwt_decode from 'jwt-decode';

export enum LoginState {
  Loading = 1,
  LoggedIn,
  NotLoggedIn,
}

interface IUser {
  email: string;
  id: number;
  phone: string;
  first_name: string;
  last_name: string;
}

interface IAuth {
  isLoading: boolean;
  isAuthenticated: boolean;
  authenticatedUser: IUser | null;
  updateUser: (data: UpdateUserParams) => Promise<void>;
  login: (email: string, password: string) => Promise<IUser>;
  logout: () => void;
}

const AuthContext = createContext<IAuth | null>(null);

const isTokenValid = (token: string) => {
  const decodedToken: any = jwt_decode(token);
  if (!decodedToken) return false;
  return decodedToken.exp * 1000 > new Date().getTime();
};

// Updating user data is done via PATCH,
// the same endpoint is used in multiple UI forms (Settings -> Change E-Mail and Change Password)
type UpdateUserParams =
  | {
      password: string;
      old_password: string;
    }
  | {
      email: string;
      phone: string;
      first_name: string;
      last_name: string;
    };

export function AuthProvider({ children }: React.PropsWithChildren<{}>) {
  const [authed, setAuthed] = useState(LoginState.Loading);
  const [user, setUser] = useState<IUser | null>(null);

  const fetchUser = useCallback(
    () =>
      new Promise<IUser>((resolve, reject) => {
        http.get('/auth/users/me/').then(
          async (res) => {
            const data: IUser = res;
            resolve(data);
          },
          () => reject(),
        );
      }),
    [],
  );

  const updateUser = useCallback(
    (data: UpdateUserParams) =>
      http.patch('/auth/users/me/', data).then((updatedUser: IUser) => setUser(updatedUser)),
    [],
  );

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);

    if (!token || !isTokenValid(token)) {
      setAuthed(LoginState.NotLoggedIn);
      http.removeAuthHeader();
      return;
    }

    fetchUser().then(
      (userData) => {
        setUser(userData);
        setAuthed(LoginState.LoggedIn);
      },
      () => {
        http.removeAuthHeader();
        setAuthed(LoginState.NotLoggedIn);
      },
    );
  }, [fetchUser]);

  const auth = useMemo(
    () => ({
      isLoading: authed === LoginState.Loading,
      isAuthenticated: authed === LoginState.LoggedIn,
      authenticatedUser: user,
      updateUser,
      login: (email: string, password: string) => {
        return new Promise<IUser>((resolve, reject) => {
          http.post('/auth/jwt/create/', { email, password }).then(
            async (res) => {
              const { access } = res;
              if (!jwt_decode(access)) {
                reject();
              }
              http.setAuthHeader(access);
              const user: IUser = await fetchUser();
              setUser(user);
              setAuthed(LoginState.LoggedIn);
              resolve(user);
            },
            (err) => reject(err),
          );
        });
      },
      logout() {
        setAuthed(LoginState.NotLoggedIn);
        http.removeAuthHeader();
      },
    }),
    [authed, setAuthed, updateUser, user, fetchUser],
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('AuthContext missing.');
  }

  return ctx;
};
