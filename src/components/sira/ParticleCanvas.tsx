/**
 * ParticleCanvas — Faithful port of the original SIRA script.js particle sphere.
 * Uses the same linked-list particle system, envelope alpha, stuck time,
 * random acceleration, and depth-based darkening as the original.
 */
import { useEffect, useRef } from "react";

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match original: 500x500 canvas, responsive scaling via CSS
    canvas.width = 500;
    canvas.height = 500;

    // Original parameters
    const sphereRad = 140;
    const radiusSp = 1;
    const fLen = 320;
    const particleAlpha = 1;
    const r = 25, g = 25, b = 255;
    const rgbString = `rgba(${r},${g},${b},`;
    const numToAddEachFrame = 8;
    const displayWidth = canvas.width;
    const displayHeight = canvas.height;
    const projCenterX = displayWidth / 2;
    const projCenterY = displayHeight / 2;
    const zMax = fLen - 2;
    const randAccelX = 0.1;
    const randAccelY = 0.1;
    const randAccelZ = 0.1;
    const gravity = 0;
    const particleRad = 1.8;
    const sphereCenterX = 0;
    const sphereCenterY = 0;
    const sphereCenterZ = -3 - sphereRad;
    const zeroAlphaDepth = -750;
    const turnSpeed = (2 * Math.PI) / 1200;

    let turnAngle = 0;
    let wait = 1;
    let count = wait - 1;

    // Doubly-linked list particle system (same as original)
    const particleList: { first: any } = { first: null };
    const recycleBin: { first: any } = { first: null };

    function addParticle(x0: number, y0: number, z0: number, vx0: number, vy0: number, vz0: number) {
      let newParticle: any;
      if (recycleBin.first != null) {
        newParticle = recycleBin.first;
        if (newParticle.next != null) {
          recycleBin.first = newParticle.next;
          newParticle.next.prev = null;
        } else {
          recycleBin.first = null;
        }
      } else {
        newParticle = {};
      }

      if (particleList.first == null) {
        particleList.first = newParticle;
        newParticle.prev = null;
        newParticle.next = null;
      } else {
        newParticle.next = particleList.first;
        particleList.first.prev = newParticle;
        particleList.first = newParticle;
        newParticle.prev = null;
      }

      newParticle.x = x0;
      newParticle.y = y0;
      newParticle.z = z0;
      newParticle.velX = vx0;
      newParticle.velY = vy0;
      newParticle.velZ = vz0;
      newParticle.age = 0;
      newParticle.dead = false;
      newParticle.right = Math.random() < 0.5;
      return newParticle;
    }

    function recycle(p: any) {
      if (particleList.first == p) {
        if (p.next != null) {
          p.next.prev = null;
          particleList.first = p.next;
        } else {
          particleList.first = null;
        }
      } else {
        if (p.next == null) {
          p.prev.next = null;
        } else {
          p.prev.next = p.next;
          p.next.prev = p.prev;
        }
      }
      if (recycleBin.first == null) {
        recycleBin.first = p;
        p.prev = null;
        p.next = null;
      } else {
        p.next = recycleBin.first;
        recycleBin.first.prev = p;
        recycleBin.first = p;
        p.prev = null;
      }
    }

    function onTimer() {
      count++;
      if (count >= wait) {
        count = 0;
        for (let i = 0; i < numToAddEachFrame; i++) {
          const theta = Math.random() * 2 * Math.PI;
          const phi = Math.acos(Math.random() * 2 - 1);
          const x0 = sphereRad * Math.sin(phi) * Math.cos(theta);
          const y0 = sphereRad * Math.sin(phi) * Math.sin(theta);
          const z0 = sphereRad * Math.cos(phi);

          const p = addParticle(
            x0,
            sphereCenterY + y0,
            sphereCenterZ + z0,
            0.002 * x0,
            0.002 * y0,
            0.002 * z0
          );
          p.attack = 50;
          p.hold = 50;
          p.decay = 100;
          p.initValue = 0;
          p.holdValue = particleAlpha;
          p.lastValue = 0;
          p.stuckTime = 90 + Math.random() * 20;
          p.accelX = 0;
          p.accelY = gravity;
          p.accelZ = 0;
        }
      }

      // Update viewing angle
      turnAngle = (turnAngle + turnSpeed) % (2 * Math.PI);
      const sinAngle = Math.sin(turnAngle);
      const cosAngle = Math.cos(turnAngle);

      // Clear with black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Update and draw particles
      let p = particleList.first;
      while (p != null) {
        const nextParticle = p.next;
        p.age++;

        if (p.age > p.stuckTime) {
          p.velX += p.accelX + randAccelX * (Math.random() * 2 - 1);
          p.velY += p.accelY + randAccelY * (Math.random() * 2 - 1);
          p.velZ += p.accelZ + randAccelZ * (Math.random() * 2 - 1);
          p.x += p.velX;
          p.y += p.velY;
          p.z += p.velZ;
        }

        const rotX = cosAngle * p.x + sinAngle * (p.z - sphereCenterZ);
        const rotZ = -sinAngle * p.x + cosAngle * (p.z - sphereCenterZ) + sphereCenterZ;
        const m = radiusSp * fLen / (fLen - rotZ);
        p.projX = rotX * m + projCenterX;
        p.projY = p.y * m + projCenterY;

        // Update alpha according to envelope
        if (p.age < p.attack + p.hold + p.decay) {
          if (p.age < p.attack) {
            p.alpha = (p.holdValue - p.initValue) / p.attack * p.age + p.initValue;
          } else if (p.age < p.attack + p.hold) {
            p.alpha = p.holdValue;
          } else {
            p.alpha = (p.lastValue - p.holdValue) / p.decay * (p.age - p.attack - p.hold) + p.holdValue;
          }
        } else {
          p.dead = true;
        }

        const outsideTest =
          p.projX > displayWidth || p.projX < 0 ||
          p.projY < 0 || p.projY > displayHeight ||
          rotZ > zMax;

        if (outsideTest || p.dead) {
          recycle(p);
        } else {
          // Depth-dependent darkening
          let depthAlphaFactor = 1 - rotZ / zeroAlphaDepth;
          depthAlphaFactor = depthAlphaFactor > 1 ? 1 : depthAlphaFactor < 0 ? 0 : depthAlphaFactor;
          ctx.fillStyle = rgbString + depthAlphaFactor * p.alpha + ")";
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, m * particleRad, 0, 2 * Math.PI, false);
          ctx.closePath();
          ctx.fill();
        }

        p = nextParticle;
      }
    }

    timerRef.current = setInterval(onTimer, 10 / 24);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute"
      style={{
        width: "clamp(250px, 45vmin, 500px)",
        height: "clamp(250px, 45vmin, 500px)",
      }}
    />
  );
};

export default ParticleCanvas;
