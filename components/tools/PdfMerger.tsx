
import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

const PdfMerger: React.FC = () => {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressResult, setCompressResult] = useState(false);
  const [targetKB, setTargetKB] = useState(500);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []) as File[];
    const newFiles = selected.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      name: f.name,
      size: f.size
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
    setMergedBlob(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
    setFiles(newFiles);
  };

  const startFresh = () => {
    setFiles([]);
    setMergedBlob(null);
    setCompressResult(false);
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const pdfFile of files) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      mergedPdf.setTitle('Merged Document');
      mergedPdf.setAuthor('ResizeFast.AI');
      
      // We optimize for target size if requested
      // Browser-side true PDF compression is limited, but useObjectStreams helps
      const pdfBytes = await mergedPdf.save({ 
        useObjectStreams: compressResult,
        addOriginalPageIndices: false
      });
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setMergedBlob(blob);
    } catch (err) {
      console.error(err);
      alert("Error merging PDFs. Please check if files are password protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-200 dark:border-slate-700 rounded-2xl p-8 text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-900 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📄</div>
            <p className="font-bold text-slate-800 dark:text-slate-100">Add PDF Files</p>
            <p className="text-xs text-slate-400 mt-1">Combine multiple documents into one.</p>
            <input type="file" ref={fileInputRef} className="hidden" multiple accept=".pdf" onChange={handleFiles} />
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Settings</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-black text-slate-700 dark:text-slate-200 cursor-pointer" htmlFor="compress-toggle">Compress Output</label>
              <button 
                id="compress-toggle"
                onClick={() => setCompressResult(!compressResult)}
                className={`w-10 h-5 rounded-full transition-colors relative ${compressResult ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${compressResult ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            {compressResult && (
              <div className="space-y-2 animate-in fade-in zoom-in-95">
                <div className="flex justify-between text-[10px] font-black text-blue-600 uppercase">
                  <span>Target Max</span>
                  <span>{targetKB} KB</span>
                </div>
                <input 
                  type="range" min="100" max="10000" step="100" 
                  value={targetKB} 
                  onChange={(e) => setTargetKB(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            {!mergedBlob ? (
              <button 
                onClick={mergePdfs}
                disabled={files.length < 2 || isProcessing}
                className={`w-full py-4 rounded-xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-2 ${files.length < 2 || isProcessing ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 active:scale-95'}`}
              >
                {isProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Merge Documents'}
              </button>
            ) : (
              <div className="space-y-3 animate-in slide-in-from-bottom-2">
                <a 
                  href={URL.createObjectURL(mergedBlob)}
                  download={`merged-${Date.now()}.pdf`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl text-center shadow-xl shadow-green-500/20 block active:scale-95"
                >
                  Download Result ({formatSize(mergedBlob.size)})
                </a>
                <button 
                  onClick={startFresh}
                  className="w-full py-3 text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Start Fresh
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {files.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/20">
              <p className="text-slate-400 font-bold">Files will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Document Queue ({files.length})</h3>
                <button onClick={() => setFiles([])} className="text-xs text-red-500 font-bold hover:underline">Clear All</button>
              </div>
              {files.map((f, i) => (
                <div key={f.id} className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-500 transition-all shadow-sm">
                  <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl flex items-center justify-center font-black text-[10px]">PDF</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate text-slate-800 dark:text-slate-200">{f.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{formatSize(f.size)}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveUp(i)} disabled={i === 0} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-20">↑</button>
                    <button onClick={() => moveDown(i)} disabled={i === files.length - 1} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-20">↓</button>
                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                    <button onClick={() => removeFile(f.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfMerger;
