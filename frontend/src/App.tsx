import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="bg-surface-dark text-text-inverse p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Bar Explorer - Mood Live</h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="be-card">
          <h2 className="be-heading-2 mb-4">Bienvenue sur Bar Explorer</h2>
          <p className="be-body mb-4">
            Trouvez les bars les plus animés selon l'ambiance en temps réel.
          </p>
          <div className="flex gap-4">
            <button className="be-btn be-btn-primary">
              Commencer
            </button>
            <button className="be-btn be-btn-secondary">
              En savoir plus
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
