
import React, { useState } from 'react';

const TextConverter: React.FC = () => {
  const [text, setText] = useState('');

  const convert = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
    switch (type) {
      case 'upper':
        setText(text.toUpperCase());
        break;
      case 'lower':
        setText(text.toLowerCase());
        break;
      case 'title':
        setText(text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '));
        break;
      case 'sentence':
        setText(text.toLowerCase().replace(/(^\w|\.\s+\w)/gm, s => s.toUpperCase()));
        break;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => convert('upper')}
            className="py-3 bg-slate-100 dark:bg-slate-900 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            UPPERCASE
          </button>
          <button 
            onClick={() => convert('lower')}
            className="py-3 bg-slate-100 dark:bg-slate-900 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            lowercase
          </button>
          <button 
            onClick={() => convert('title')}
            className="py-3 bg-slate-100 dark:bg-slate-900 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Title Case
          </button>
          <button 
            onClick={() => convert('sentence')}
            className="py-3 bg-slate-100 dark:bg-slate-900 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Sentence case
          </button>
        </div>

        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
        />

        <div className="flex justify-between items-center text-sm text-slate-400">
          <div>
            Characters: {text.length} | Words: {text.trim() ? text.trim().split(/\s+/).length : 0}
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(text)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Copy Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextConverter;
