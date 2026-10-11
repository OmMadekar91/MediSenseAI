import React, { useState } from 'react';
import axios from 'axios';

function ReportAnalyzer({ apiUrl }) {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${apiUrl}/parse`, formData);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Analyze Medical Report</h2>
        <div className="flex gap-4 items-center">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Analyzing...' : 'Upload'}
          </button>
        </div>
        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      </div>

      {results && (
        <div className="grid gap-6">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-blue-800 text-sm">
            <strong>File:</strong> {results.filename} | <strong>Pages:</strong> {results.page_count}
            <p className="mt-1">{results.message}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.results?.map((res, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-700 uppercase text-xs tracking-wider">{res.test_name}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    res.status === 'within_reported_range' ? 'bg-green-100 text-green-700' :
                    res.status === 'above_reported_range' ? 'bg-red-100 text-red-700' :
                    res.status === 'below_reported_range' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {res.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {res.observed_value} <span className="text-sm font-normal text-gray-500">{res.unit}</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Range: {res.reference_range ? `${res.reference_range.low} - ${res.reference_range.high}` : 'Not provided'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportAnalyzer;
