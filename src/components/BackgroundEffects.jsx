import React, { useEffect, useRef } from 'react';

const BackgroundEffects = () => {
  const canvasRef = useRef(null);

  // Pick random high-quality background on mount
  const [bgImage] = React.useState(() => {
    const images = ['/bg-user-1.jpg', '/bg-user-2.jpg', '/bg-user-3.jpg'];
    return images[Math.floor(Math.random() * images.length)];
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Drizzle particles
    const particles = [];
    const particleCount = 400; // High particle count for a mist/drizzle feel

    for (let i = 0; i < particleCount; i++) {
      const z = Math.random(); 
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.2, // Tiny dot size
        speedY: (Math.random() * 1.5 + 0.5) * (z * 1.5 + 0.5), // Slow, floating fall
        speedX: Math.random() * 0.4 - 0.2, // Tiny individual drift
        opacity: z * 0.4 + 0.1,
        z: z,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01
      });
    }

    let globalWind = 0;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update global wind using combined sine waves for unpredictable gusts
      time += 0.005;
      const targetWind = Math.sin(time * 2.5) * 1.2 + Math.sin(time * 0.7) * 1.5;
      globalWind += (targetWind - globalWind) * 0.02; // Smooth interpolation

      particles.forEach(p => {
        // Update particle specific wobble for a floating feel
        p.wobble += p.wobbleSpeed;
        const wobbleX = Math.sin(p.wobble) * 0.4;

        // Draw particle (tiny drizzle dot)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        // Update position
        // Global wind affects closer particles slightly more for depth
        p.x += p.speedX + globalWind * (p.z * 1.2 + 0.3) + wobbleX;
        p.y += p.speedY;

        // Reset drop when it goes off screen
        if (p.y > canvas.height || p.x < -300 || p.x > canvas.width + 300) {
          let spawnX = Math.random() * canvas.width;
          
          // Compensate spawn position based on strong wind
          if (globalWind > 1) {
             spawnX = Math.random() * canvas.width - 200;
          } else if (globalWind < -1) {
             spawnX = Math.random() * canvas.width + 200;
          }

          p.x = spawnX;
          p.y = -Math.random() * 50 - 10;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="rain-container">
      {/* Background Image - Absolute positioned underneath */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.6) contrast(1.1) saturate(0.8)',
          zIndex: -2,
        }}
      />
      {/* Fog Overlay */}
      <div className="fog-layer" style={{ zIndex: -1 }} />
      {/* Rain Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          zIndex: 1, 
          pointerEvents: 'none' 
        }} 
      />
      {/* Vignette */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, transparent 40%, rgba(10, 15, 26, 0.8) 100%)',
          zIndex: 2,
        }}
      />
    </div>
  );
};

export default BackgroundEffects;
