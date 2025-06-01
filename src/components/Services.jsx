import { useState } from 'react';

function Services({ phoneNumber }) {
  const [option, setOption] = useState('');
  const [socialNetwork, setSocialNetwork] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [captions, setCaptions] = useState([]);
  const [postIdeas, setPostIdeas] = useState([]);
  const [selectedIdeas, setSelectedIdeas] = useState([]);

  const handleGenerateCaptions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/generate-post-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialNetwork, subject: topic, tone }),
      });
      const data = await response.json();
      setCaptions(data.captions);
    } catch (err) {
      console.error('Error generating captions:', err);
    }
  };

  const handleGeneratePostIdeas = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/get-post-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      setPostIdeas(data.ideas);
    } catch (err) {
      console.error('Error generating post ideas:', err);
    }
  };

  const handleCreateCaptionsFromIdeas = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/create-captions-from-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: selectedIdeas.join(', ') }),
      });
      const data = await response.json();
      setCaptions(data.captions);
    } catch (err) {
      console.error('Error creating captions from ideas:', err);
    }
  };

  const handleSaveCaption = async (caption) => {
    try {
      await fetch('http://localhost:3001/api/save-generated-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, data: caption, phoneNumber }),
      });
      alert('Caption saved!');
    } catch (err) {
      console.error('Error saving caption:', err);
    }
  };

  const handleShareCaption = (caption) => {
    // Simulate sharing (Facebook SDK or email client would be integrated here)
    alert(`Sharing caption: ${caption}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">Services</h2>
      <div className="mb-4">
        <button
          onClick={() => setOption('captions')}
          className="mr-4 bg-blue-500 text-white p-2 rounded"
        >
          Create Captions
        </button>
        <button
          onClick={() => setOption('ideas')}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Get Post Ideas
        </button>
      </div>

      {option === 'captions' && (
        <div className="mb-4">
          <select
            value={socialNetwork}
            onChange={(e) => setSocialNetwork(e.target.value)}
            className="p-2 border rounded mr-2"
          >
            <option value="">Select Social Network</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
          </select>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic"
            className="p-2 border rounded mr-2"
          />
          <input
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="Enter tone (e.g., casual, professional)"
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={handleGenerateCaptions}
            className="bg-green-500 text-white p-2 rounded"
          >
            Generate Captions
          </button>
        </div>
      )}

      {option === 'ideas' && (
        <div className="mb-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic"
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={handleGeneratePostIdeas}
            className="bg-green-500 text-white p-2 rounded"
          >
            Generate Post Ideas
          </button>
          {postIdeas.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl mb-2">Post Ideas</h3>
              {postIdeas.map((idea, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="checkbox"
                    checked={selectedIdeas.includes(idea)}
                    onChange={() => {
                      setSelectedIdeas((prev) =>
                        prev.includes(idea)
                          ? prev.filter((i) => i !== idea)
                          : [...prev, idea],
                      );
                    }}
                  />
                  <span className="ml-2">{idea}</span>
                </div>
              ))}
              <button
                onClick={handleCreateCaptionsFromIdeas}
                className="bg-blue-500 text-white p-2 rounded mt-2"
              >
                Create Captions from Selected Ideas
              </button>
            </div>
          )}
        </div>
      )}

      {captions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl mb-2">Generated Captions</h3>
          {captions.map((caption, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <p>{caption}</p>
              <button
                onClick={() => handleSaveCaption(caption)}
                className="bg-blue-500 text-white p-1 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => handleShareCaption(caption)}
                className="bg-green-500 text-white p-1 rounded"
              >
                Share
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Services;