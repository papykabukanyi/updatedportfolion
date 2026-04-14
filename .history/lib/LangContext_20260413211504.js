'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const SUPPORTED = ['en', 'fr', 'es', 'ru', 'sw']

// Maps browser locale prefix → supported language code
const LOCALE_MAP = {
  fr: 'fr',
  es: 'es',
  ru: 'ru',
  be: 'ru', // Belarusian — Russian is widely used
  kk: 'ru', // Kazakh — Russian widely used
  uk: 'ru', // Ukrainian — Russian widely understood
  sw: 'sw',
}

function detectLang() {
  // 1. Respect any saved user preference
  try {
    const saved = localStorage.getItem('pk-lang')
    if (SUPPORTED.includes(saved)) return saved
  } catch (_) {}

  // 2. Walk browser language list and return first match
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const locale of langs) {
    const prefix = locale.split('-')[0].toLowerCase()
    if (SUPPORTED.includes(prefix)) return prefix
    if (LOCALE_MAP[prefix]) return LOCALE_MAP[prefix]
  }

  return 'en'
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('en')

  useEffect(() => {
    setLangState(detectLang())
  }, [])

  const setLang = (l) => {
    setLangState(l)
    try { localStorage.setItem('pk-lang', l) } catch (_) {}
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
