import { useState } from 'react'
import { AdminMessageForm } from './components/AdminMessageForm'
import { HistoriaMesManager } from './components/HistoriaMesManager'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState<'mensajes' | 'historia'>('mensajes')

  return (
    <main className="app-container">
      <h1>🚧 Dashboard Marketing</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setActiveView('mensajes')} style={{ marginRight: '1rem' }}>
          ✉️ Mensajería para Donadores
        </button>
        <button onClick={() => setActiveView('historia')}>
          📖 Historia del Mes
        </button>
      </div>

      {activeView === 'mensajes' && <AdminMessageForm />}
      {activeView === 'historia' && <HistoriaMesManager />}
    </main>
  )
}

export default App
