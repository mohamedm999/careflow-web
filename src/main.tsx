import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import App from './App'
import Toaster from './components/common/Toaster'
import ErrorBoundary from './components/ErrorBoundary'
import { theme } from './theme'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
)