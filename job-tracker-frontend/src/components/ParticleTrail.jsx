import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

// Particle class – each instance lives for a short duration
class Particle {
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    // Random spread velocity
    this.vx = (Math.random() - 0.5) * 2.5;
    this.vy = (Math.random() - 0.5) * 2.5 - 1.2; // slight upward drift
    // Pick a random color from the palette
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = 1;
    this.size = Math.random() * 5 + 2; // 2-7px radius
    this.decay = Math.random() * 0.018 + 0.012; // fade speed
    this.gravity = 0.08; // slight downward pull
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.alpha -= this.decay;
    this.size *= 0.97; // shrink as it fades
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    // Glow effect
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(this.size, 0.1), 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.alpha <= 0 || this.size <= 0.2;
  }
}

export function ParticleTrail() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, moved: false });
  const { darkMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Color palette: purple/teal/indigo matching the app theme
    const lightPalette = [
      '#6366f1', '#818cf8', '#a5b4fc',
      '#5c5fc0', '#7c3aed', '#06b6d4',
      '#0ea5e9', '#38bdf8',
    ];
    const darkPalette = [
      '#00ffff', '#38bdf8', '#818cf8',
      '#a78bfa', '#6366f1', '#5eead4',
      '#67e8f9', '#c4b5fd',
    ];

    const getColors = () => (darkMode ? darkPalette : lightPalette);

    // Resize canvas to match full window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn particles on mouse move (throttled to every N pixels)
    let lastX = 0;
    let lastY = 0;

    const onMouseMove = (e) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Only spawn if the mouse moved at least 6px since last spawn
      if (dist > 6) {
        const count = Math.min(Math.floor(dist / 4), 6); // up to 6 particles per burst
        for (let i = 0; i < count; i++) {
          particlesRef.current.push(new Particle(e.clientX, e.clientY, getColors()));
        }
        lastX = e.clientX;
        lastY = e.clientY;
      }

      mouseRef.current = { x: e.clientX, y: e.clientY, moved: true };
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => !p.isDead());
      particlesRef.current.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      particlesRef.current = [];
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none', // completely transparent to clicks
        userSelect: 'none',
      }}
      aria-hidden="true"
    />
  );
}
