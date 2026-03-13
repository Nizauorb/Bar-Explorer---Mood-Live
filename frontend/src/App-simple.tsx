import { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:3000/api';

// Version simplifiée pour diagnostiquer
function AppSimple() {
  const [message, setMessage] = useState('Chargement...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Test API...');
        const response = await fetch(`${API_BASE_URL}/bars`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success) {
          setMessage(`✅ API OK! ${data.data.length} bars trouvés`);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError(`❌ Erreur API: ${err}`);
      }
    };

    testAPI();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#333', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          🍺 Bar Explorer - Test Diagnostique
        </h1>
        
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#666', marginBottom: '10px' }}>
            État de l'application
          </h2>
          
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>
            {message}
          </div>
          
          {error && (
            <div style={{ 
              color: '#d32f2f', 
              backgroundColor: '#ffebee',
              padding: '10px',
              borderRadius: '5px',
              marginTop: '10px'
            }}>
              <strong>Erreur:</strong> {error}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={() => window.location.href = 'http://localhost:3000/api/bars'}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🧪 Tester API Backend
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <small style={{ color: '#666' }}>
            Ouvre la console (F12) pour voir les détails
          </small>
        </div>
      </div>
    </div>
  );
}

export default AppSimple;
