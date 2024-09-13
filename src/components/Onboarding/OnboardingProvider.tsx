import { createContext, useContext, useState } from 'react';

const onboardingContext = createContext<{
  onboardingValues: any;
  setOnboardingValues: any;
}>({
  onboardingValues: {},
  setOnboardingValues: () => {},
});

function useOnboarding() {
  const [onboardingValues, setOnboardingValues] = useState<{}>({});
  return {
    onboardingValues,
    setOnboardingValues,
  };
}

export function OnboardingProvider({ children }: any) {
  const onboarding = useOnboarding();

  return <onboardingContext.Provider value={onboarding}>{children}</onboardingContext.Provider>;
}

export default function OnboardingConsumer() {
  return useContext(onboardingContext);
}
