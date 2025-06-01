import { useState, useEffect } from 'react';

function Profile({ phoneNumber }) {
  const normalizedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  const [contents, setContents] = useState([]);

  useEffect(() => {
    console.log('Profile phoneNumber:', phoneNumber, 'Normalized:', normalizedPhone);
    const fetchContents = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/get-user-generated-contents?phone_number=${normalizedPhone}`,
        );
        const data = await response.json();
        console.log('Fetch contents response:', response.data);
        setContents(data.contents);
      } catch (err) {
        console.error('Error fetching contents:', err);
      }
    };
    fetchContents();
  }, [phoneNumber]);

  const handleUnsaveContent = async (captionId) => {
    try {
      await fetch('http://localhost:3001/api/unsave-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captionId }),
      });
      setContents((prev) => prev.filter((content) => content.id !== captionId));
    } catch (err) {
      console.error('Error unsaving content:', err);
    }
  };

  const handleShareContent = (caption) => {
    // Simulate sharing (Facebook SDK or email client would be integrated here)
    alert(`Sharing content: ${caption}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">Profile</h2>
      <h3 className="text-xl mb-2">Saved Content</h3>
      {contents.length === 0 ? (
        <p>No saved content.</p>
      ) : (
        contents.map((content) => (
          <div key={content.id} className="mb-2 p-2 border rounded">
            <p><strong>Topic:</strong> {content.topic}</p>
            <p><strong>Caption:</strong> {content.data}</p>
            <button
              onClick={() => handleUnsaveContent(content.id)}
              className="bg-red-500 text-white p-1 rounded mr-2"
            >
              Unsave
            </button>
            <button
              onClick={() => handleShareContent(content.data)}
              className="bg-green-500 text-white p-1 rounded"
            >
              Share
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;