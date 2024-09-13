import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

const currentPatientContext = createContext<{
  currentPatientId: number | undefined | null;
  setCurrentPatientId: Dispatch<SetStateAction<number | undefined | null>>;
}>({
  currentPatientId: undefined,
  setCurrentPatientId: () => {},
});

function useCurrentPatient() {
  const [currentPatientId, setCurrentPatientId] = useState<number | undefined | null>();
  return {
    currentPatientId,
    setCurrentPatientId,
  };
}

export function CurrentPatientProvider({ children }: any) {
  const currentPatient = useCurrentPatient();

  return (
    <currentPatientContext.Provider value={currentPatient}>
      {children}
    </currentPatientContext.Provider>
  );
}

export default function CurrentPatientConsumer() {
  return useContext(currentPatientContext);
}
