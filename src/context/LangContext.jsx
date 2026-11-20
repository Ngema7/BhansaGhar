import { createContext, useContext, useState, useMemo } from 'react';

const LangContext = createContext({ lang: 'EN', setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState('EN');
  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
