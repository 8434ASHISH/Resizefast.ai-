
import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Point to the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PagePreview {
  url: string;
  pageNum: number;
  size: number;
}

const PdfToImage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previews, setPreviews] = useState<PagePreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [quality, setQuality] = useState(2); // DPI multiplier
  const [targetKb, setTargetKb] = useState<number | ''>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviews([]);
    }
  };

  const extractPages = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus('Loading PDF...');
    setPreviews([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pagesCount = pdf.numPages;
      const extracted: PagePreview[] = [];

      for (let i = 1; i <= pagesCount; i++) {
        setStatus(`Rendering page ${i}/${pagesCount}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: quality });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        
        let finalUrl: string;
        let finalSize: number;

        if (typeof targetKb === 'number' && targetKb > 0) {
          const targetBytes = targetKb * 1024;
          let min = 0.01;
          let max = 1.0;
          let best: Blob | null = null;
          for (let iter = 0; iter < 6; iter++) {
            const mid = (min + max) / 2;
            const b: Blob = await new Promise((r) => canvas.toBlob((blob) => r(blob!), 'image/jpeg', mid));
            if (b.size > targetBytes) max = mid;
            else { min = mid; best = b; }
          }
          const finalBlob = best || await new Promise((r) => canvas.toBlob((blob) => r(blob!), 'image/jpeg', 0.01));
          finalUrl = URL.createObjectURL(finalBlob);
          finalSize = finalBlob.size;
        } else {
          finalUrl = canvas.toDataURL('image/jpeg', 0.95);
          finalSize = 0; // Not strictly needed for simple base64
        }

        extracted.push({
          url: finalUrl,
          pageNum: i,
          size: finalSize
        });
      }

      setPreviews(extracted);
      setStatus('Done!');
    } catch (err) {
      console.error(err);
      alert("Failed to process PDF. It might be corrupted or protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  const startFresh = () => {
    setFile(null);
    setPreviews([]);
    setStatus('');
    setTargetKb('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[2rem] p-24 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
        >
          <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🖼️</div>
          <p className="text-2xl font-black mb-3 text-slate-900 dark:text-white">PDF to Image</p>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Extract all pages from a PDF as high-quality JPGs</p>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} accept=".pdf" />
        </div>
      ) : (
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
             <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Target File</p>
                <h4 className="text-xl font-black text-slate-800 dark:text-white truncate">{file.name}</h4>
             </div>
             <div className="flex flex-col gap-2 w-full md:w-auto">
                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Quality (DPI)</label>
                <select 
                   value={quality} 
                   onChange={(e) => setQuality(parseFloat(e.target.value))}
                   className="px-6 py-3 rounded-xl border-2 dark:bg-slate-800 border-slate-100 dark:border-slate-700 font-black outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                >
                   <option value={1}>72 DPI (Fast)</option>
                   <option value={2}>150 DPI (Standard)</option>
                   <option value={4}>300 DPI (High-Res)</option>
                </select>
             </div>
             <div className="flex flex-col gap-2 w-full md:w-auto">
                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Target Size (KB)</label>
                <input 
                  type="number"
                  value={targetKb}
                  onChange={(e) => setTargetKb(e.target.value === '' ? '' : parseInt(e.target.value))}
                  placeholder="Optional KB"
                  className="px-6 py-3 rounded-xl border-2 dark:bg-slate-800 border-slate-100 dark:border-slate-700 font-black outline-none focus:border-blue-500 w-32 text-slate-900 dark:text-white"
                />
             </div>
             <div className="flex gap-4 w-full md:w-auto self-end">
               <button 
                  onClick={extractPages} 
                  disabled={isProcessing}
                  className="flex-1 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
               >
                  {isProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Extract Pages'}
               </button>
               <button onClick={startFresh} className="px-6 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">✕</button>
             </div>
          </div>

          {status && !previews.length && (
            <div className="text-center py-20 animate-pulse">
               <p className="text-lg font-black text-blue-600 uppercase tracking-widest">{status}</p>
            </div>
          )}

          {previews.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Extracted Pages ({previews.length})</h3>
                <button 
                   onClick={startFresh}
                   className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
                >
                   Process Another PDF
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {previews.map((p, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 group overflow-hidden">
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <img src={p.url} alt={`Page ${p.pageNum}`} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                         <a 
                            href={p.url} 
                            download={`page-${p.pageNum}.jpg`}
                            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-black shadow-2xl"
                         >
                            Download Page
                         </a>
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <div>
                        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Page {p.pageNum}</span>
                        {p.size > 0 && <p className="text-[10px] text-blue-500 font-bold uppercase">{(p.size/1024).toFixed(1)} KB</p>}
                      </div>
                      <a href={p.url} download={`page-${p.pageNum}.jpg`} className="text-blue-600 dark:text-blue-400 text-lg">⬇️</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfToImage;
