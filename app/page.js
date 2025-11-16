'use client';

import { useState, useRef, useEffect } from 'react';

export default function ImageEditor() {
  const [image, setImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          resetFilters();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotation(0);
    setScale(1);
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      ctx.restore();
    }
  }, [image, brightness, contrast, saturation, blur, rotation, scale]);

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '36px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Image Editor
        </h1>

        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            📤 Upload Image
          </button>
        </div>

        {image && (
          <>
            <div style={{
              display: 'flex',
              gap: '30px',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: '1', minWidth: '300px' }}>
                <h3 style={{ marginBottom: '20px', color: '#333' }}>Edit Controls</h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                    Brightness: {brightness}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(e.target.value)}
                    style={{ width: '100%', height: '8px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                    Contrast: {contrast}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(e.target.value)}
                    style={{ width: '100%', height: '8px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                    Saturation: {saturation}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(e.target.value)}
                    style={{ width: '100%', height: '8px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                    Blur: {blur}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={blur}
                    onChange={(e) => setBlur(e.target.value)}
                    style={{ width: '100%', height: '8px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                    Rotation: {rotation}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotation}
                    onChange={(e) => setRotation(e.target.value)}
                    style={{ width: '100%', height: '8px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                    Scale: {scale.toFixed(2)}x
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    style={{ width: '100%', height: '8px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                  <button
                    onClick={resetFilters}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#e0e0e0',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '16px'
                    }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={downloadImage}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '16px'
                    }}
                  >
                    💾 Download
                  </button>
                </div>
              </div>

              <div style={{
                flex: '2',
                minWidth: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f5f5f5',
                borderRadius: '8px',
                padding: '20px',
                overflow: 'auto'
              }}>
                <canvas
                  ref={canvasRef}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '600px',
                    borderRadius: '4px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
            </div>
          </>
        )}

        {!image && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#888',
            fontSize: '18px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🖼️</div>
            Upload an image to start editing
          </div>
        )}
      </div>
    </div>
  );
}
