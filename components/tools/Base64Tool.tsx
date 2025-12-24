
import React, { useState } from 'react';

const Base64Tool: React.FC = () => {
  const [text, setText] = useState('');
  const [base64, setBase64] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleProcess = () => {
    try {
      if (mode === 'encode') {
        setBase64(btoa(text));
      } else {
        setText(atob(base64));
      }
    } catch (e) {
      alert('Invalid input for conversion');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Strip data prefix
        const base = result.split(',')[1] || result;
        setBase64(base);
        setMode('encode');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setMode('encode')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'encode' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-700'}`}
        >
          Encode
        </button>
        <button 
          onClick={() => setMode('decode')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'decode' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-700'}`}
        >
          Decode
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold">Plain Text</label>
            {mode === 'encode' && (
              <label className="text-xs text-blue-600 cursor-pointer hover:underline">
                Upload File instead
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold">Base64</label>
            <button 
              onClick={() => {
                const val = mode === 'encode' ? base64 : text;
                navigator.clipboard.writeText(val);
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Copy Result
            </button>
          </div>
          <textarea
            rows={10}
            value={base64}
            onChange={(e) => setBase64(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Base64 output..."
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={handleProcess}
          className="px-12 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
        >
          {mode === 'encode' ? 'Encode to Base64' : 'Decode to Text'}
        </button>
      </div>
    </div>
  );
};

export default Base64Tool;
