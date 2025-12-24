
import React, { useState, useRef, useEffect } from 'react';

const FormatConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('image/png');
  const [targetKb, setTargetKb] = useState<number | ''>('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string>('free'); // 'free', '1:1', '4:3', '16:9'
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formats = [
    { label: 'PNG', mime: 'image/png' },
    { label: 'JPEG', mime: 'image/jpeg' },
    { label: 'WebP', mime: 'image/webp' },
    { label: 'BMP', mime: 'image/bmp' }
  ];

  const aspectRatios = [
    { label: 'Original', value: 'free' },
    { label: '1:1 Square', value: '1:1' },
    { label: '4:3 Standard', value: '4:3' },
    { label: '16:9 Cinema', value: '16:9' }
  ];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const url = URL.createObjectURL(selected);
      const img = new Image();
      img.onload = () => {
        setImgElement(img);
        setFile(selected);
        setResultUrl(null);
      };
      img.src = url;
    }
  };

  const convertImage = async () => {
    if (!imgElement) return;
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    let targetWidth = imgElement.width;
    let targetHeight = imgElement.height;

    // Smart auto-crop based on aspect ratio preset
    if (aspectRatio !== 'free') {
      const [w, h] = aspectRatio.split(':').map(Number);
      const targetRatio = w / h;
      const currentRatio = imgElement.width / imgElement.height;

      if (currentRatio > targetRatio) {
        // Source is wider than target
        targetWidth = imgElement.height * targetRatio;
      } else {
        // Source is taller than target
        targetHeight = imgElement.width / targetRatio;
      }
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d')!;
    
    // Center crop coordinates
    const sx = (imgElement.width - targetWidth) / 2;
    const sy = (imgElement.height - targetHeight) / 2;

    ctx.drawImage(
      imgElement,
      sx, sy, targetWidth, targetHeight,
      0, 0, targetWidth, targetHeight
    );

    let finalBlob: Blob;
    if (typeof targetKb === 'number' && targetKb > 0) {
      const targetBytes = targetKb * 1024;
      let min = 0.01;
      let max = 1.0;
      let best: Blob | null = null;
      for (let i = 0; i < 8; i++) {
        const mid = (min + max) / 2;
        const b: Blob = await new Promise((r) => canvas.toBlob((blob) => r(blob!), targetFormat, mid));
        if (b.size > targetBytes) max = mid;
        else { min = mid; best = b; }
      }
      finalBlob = best || await new Promise((r) => canvas.toBlob((blob) => r(blob!), targetFormat, 0.01));
    } else {
      finalBlob = await new Promise((resolve) => 
        canvas.toBlob((b) => resolve(b!), targetFormat, 0.95)
      );
    }

    setResultUrl(URL.createObjectURL(finalBlob));
    setIsProcessing(false);
  };

  const startFresh = () => {
    setFile(null);
    setResultUrl(null);
    setImgElement(null);
    setAspectRatio('free');
    setTargetKb('');
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[2rem] p-24 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
        >
          <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🔄</div>
          <p className="text-2xl font-black mb-3 text-slate-900 dark:text-white">Format Converter & Cropper</p>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Instantly switch formats and adjust cropping presets</p>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} accept="image/*" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
               <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-2 tracking-widest">Source Configuration</p>
               <h4 className="font-black text-slate-800 dark:text-white truncate">{file.name}</h4>
               <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 uppercase font-bold">{(file.size / 1024).toFixed(1)} KB • {imgElement?.width}x{imgElement?.height}</p>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Crop Presets (Auto-Centered)</label>
              <div className="grid grid-cols-2 gap-2">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.value}
                    onClick={() => {setAspectRatio(ar.value); setResultUrl(null);}}
                    className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all ${aspectRatio === ar.value ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Target Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {formats.map((f) => (
                    <button
                      key={f.mime}
                      onClick={() => {setTargetFormat(f.mime); setResultUrl(null);}}
                      className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all ${targetFormat === f.mime ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Target Size (KB)</label>
                <input 
                  type="number" 
                  value={targetKb} 
                  onChange={(e) => setTargetKb(e.target.value === '' ? '' : parseInt(e.target.value))}
                  placeholder="Unlimited"
                  className="w-full px-4 py-3 rounded-xl border-2 dark:bg-slate-900 border-slate-100 dark:border-slate-700 font-black outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {!resultUrl ? (
              <button 
                onClick={convertImage}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Convert & Process'}
              </button>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                <a 
                  href={resultUrl} 
                  download={`resizefast-${Date.now()}.${targetFormat.split('/')[1]}`}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-2xl text-center shadow-xl shadow-green-500/20 active:scale-95 transition-all text-lg"
                >
                  Download Resulting File
                </a>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setResultUrl(null)}
                    className="py-4 border-2 border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-xs uppercase tracking-widest"
                  >
                    Adjust Again
                  </button>
                  <button 
                    onClick={startFresh}
                    className="py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-xs uppercase tracking-widest"
                  >
                    Start Fresh
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 min-h-[400px] relative overflow-hidden shadow-inner">
             {resultUrl ? (
                <div className="text-center w-full">
                  <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4 tracking-widest shadow-lg">Processing Complete</span>
                  <img src={resultUrl} alt="Result" className="max-w-full max-h-[400px] rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800 mx-auto" />
                </div>
             ) : (
                <div className="text-center w-full">
                   <div className="relative inline-block mx-auto max-w-full group">
                      <img src={imgElement?.src} alt="Original" className="max-w-full max-h-[400px] rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-800 mx-auto transition-opacity" />
                      {aspectRatio !== 'free' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className="border-4 border-blue-500 border-dashed w-3/4 h-3/4 rounded-lg opacity-40 animate-pulse"></div>
                        </div>
                      )}
                   </div>
                   <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                     {aspectRatio !== 'free' ? `Auto-cropping to ${aspectRatio} ratio` : 'Original dimensions preserved'}
                   </p>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormatConverter;
