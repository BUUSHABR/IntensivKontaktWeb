import { createContext, useContext } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastContext = createContext<any>({
  toast,
});

function useToast() {
  return {
    toast,
  };
}

export function ToastProvider({ children }: any) {
  const toast = useToast();

  return (
    <toastContext.Provider value={toast}>
      <ToastContainer
        className="custom-toast"
        bodyClassName="custom-body-toast"
        position="top-center"
        autoClose={2000}
        limit={3}
        hideProgressBar={true}
      />
      {children}
    </toastContext.Provider>
  );
}

export default function ToastConsumer() {
  return useContext(toastContext);
}
