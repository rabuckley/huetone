import React, {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
  FC,
} from 'react'

type ColorScheme = 'light' | 'dark'
const KEY = 'theme'

const SchemeContext = createContext<[ColorScheme, () => void]>([
  getCurrent(),
  () => {},
])

export const ColorSchemeProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scheme, setScheme] = useState(getCurrent())

  const toggle = useCallback(() => {
    const current = getCurrent()
    const systemPreference = getSystemPreference()

    if (current === systemPreference) {
      localStorage.setItem(KEY, current === 'light' ? 'dark' : 'light')
    } else {
      localStorage.removeItem('theme')
      localStorage.removeItem(KEY)
    }

    if (current === 'light') {
      window.document.documentElement.classList.remove('light')
      window.document.documentElement.classList.add('dark')
    } else {
      window.document.documentElement.classList.remove('dark')
      window.document.documentElement.classList.add('light')
    }

    setScheme(getCurrent())
  }, [])

  // Add handler to update on local value change
  useEffect(() => {
    const updateValue = (e: StorageEvent) => {
      if (e.key === KEY) setScheme(getCurrent())
    }

    window.addEventListener('storage', updateValue)
    return () => window.removeEventListener('storage', updateValue)
  })

  // Add handler to update on prefers-color-scheme change
  useEffect(() => {
    const updateValue = () => setScheme(getCurrent())

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', updateValue)
    return () =>
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', updateValue)
  })
  return (
    <SchemeContext.Provider value={[scheme, toggle]}>
      {children}
    </SchemeContext.Provider>
  )
}

export const useColorScheme = () => useContext(SchemeContext)

function getCurrent(key = KEY): ColorScheme {
  const current = getLocalPreference() || getSystemPreference()
  window.document.documentElement.classList.add(current)
  return current
}

function getSystemPreference(): ColorScheme {
  return window?.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getLocalPreference(): ColorScheme | null {
  const localPreference = localStorage.getItem(KEY)
  if (localPreference === 'light' || localPreference === 'dark') {
    return localPreference
  }
  return null
}
