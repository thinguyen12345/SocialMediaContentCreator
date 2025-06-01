import { useState } from 'react';

function Login({ onLogin }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/create-access-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await response.json();
      if (data.accessCode) {
        setStep(2);
      } else {
        setError('Failed to generate access code');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/validate-access-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, accessCode }),
      });
      const data = await response.json();
      if (data.success) {
        onLogin(phoneNumber);
      } else {
        setError('Invalid access code');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {step === 1 ? (
          <form onSubmit={handlePhoneSubmit}>
            <h2 className="text-2xl mb-4">Enter Phone Number</h2>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full p-2 border rounded mb-4"
              required
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
              Send Access Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit}>
            <h2 className="text-2xl mb-4">Enter Access Code</h2>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="6-digit code"
              className="w-full p-2 border rounded mb-4"
              required
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
              Validate Code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;