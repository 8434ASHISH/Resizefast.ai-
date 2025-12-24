
import React, { useState } from 'react';

const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const formatJson = (spaces: number | string) => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, spaces));
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => formatJson(2)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            Beautify (2 Spaces)
          </button>
          <button 
            onClick={() => formatJson(4)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            Beautify (4 Spaces)
          </button>
          <button 
            onClick={() => formatJson(0)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Minify
          </button>
          <button 
            onClick={copyToClipboard}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-auto"
          >
            Copy
          </button>
          <button 
            onClick={() => { setInput(''); setError(''); }}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); if (error) setError(''); }}
            placeholder="Paste your JSON here..."
            className={`w-full h-[400px] p-6 font-mono text-sm bg-slate-50 dark:bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all`}
          />
          {error && (
            <div className="absolute bottom-4 right-4 left-4 p-3 bg-red-100 text-red-700 text-xs rounded-lg border border-red-200">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
