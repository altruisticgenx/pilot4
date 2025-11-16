import { createContext, useContext, useState, ReactNode } from 'react';

export interface PrefillData {
  name?: string;
  email?: string;
  organization?: string;
  role?: string;
  project_description?: string;
}

interface PrefillContextType {
  prefill: PrefillData;
  setPrefill: (data: PrefillData) => void;
  clearPrefill: () => void;
}

const PrefillContext = createContext<PrefillContextType | undefined>(undefined);

export function PrefillProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefillState] = useState<PrefillData>({});

  const setPrefill = (data: PrefillData) => {
    setPrefillState(data);
    // Scroll to contact form
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const clearPrefill = () => {
    setPrefillState({});
  };

  return (
    <PrefillContext.Provider value={{ prefill, setPrefill, clearPrefill }}>
      {children}
    </PrefillContext.Provider>
  );
}

export function usePrefill() {
  const context = useContext(PrefillContext);
  if (context === undefined) {
    throw new Error('usePrefill must be used within a PrefillProvider');
  }
  return context;
}
