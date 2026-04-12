'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('pk-lang')
    if (saved === 'en' || saved === 'fr') setLangState(saved)
  }, [])

  const setLang = (l) => {
    setLangState(l)
    localStorage.setItem('pk-lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
