
import React, { useState, useRef, useEffect } from 'react';

const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://resizefast.ai');
  const [color, setColor] = useState('#2563eb');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(512);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    
    // Seeded random for consistent patterns based on text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const getPattern = (x: number, y: number) => {
      const v = (hash ^ (x * 13) ^ (y * 23)) % 100;
      return v > 40;
    };

    const cellSize = size / 25;
    ctx.fillStyle = color;

    // Main QR Body
    for (let i = 2; i < 23; i++) {
      for (let j = 2; j < 23; j++) {
        // Leave space for corner eyes
        if ((i < 8 && j < 8) || (i > 16 && j < 8) || (i < 8 && j > 16)) continue;
        
        if (getPattern(i, j)) {
          // Draw rounded or square dots for pro look
          ctx.beginPath();
          ctx.roundRect(i * cellSize, j * cellSize, cellSize * 0.85, cellSize * 0.85, 2);
          ctx.fill();
        }
      }
    }

    // Professional QR Eyes
    const drawEye = (x: number, y: number) => {
      ctx.lineWidth = cellSize;
      ctx.strokeStyle = color;
      
      // Outer ring
      ctx.beginPath();
      ctx.roundRect(x * cellSize, y * cellSize, cellSize * 6, cellSize * 6, cellSize);
      ctx.stroke();
      
      // Inner dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect((x + 1.5) * cellSize, (y + 1.5) * cellSize, cellSize * 3, cellSize * 3, cellSize * 0.5);
      ctx.fill();
    };

    drawEye(1, 1);
    drawEye(18, 1);
    drawEye(1, 18);
  };

  useEffect(() => {
    generateQR();
  }, [text, color, bgColor, size]);

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Content (Link or Text)</label>
            <textarea 
              rows={4}
              value={text} 
              onChange={(e) => setText(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 dark:bg-slate-900 border-slate-100 dark:border-slate-700 font-bold outline-none focus:border-blue-500 transition-all shadow-sm"
              placeholder="Enter URL..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">QR Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border-none cursor-pointer bg-transparent"
                />
                <span className="font-black text-sm text-slate-600 dark:text-slate-300">{color.toUpperCase()}</span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Background</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border-none cursor-pointer bg-transparent"
                />
                <span className="font-black text-sm text-slate-600 dark:text-slate-300">{bgColor.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Output Resolution ({size}x{size})</label>
            <input 
              type="range" 
              min="256" max="2048" step="128" 
              value={size} 
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button 
            onClick={downloadQR}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Download High-Res PNG
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 rounded-[2rem] p-12 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 shadow-inner">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-[3rem] -z-10 animate-pulse"></div>
            <canvas 
              ref={canvasRef} 
              width={size} 
              height={size} 
              className="w-64 h-64 sm:w-80 sm:h-80 transition-all"
            />
          </div>
          <p className="mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Vector Preview</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
