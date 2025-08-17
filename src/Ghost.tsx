import { useState, useRef, useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { PhysicalSize, PhysicalPosition } from '@tauri-apps/api/window';
import './Ghost.css';

interface GhostProps {
  ghostName?: string;
}

const Ghost: React.FC<GhostProps> = ({ ghostName = 'N_HokanSakura021214' }) => {
  const [currentSurface, setCurrentSurface] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleSurfaceChange = (surfaceId: number) => {
    setCurrentSurface(surfaceId);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // グリーンバック透過処理
  const processImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // グリーンバック色 #00FF00 (0, 255, 0) を透過
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // 緑色(#00FF00)を透過 + 近似色も透過
      if (r < 30 && g > 200 && b < 30) {
        data[i + 3] = 0; // アルファ値を0にして透過
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const handleImageLoad = () => {
    const img = imageRef.current;
    if (img) {
      processImage(img);
    }
  };

  // ウィンドウ位置移動関数
  const moveWindowTo = async (position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right') => {
    console.log(`🎯 Moving window to: ${position}`);
    try {
      const appWindow = getCurrentWindow();
      
      // ウィンドウサイズを取得
      const windowSize = await appWindow.outerSize();
      const windowWidth = windowSize.width;
      const windowHeight = windowSize.height;
      
      // 画面サイズを取得
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      
      const margin = 20; // 画面端からの余白
      let x = 0;
      let y = 0;
      
      switch (position) {
        case 'bottom-left':
          x = margin;
          y = screenHeight - windowHeight - margin;
          break;
        case 'bottom-right':
          x = screenWidth - windowWidth - margin;
          y = screenHeight - windowHeight - margin;
          break;
        case 'top-left':
          x = margin;
          y = margin;
          break;
        case 'top-right':
          x = screenWidth - windowWidth - margin;
          y = margin;
          break;
      }
      
      console.log(`📏 Calculated position: x=${x}, y=${y} (screen: ${screenWidth}x${screenHeight}, window: ${windowWidth}x${windowHeight})`);
      
      await appWindow.setPosition(new PhysicalPosition(x, y));
      
      // 設定後の実際の位置を確認
      const actualPos = await appWindow.outerPosition();
      console.log(`✅ Window moved to ${position}: target(${x}, ${y}) -> actual(${actualPos.x}, ${actualPos.y})`);
    } catch (error) {
      console.error('Failed to move window:', error);
    }
  };

  // ドラッグ移動関数
  const handleDragStart = async (e: React.MouseEvent) => {
    try {
      console.log('🖱️ Starting window drag');
      setIsDragging(true);
      
      const appWindow = getCurrentWindow();
      
      // TauriのstartDraggingを呼び出し
      await appWindow.startDragging();
      
    } catch (error) {
      console.error('Failed to start dragging:', error);
    } finally {
      setIsDragging(false);
    }
  };

  // 最前面表示切り替え関数
  const toggleAlwaysOnTop = async () => {
    try {
      const appWindow = getCurrentWindow();
      const newAlwaysOnTop = !isAlwaysOnTop;
      
      await appWindow.setAlwaysOnTop(newAlwaysOnTop);
      setIsAlwaysOnTop(newAlwaysOnTop);
      
      console.log(`🔝 Always on top: ${newAlwaysOnTop ? 'ON' : 'OFF'}`);
    } catch (error) {
      console.error('Failed to toggle always on top:', error);
    }
  };

  // ウィンドウを左下に配置
  useEffect(() => {
    const positionWindow = async () => {
      try {
        const appWindow = getCurrentWindow();
        
        // ウィンドウサイズを取得
        const windowSize = await appWindow.outerSize();
        const windowWidth = windowSize.width;
        const windowHeight = windowSize.height;
        
        // 画面サイズを取得
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        
        console.log(`Screen: ${screenWidth}x${screenHeight}, Window: ${windowWidth}x${windowHeight}`);
        
        // 現在の位置を確認
        const currentPos = await appWindow.outerPosition();
        console.log(`Current position: ${currentPos.x}, ${currentPos.y}`);
        
        // 左下に配置
        const x = 0;  // 左端にぴったり
        const y = Math.max(0, screenHeight - windowHeight - 50); // 下端から50px上に（Dockやタスクバー回避）
        
        await appWindow.setPosition(new PhysicalPosition(x, y));
        
        // 設定後の位置を確認
        const newPos = await appWindow.outerPosition();
        console.log(`Target: ${x}, ${y} -> Actual: ${newPos.x}, ${newPos.y}`);
      } catch (error) {
        console.error('Failed to position window:', error);
      }
    };

    // 少し遅延させて確実に実行
    setTimeout(positionWindow, 100);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="ghost-container" style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      userSelect: 'none'
    }}>
      
      <div className="ghost-surface" style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: 'transform 0.1s'
      }}>
        <canvas 
          ref={canvasRef}
          style={{
            maxWidth: '200px',
            maxHeight: '300px',
            imageRendering: 'pixelated',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
            transform: isDragging ? 'scale(1.05)' : 'scale(1)',
            opacity: isDragging ? 0.8 : 1
          }}
          className="ghost-surface-image"
          onMouseDown={handleDragStart}
          onClick={(e) => {
            // ドラッグ中でなければsurface切り替え
            if (!isDragging) {
              const nextSurface = (currentSurface + 1) % 12;
              handleSurfaceChange(nextSurface);
            }
          }}
        />
        <img 
          ref={imageRef}
          src={`/ghost/${ghostName}/shell/master/surface${currentSurface}.png`}
          alt={`Surface ${currentSurface}`}
          style={{ display: 'none' }}
          onLoad={handleImageLoad}
          onError={(e) => {
            console.log(`Surface ${currentSurface} not found, trying surface0`);
            if (currentSurface !== 0) {
              setCurrentSurface(0);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Ghost;