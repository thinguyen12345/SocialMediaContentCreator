import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const storedPhone = localStorage.getItem('phoneNumber');
    console.log('Stored phoneNumber:', storedPhone);
    if (storedPhone) {
      setPhoneNumber(storedPhone);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (phone) => {
    setPhoneNumber(phone);
    setIsAuthenticated(true);
    localStorage.setItem('phoneNumber', phone);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated ? (
        <Dashboard phoneNumber={phoneNumber} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;