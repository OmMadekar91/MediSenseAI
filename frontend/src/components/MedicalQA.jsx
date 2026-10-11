import React, { useState } from 'react';
import axios from 'axios';

function MedicalQA({ apiUrl }) {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = { role: 'user', text: question };
    setChat(prev => [...prev, userMsg]);
    setLoading(true);
    setQuestion('');

    try {
      const response = await axios.post(`${apiUrl}/ask`, {
        question: question,
        top_k: 3
      });

      const data = response.data;
      setChat(prev => [...prev, {
        role: 'ai',
        text: data.answer,
        sources: data.sources,
        requiresReview: data.requires_review
      }]);
    } catch {
      setChat(prev => [...prev, {
        role: 'ai',
        text: 'Sorry, the AI service is currently unavailable.',
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        {chat.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p>Ask a general medical question grounded in our references.</p>
            <p className="text-xs mt-2">Example: "What are the signs of anemia?"</p>
          </div>
        )}
        {chat.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Sources:</span>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((s, sIdx) => (
                      <div key={sIdx} className="text-[10px] bg-white p-1 rounded border border-gray-300 text-gray-600">
                        {s.title} ({s.organization})
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {msg.requiresReview && (
                <div className="mt-2 text-[10px] text-amber-600 font-medium italic">
                  ⚠ This response requires clinical verification.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a medical question..."
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? '...' : 'Ask'}
        </button>
      </form>
    </div>
  );
}

export default MedicalQA;
