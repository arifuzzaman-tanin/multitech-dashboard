import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './assets/styles/main.scss'

createRoot(document.getElementById('root')!).render(
  <App />,
)
