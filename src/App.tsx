import routes from 'routes';
import { useRoutes } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastProvider } from './hoc/toastProvider';

export default function App() {
  let element = useRoutes(routes);

  useEffect(() => {
    console.log('PROD APP VERSION 1.2');
  }, []);

  return (
    <div>
      <ToastProvider>{element}</ToastProvider>
    </div>
  );
}
