
import React, { useState, useRef, useEffect } from 'react';

const ImageResizer: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [quality, setQuality] = useState(0.92);
  const [dpi, setDpi] = useState(300);
  const [targetKb, setTargetKb] = useState<number | ''>('');
  const [format, setFormat] = useState('image/jpeg');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setWidth(img.width);
          setHeight(img.height);
          setAspectRatio(img.width / img.height);
          setResultUrl(null);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const updateWidth = (newWidth: number) => {
    setWidth(newWidth);
    if (lockAspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const updateHeight = (newHeight: number) => {
    setHeight(newHeight);
    if (lockAspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const handleProcess = async () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, 0, 0, width, height);
    
    // Logic for Target KB if specified
    let finalBlob: Blob | null = null;
    if (typeof targetKb === 'number' && targetKb > 0) {
      const targetBytes = targetKb * 1024;
      let min = 0.01;
      let max = 1.0;
      for (let i = 0; i < 8; i++) {
        const mid = (min + max) / 2;
        const b: Blob = await new Promise(r => canvas.toBlob(blob => r(blob!), format, mid));
        if (b.size > targetBytes) max = mid;
        else min = mid;
        finalBlob = b;
      }
    } else {
      finalBlob = await new Promise(r => canvas.toBlob(blob => r(blob!), format, quality));
    }

    if (finalBlob) {
      setResultUrl(URL.createObjectURL(finalBlob));
      setResultSize(finalBlob.size);
    }
  };

  const startFresh = () => {
    setImage(null);
    setResultUrl(null);
    setResultSize(null);
    setTargetKb('');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[2rem] p-24 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
          >
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">📐</div>
            <p className="text-2xl font-black mb-3">Resolution Scaler</p>
            <p className="text-slate-400 font-bold">Select high-res image to adjust dimensions and DPI</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Width (px)</label>
                  <input 
                    type="number" 
                    value={width} 
                    onChange={(e) => updateWidth(parseInt(e.target.value) || 0)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 font-bold outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Height (px)</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={(e) => updateHeight(parseInt(e.target.value) || 0)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 font-bold outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <input 
                  type="checkbox" 
                  id="lock" 
                  checked={lockAspectRatio} 
                  onChange={(e) => setLockAspectRatio(e.target.checked)} 
                  className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="lock" className="text-sm font-black text-slate-700 dark:text-slate-300 cursor-pointer select-none">Maintain Aspect Ratio</label>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">DPI</label>
                  <select 
                    value={dpi}
                    onChange={(e) => setDpi(parseInt(e.target.value))}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 font-bold outline-none focus:border-blue-500"
                  >
                    <option value={72}>72 (Web)</option>
                    <option value={150}>150 (Standard)</option>
                    <option value={300}>300 (Pro Print)</option>
                    <option value={600}>600 (Ultra High)</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Target KB (Optional)</label>
                  <input 
                    type="number" 
                    value={targetKb} 
                    onChange={(e) => setTargetKb(e.target.value === '' ? '' : parseInt(e.target.value))}
                    placeholder="e.g. 50"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 font-bold outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Export Format</label>
                <div className="flex gap-2">
                  {['image/jpeg', 'image/png', 'image/webp'].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${format === fmt ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}
                    >
                      {fmt.split('/')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {!resultUrl ? (
                <button 
                  onClick={handleProcess}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                >
                  Process Resolution
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-2">
                  <a 
                    href={resultUrl} 
                    download={`scaled-${width}x${height}.${format.split('/')[1]}`}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-2xl text-center shadow-xl shadow-green-500/20 transition-all"
                  >
                    Download File
                  </a>
                  <button 
                    onClick={startFresh}
                    className="flex-1 border-2 border-slate-200 dark:border-slate-700 text-slate-500 font-black py-5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                  >
                    Start Fresh
                  </button>
                </div>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 rounded-[2rem] p-8 flex flex-col items-center justify-center relative min-h-[400px] border border-slate-100 dark:border-slate-800">
               {resultUrl ? (
                 <div className="text-center w-full">
                    <p className="absolute top-6 right-6 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Result: {(resultSize!/1024).toFixed(1)} KB</p>
                    <img 
                      src={resultUrl} 
                      alt="Result Preview" 
                      className="max-w-full max-h-[400px] object-contain shadow-2xl rounded-xl mx-auto"
                    />
                    <button 
                      onClick={() => setResultUrl(null)}
                      className="mt-6 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
                    >
                      Adjust Settings Again
                    </button>
                 </div>
               ) : (
                 <>
                   <span className="absolute top-6 left-6 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">Preview</span>
                   <img 
                     src={image.src} 
                     alt="Original Preview" 
                     className="max-w-full max-h-[400px] object-contain shadow-2xl rounded-xl opacity-80"
                   />
                 </>
               )}
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageResizer;
