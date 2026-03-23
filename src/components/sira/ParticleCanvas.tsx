/**
 * ParticleCanvas — Renders a 3D rotating particle sphere on a canvas.
 * Ported from the original SIRA script.js with React lifecycle management.
 * The sphere auto-sizes to the container and animates continuously.
 */
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; z: number;
  ox: number; oy: number; oz: number;
  next?: Particle;
}

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Responsive sizing
    const resize = () => {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.7;
      const capped = Math.min(size, 500);
      canvas.width = capped;
      canvas.height = capped;
    };
    resize();
    window.addEventListener("resize", resize);

    const sphereRad = canvas.width * 0.28;
    const fLen = 320;
    const particleAlpha = 1;
    const r = 30, g = 100, b = 255;
    const rgbBase = `rgba(${r},${g},${b},`;
    const numToAddEachFrame = 6;
    const zMax = fLen - 2;

    let turnAngle = 0;
    const turnSpeed = 2 * Math.PI / 1200;
    const projCenterX = canvas.width / 2;
    const projCenterY = canvas.height / 2;

    let particleList: Particle | null = null;
    let recycleBin: Particle | null = null;

    const addParticle = (x: number, y: number, z: number): Particle => {
      let p: Particle;
      if (recycleBin) {
        p = recycleBin;
        recycleBin = recycleBin.next;
      } else {
        p = { x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0 };
      }
      p.x = x; p.y = y; p.z = z;
      p.ox = x; p.oy = y; p.oz = z;
      p.next = particleList || undefined;
      particleList = p;
      return p;
    };

    const recycle = (p: Particle) => {
      p.next = recycleBin || undefined;
      recycleBin = p;
    };

    // Seed initial particles
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const x0 = sphereRad * Math.sin(phi) * Math.cos(theta);
      const y0 = sphereRad * Math.sin(phi) * Math.sin(theta);
      const z0 = sphereRad * Math.cos(phi);
      addParticle(x0, y0, z0);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      turnAngle = (turnAngle + turnSpeed) % (2 * Math.PI);
      const sinA = Math.sin(turnAngle);
      const cosA = Math.cos(turnAngle);

      // Add new particles each frame
      for (let i = 0; i < numToAddEachFrame; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(Math.random() * 2 - 1);
        addParticle(
          sphereRad * Math.sin(phi) * Math.cos(theta),
          sphereRad * Math.sin(phi) * Math.sin(theta),
          sphereRad * Math.cos(phi)
        );
      }

      let p = particleList;
      let prev: Particle | null = null;

      while (p) {
        // Rotate around Y axis
        const rotX = cosA * p.ox + sinA * p.oz;
        const rotZ = -sinA * p.ox + cosA * p.oz;
        const m = fLen / (fLen - rotZ);
        p.x = rotX * m + projCenterX;
        p.y = p.oy * m + projCenterY;
        p.z = rotZ;

        if (p.z > zMax || m < 0) {
          // Remove and recycle
          const next = p.next;
          if (prev) prev.next = next;
          else particleList = next || null;
          recycle(p);
          p = next as Particle;
          continue;
        }

        const depthAlpha = (1 - rotZ / zMax);
        const alpha = depthAlpha * particleAlpha;
        ctx.fillStyle = rgbBase + (alpha > 0 ? alpha.toFixed(2) : "0") + ")";
        const rad = Math.max(0.5, 2.2 * m);
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, 2 * Math.PI);
        ctx.fill();

        prev = p;
        p = p.next as Particle;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 m-auto pointer-events-none opacity-60"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default ParticleCanvas;
