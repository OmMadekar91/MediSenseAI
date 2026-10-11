import React from 'react';

function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
        <span className="text-xl font-bold text-gray-800">MediSense AI</span>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`px-4 py-2 rounded-md transition ${activeTab === 'analyzer' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Report Analyzer
        </button>
        <button
          onClick={() => setActiveTab('qa')}
          className={`px-4 py-2 rounded-md transition ${activeTab === 'qa' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Medical Q&A
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
