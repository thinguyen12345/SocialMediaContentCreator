import { useState } from 'react';
import Services from './Services';
import Profile from './Profile';

function Dashboard({ phoneNumber }) {
  const [activeTab, setActiveTab] = useState('Services');

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-blue-600 text-white p-4 flex justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('Services')}
            className={`px-4 py-2 ${activeTab === 'Services' ? 'bg-blue-800' : ''}`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('Profile')}
            className={`px-4 py-2 ${activeTab === 'Profile' ? 'bg-blue-800' : ''}`}
          >
            Profile
          </button>
        </div>
        <div>{phoneNumber}</div>
      </div>
      <div className="flex-1 p-4">
        {activeTab === 'Services' && <Services phoneNumber={phoneNumber} />}
        {activeTab === 'Profile' && <Profile phoneNumber={phoneNumber} />}
      </div>
    </div>
  );
}

export default Dashboard;