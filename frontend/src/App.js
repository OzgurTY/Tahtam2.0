import React, { useState } from 'react';
import axios from 'axios'; // axios'u import ediyoruz
import './App.css';

function App() {
  // Backend'den gelen mesajı tutmak için bir "state" (durum)
  const [message, setMessage] = useState("Henüz backend'den bir mesaj alınmadı.");
  const [loading, setLoading] = useState(false);

  // Backend'i test edecek fonksiyon
  const testBackend = () => {
    setLoading(true);
    setMessage("Backend'e bağlanılıyor...");

    axios.get("http://localhost:2000/api/test")
      .then(response => {
        // Başarılı olursa, gelen veriyi (response.data) state'e ata
        setMessage(response.data);
        setLoading(false);
      })
      .catch(error => {
        // Hata olursa, hata mesajını state'e ata
        console.error("Backend'e bağlanırken hata oluştu!", error);
        setMessage("Hata: Backend'e bağlanılamadı. (Konsolu kontrol edin)");
        setLoading(false);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tahtam2.0 Frontend'e Hoş Geldiniz</h1>

        {/* Backend'i test etmek için düğme */}
        <button onClick={testBackend} disabled={loading}>
          {loading ? "Bağlanılıyor..." : "Backend Bağlantısını Test Et"}
        </button>

        {/* Backend'den gelen mesajın gösterileceği yer */}
        <p style={{ marginTop: '20px', padding: '10px', background: '#282c34', border: '1px solid #61dafb' }}>
          <strong>Backend Mesajı:</strong> {message}
        </p>
      </header>
    </div>
  );
}

export default App;