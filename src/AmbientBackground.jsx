import { useEffect, useRef } from 'react';

// Decorative canvas only: bounded particle count, capped DPR and 30 fps.
export default function AmbientBackground({ dark }) {
 const ref = useRef(null);
 useEffect(() => {
  const canvas = ref.current;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, particles = [], frame = 0, last = 0, time = 0;
  const createParticle = () => ({ x: Math.random(), y: Math.random(), radius: 1.3 + Math.random() * 2.2, speed: .012 + Math.random() * .015, phase: Math.random() * Math.PI * 2, alpha: .36 + Math.random() * .3 });
  function resize() {
   width = innerWidth; height = innerHeight;
   const dpr = Math.min(devicePixelRatio || 1, 1.5);
   canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
   ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
   particles = Array.from({ length: Math.min(100, Math.max(32, Math.floor(width * height / 12000))) }, createParticle);
   draw(0);
  }
  function glow(x, y, radius, alpha) {
   const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
   gradient.addColorStop(0, `rgba(${dark ? '42,133,170' : '88,180,213'},${alpha})`);
   gradient.addColorStop(1, 'rgba(70,160,200,0)');
   ctx.fillStyle = gradient; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  function draw(delta) {
   time += delta;
   ctx.clearRect(0, 0, width, height);
   const radius = Math.min(width, height) * .6;
   glow(width * .12 + Math.sin(time * .1) * 25, height * .8, radius, dark ? .12 : .12);
   glow(width * .9, height * .12 + Math.sin(time * .08) * 20, radius, dark ? .1 : .1);
   const positions = [];
   for (const p of particles) {
    p.y -= delta * p.speed;
    if (p.y < -.04) { p.y = 1.04; p.x = Math.random(); }
    const x = p.x * width + Math.sin(time * .4 + p.phase) * 26;
    const y = p.y * height;
    positions.push({x, y});
    const alpha = p.alpha * (.7 + Math.sin(time * .5 + p.phase) * .3);
    ctx.beginPath(); ctx.arc(x, y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${dark ? '123,207,235' : '34,139,184'},${alpha})`; ctx.fill();
   }
   // Short, faint links make the movement legible without a dense network.
   const reach = width < 680 ? 95 : 135;
   ctx.lineWidth = .8;
   for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
     const a = positions[i], b = positions[j];
     const distance = Math.hypot(a.x - b.x, a.y - b.y);
     if (distance > reach) continue;
     ctx.strokeStyle = `rgba(${dark ? '108,193,224' : '39,137,181'},${(1 - distance / reach) * (dark ? .28 : .24)})`;
     ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
   }
  }
  function tick(now) {
   frame = requestAnimationFrame(tick);
   if (now - last < 1000 / 30) return;
   const delta = last ? Math.min((now - last) / 1000, .08) : 0;
   last = now; draw(delta);
  }
  function sync() {
   cancelAnimationFrame(frame); frame = 0; last = 0;
   if (!document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
   else if (!document.hidden) draw(0);
   canvas.dataset.animated = String(!document.hidden && !reduced.matches);
  }
  resize(); sync();
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync); };
 }, [dark]);
 return <canvas ref={ref} className="ambient-background" aria-hidden="true"/>;
}

