import { useAuthContext } from 'hoc/index';
import { Navigate, useLocation } from 'react-router-dom';

export function RequireAuth({ children }: React.PropsWithChildren<{}>) {
  let auth = useAuthContext();
  let location = useLocation();

  if (auth.isLoading) {
    return null;
  }

  if (!auth.isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
