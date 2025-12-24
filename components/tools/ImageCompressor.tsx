
import React, { useState, useRef } from 'react';

const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetKB, setTargetKB] = useState<number>(50);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setOriginalSize(selected.size);
      setCompressedUrl(null);
      setCompressedSize(null);
      if (selected.size > 1024 * 1024) setTargetKB(200);
      else setTargetKB(Math.max(1, Math.round((selected.size / 1024) * 0.5)));
    }
  };

  const compressToTarget = async () => {
    if (!file || !canvasRef.current) return;
    setIsProcessing(true);
    setStatus('Analyzing...');

    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = canvasRef.current;
    let width = img.width;
    let height = img.height;

    const targetBytes = targetKB * 1024;
    const pixelArea = width * height;
    const bytesPerPixel = targetBytes / pixelArea;

    if (bytesPerPixel < 0.1) {
      const scaleFactor = Math.sqrt(targetBytes / (pixelArea * 0.2));
      if (scaleFactor < 1) {
        width = Math.round(width * scaleFactor);
        height = Math.round(height * scaleFactor);
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    let min = 0.01;
    let max = 1.0;
    let bestBlob: Blob | null = null;
    let iterations = 0;

    setStatus('Optimizing...');
    
    while (iterations < 8) {
      const mid = (min + max) / 2;
      const blob: Blob = await new Promise((resolve) => 
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', mid)
      );

      if (blob.size > targetBytes) max = mid;
      else { min = mid; bestBlob = blob; }
      iterations++;
    }

    if (!bestBlob) {
       bestBlob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.01));
    }

    setCompressedUrl(URL.createObjectURL(bestBlob!));
    setCompressedSize(bestBlob!.size);
    setIsProcessing(false);
    setStatus('Finished!');
  };

  const startFresh = () => {
    setFile(null);
    setCompressedUrl(null);
    setCompressedSize(null);
    setTargetKB(50);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <canvas ref={canvasRef} className="hidden" />
      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[2rem] p-24 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
        >
          <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">📉</div>
          <p className="text-2xl font-black mb-3 text-slate-900 dark:text-white">Precision KB Compressor</p>
          <p className="text-slate-400 font-bold">Upload image to hit exact file size target</p>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} accept="image/jpeg,image/png" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Original File</span>
                <span className="text-[10px] font-bold text-blue-500 uppercase">{formatSize(originalSize)}</span>
              </div>
              <p className="font-black truncate text-slate-800 dark:text-white tracking-tight">{file.name}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="font-black text-xs uppercase tracking-widest text-slate-400">Target Size</label>
                <div className="flex items-center gap-2">
                   <input 
                    type="number"
                    value={targetKB}
                    onChange={(e) => setTargetKB(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-20 px-3 py-2 border-2 dark:bg-slate-900 border-slate-100 dark:border-slate-700 rounded-xl text-sm font-black focus:border-blue-500 outline-none text-center"
                  />
                  <span className="font-black text-blue-600">KB</span>
                </div>
              </div>
              <input 
                type="range" min="1" max="1000" step="1" 
                value={targetKB} 
                onChange={(e) => setTargetKB(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[10px] font-bold text-slate-400 leading-tight">
                * Our Anti-Blur technology reduces resolution only when necessary to preserve sharpness at extremely low file sizes.
              </p>
            </div>

            {!compressedUrl ? (
              <button 
                onClick={compressToTarget}
                disabled={isProcessing}
                className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 ${isProcessing ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 active:scale-[0.98]'}`}
              >
                {isProcessing && <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />}
                {isProcessing ? status : 'Calculate & Compress'}
              </button>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <a 
                  href={compressedUrl} 
                  download={`compressed-${targetKB}kb-${file.name}`}
                  className="block w-full text-center bg-green-600 text-white py-5 rounded-2xl font-black hover:bg-green-700 transition-all shadow-xl shadow-green-500/20 active:scale-[0.98]"
                >
                  Download Compressed
                </a>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => setCompressedUrl(null)}
                    className="py-4 border-2 border-slate-100 dark:border-slate-700 text-blue-600 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-xs uppercase tracking-widest"
                  >
                    Adjust KB
                  </button>
                  <button 
                    onClick={startFresh}
                    className="py-4 border-2 border-slate-100 dark:border-slate-700 text-slate-500 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-xs uppercase tracking-widest"
                  >
                    Start Fresh
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 overflow-hidden relative min-h-[400px]">
            {compressedUrl ? (
               <div className="text-center w-full">
                  <div className="absolute top-6 right-6 flex gap-2">
                     <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Final: {formatSize(compressedSize!)}</span>
                     <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">-{Math.round((1 - compressedSize!/originalSize) * 100)}%</span>
                  </div>
                  <img src={compressedUrl} alt="Compressed Result" className="max-w-full max-h-[450px] rounded-2xl shadow-2xl mx-auto" />
                  <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Final Preview Result</p>
               </div>
            ) : (
               <>
                 <span className="absolute top-6 left-6 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">Source Image</span>
                 <img src={URL.createObjectURL(file)} alt="Preview Original" className="max-w-full max-h-[450px] rounded-2xl shadow-xl opacity-80" />
               </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;
