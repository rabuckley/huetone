import React from 'react'
import { createRoot } from 'react-dom/client'
import { ColorSchemeProvider } from 'shared/hooks/useColorScheme'
import GlobalStyles from 'components/GlobalStyles'
import App from 'components/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import './styles.scss'

const container = document.getElementById('root')
createRoot(container!).render(
  <React.StrictMode>
    <ColorSchemeProvider>
      <GlobalStyles />
      <App />
    </ColorSchemeProvider>
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()
