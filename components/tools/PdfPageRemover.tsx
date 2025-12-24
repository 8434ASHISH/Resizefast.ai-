
import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Point to the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PageThumbnail {
  url: string;
  pageNum: number;
}

const PdfPageRemover: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setResultBlob(null);
      setThumbnails([]);
      setSelectedPages(new Set());
      await generateThumbnails(selected);
    }
  };

  const generateThumbnails = async (pdfFile: File) => {
    setIsProcessing(true);
    setStatus('Scanning PDF pages...');
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pagesCount = pdf.numPages;
      const thumbs: PageThumbnail[] = [];

      for (let i = 1; i <= pagesCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 }); // Low res for thumbs
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        thumbs.push({
          url: canvas.toDataURL('image/jpeg', 0.8),
          pageNum: i
        });
      }
      setThumbnails(thumbs);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF previews. The file might be corrupted or protected.");
    } finally {
      setIsProcessing(false);
      setStatus('');
    }
  };

  const togglePageSelection = (pageNum: number) => {
    if (isProcessing) return;
    const next = new Set(selectedPages);
    if (next.has(pageNum)) {
      next.delete(pageNum);
    } else {
      next.add(pageNum);
    }
    setSelectedPages(next);
  };

  const removePages = async () => {
    if (!file || selectedPages.size === 0) return;
    setIsProcessing(true);
    setStatus('Building new document...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();

      if (selectedPages.size >= totalPages) {
        alert("At least one page must remain in the PDF.");
        setIsProcessing(false);
        setStatus('');
        return;
      }

      // Important: Remove from highest index to lowest index
      // Added explicit casting to number for sort arithmetic to resolve TS errors
      const sortedToRemove = Array.from(selectedPages).sort((a: number, b: number) => (b as number) - (a as number));
      
      sortedToRemove.forEach(pageNum => {
        // PDF-lib indices are 0-based
        // Added explicit casting to number for arithmetic operation to resolve TS error
        pdf.removePage((pageNum as number) - 1);
      });
      
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultBlob(blob);
    } catch (err) {
      console.error(err);
      alert("An error occurred while modifying the PDF.");
    } finally {
      setIsProcessing(false);
      setStatus('');
    }
  };

  const startFresh = () => {
    setFile(null);
    setResultBlob(null);
    setThumbnails([]);
    setSelectedPages(new Set());
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-700 shadow-xl">
      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[2rem] p-24 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
        >
          <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">✂️</div>
          <p className="text-2xl font-black mb-3 text-slate-900 dark:text-white">PDF Page Remover</p>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Select and delete specific pages visually</p>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} accept=".pdf" />
        </div>
      ) : (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
             <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Source PDF</p>
                <h4 className="text-xl font-black text-slate-800 dark:text-white truncate">{file.name}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 uppercase font-bold">
                   {thumbnails.length} Total Pages • {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
             </div>
             
             <div className="flex gap-4 w-full md:w-auto">
               {!resultBlob ? (
                  <button 
                    onClick={removePages}
                    disabled={isProcessing || selectedPages.size === 0}
                    className={`flex-1 px-10 py-4 font-black rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 ${
                      selectedPages.size === 0 || isProcessing 
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20 active:scale-95'
                    }`}
                  >
                    {isProcessing ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : `Remove ${selectedPages.size} Selected`}
                  </button>
               ) : (
                 <div className="flex gap-4 w-full">
                    <a 
                      href={URL.createObjectURL(resultBlob)} 
                      download={`resizefast-modified-${file.name}`}
                      className="flex-1 px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl text-center shadow-xl shadow-green-500/20 active:scale-95 flex items-center justify-center gap-2 transition-all"
                    >
                      Download PDF
                    </a>
                    <button 
                      onClick={startFresh}
                      className="px-6 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-black rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Start Fresh
                    </button>
                 </div>
               )}
               {!resultBlob && !isProcessing && (
                  <button onClick={startFresh} className="px-6 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">✕</button>
               )}
             </div>
          </div>

          {!resultBlob && (
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">Page Selection</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Click on pages to mark them for removal.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedPages(new Set())}
                      className="text-xs font-black text-blue-600 uppercase hover:underline"
                    >
                      Deselect All
                    </button>
                    <span className="text-[10px] font-black uppercase text-white bg-red-600 px-4 py-1.5 rounded-full shadow-lg">
                      Removing {selectedPages.size}
                    </span>
                  </div>
               </div>

               {status && (
                 <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <p className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest animate-pulse">{status}</p>
                 </div>
               )}

               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 animate-in fade-in duration-500">
                  {thumbnails.map((thumb) => {
                    const isSelected = selectedPages.has(thumb.pageNum);
                    return (
                      <div 
                        key={thumb.pageNum}
                        onClick={() => togglePageSelection(thumb.pageNum)}
                        className={`group relative cursor-pointer rounded-2xl overflow-hidden border-4 transition-all duration-300 transform ${
                          isSelected 
                            ? 'border-red-500 scale-95 ring-4 ring-red-500/20' 
                            : 'border-white dark:border-slate-800 hover:border-blue-500 hover:shadow-2xl shadow-lg'
                        }`}
                      >
                        <img src={thumb.url} alt={`Page ${thumb.pageNum}`} className={`w-full h-auto transition-all ${isSelected ? 'opacity-30 grayscale' : 'opacity-100'}`} />
                        
                        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                           <span className="bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-2xl scale-110">REMOVING</span>
                        </div>
                        
                        <div className={`absolute bottom-0 inset-x-0 p-3 flex justify-between items-center transition-colors ${isSelected ? 'bg-red-600/80' : 'bg-black/60'} backdrop-blur-md`}>
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">Page {thumb.pageNum}</span>
                           <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center transition-colors ${isSelected ? 'bg-white' : ''}`}>
                             {isSelected && <span className="text-red-600 font-black text-xs">✕</span>}
                           </div>
                        </div>
                        
                        {/* Hover Overlay */}
                        {!isSelected && (
                          <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors pointer-events-none" />
                        )}
                      </div>
                    );
                  })}
               </div>
            </div>
          )}

          {resultBlob && (
             <div className="text-center py-20 bg-green-50 dark:bg-green-900/10 rounded-[3rem] border-2 border-dashed border-green-200 dark:border-green-800 animate-in zoom-in-95 duration-500 shadow-2xl shadow-green-500/5">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-8 shadow-xl shadow-green-500/20">✓</div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">PDF Modified Successfully!</h3>
                <p className="text-slate-600 dark:text-slate-400 font-bold mb-10 max-w-md mx-auto">Your pages have been removed securely. The new file is ready for download below.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                   <a 
                     href={URL.createObjectURL(resultBlob)} 
                     download={`resizefast-modified-${file.name}`}
                     className="px-12 py-5 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-2xl shadow-green-500/30 transition-all active:scale-95 text-lg"
                   >
                      Download Final PDF
                   </a>
                   <button 
                     onClick={startFresh}
                     className="px-12 py-5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-black rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-700 text-lg shadow-xl"
                   >
                      Start Again
                   </button>
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfPageRemover;
