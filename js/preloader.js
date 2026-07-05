
/* ================================================================
   2. PRÉLOADER ANIMÉ — Canvas manga (speedlines + panel + texte)
   Exécuté immédiatement à la lecture du script (hors DOMContentLoaded)
   pour démarrer l'animation dès que possible.
   ================================================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const canvas    = document.getElementById('pl-canvas');
  if (!preloader || !canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let phase = 0, phaseFrame = 0, penProgress = 0, caseScale = 0, done = false;

  const PHASE_DUR = { 0: 40, 1: 35, 2: 130, 3: 55, 4: 45 };
  const LINE1 = 'Tom Marcorelli';
  const LINE2 = 'Technicien Reseaux & Systemes';

  const speedLines = Array.from({length: 80}, (_, i) => ({
    angle:  (i / 80) * Math.PI * 2,
    inner:  55 + Math.floor(i * 0.4) % 35,
    spread: (Math.PI * 2 / 80) * (0.18 + (i % 5) * 0.06),
    gold:   i % 3 === 0,
  }));

  const inkDrops = Array.from({length: 14}, (_, i) => ({
    x:     0.05 + (i * 0.07) % 0.9,
    y:     0.05 + (i * 0.13) % 0.9,
    r:     2 + (i % 4),
    alpha: 0.04 + (i % 3) * 0.03,
  }));

  function drawBG() {
    ctx.fillStyle = '#f5f0e8';
    ctx.fillRect(0, 0, W, H);
  }

  function drawSpeedLines(alpha) {
    const cx = W / 2, cy = H / 2;
    ctx.save();
    ctx.globalAlpha = alpha;
    speedLines.forEach(l => {
      const outer = Math.max(W, H) * 0.92;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(l.angle - l.spread) * l.inner, cy + Math.sin(l.angle - l.spread) * l.inner);
      ctx.lineTo(cx + Math.cos(l.angle) * outer,              cy + Math.sin(l.angle) * outer);
      ctx.lineTo(cx + Math.cos(l.angle + l.spread) * l.inner, cy + Math.sin(l.angle + l.spread) * l.inner);
      ctx.closePath();
      ctx.fillStyle = l.gold ? 'rgba(234,179,8,0.20)' : 'rgba(0,0,0,0.07)';
      ctx.fill();
    });
    ctx.restore();
  }

  function drawInk() {
    inkDrops.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${d.alpha})`;
      ctx.fill();
    });
  }

  function drawPanel(scale) {
    const pw = Math.min(W * 0.72, 600) * scale;
    const ph = Math.min(H * 0.55, 420) * scale;
    const px = W / 2 - pw / 2, py = H / 2 - ph / 2;
    const bw = 5 * scale;

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(px + 7 * scale, py + 7 * scale, pw, ph);
    ctx.fillStyle = '#faf7f0';
    ctx.fillRect(px, py, pw, ph);

    ctx.strokeStyle = '#111';
    ctx.lineWidth = bw;
    ctx.strokeRect(px + bw / 2, py + bw / 2, pw - bw, ph - bw);
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(px + bw * 2.5, py + bw * 2.5, pw - bw * 5, ph - bw * 5);

    ctx.font = `bold ${13 * scale}px "Share Tech Mono",monospace`;
    ctx.fillStyle = '#eab308';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('CHAPITRE 01', px + bw * 3.5, py + bw * 3);

    ctx.font = `${11 * scale}px "Noto Sans JP",sans-serif`;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.textAlign = 'right';
    ctx.fillText('ポートフォリオ', px + pw - bw * 3.5, py + bw * 3);

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(px + bw, py + bw * 4 + 16 * scale);
    ctx.lineTo(px + pw - bw, py + bw * 4 + 16 * scale);
    ctx.stroke();

    return { px, py, pw, ph, bw, scale };
  }

  function drawText(panel, progress) {
    const { px, py, pw, ph, bw, scale } = panel;
    const cx = px + pw / 2, cy = py + ph / 2;
    const p1 = Math.min(progress / 0.6, 1);
    const p2 = progress > 0.6 ? Math.min((progress - 0.6) / 0.4, 1) : 0;

    const fs1 = Math.min(pw * 0.095, 50) * scale;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${fs1}px Orbitron,monospace`;
    ctx.fillStyle = '#111';
    const t1 = LINE1.substring(0, Math.ceil(LINE1.length * p1));
    ctx.fillText(t1, cx, cy - 26 * scale);

    if (p1 < 1) {
      const tw = ctx.measureText(t1).width;
      ctx.fillStyle = '#eab308';
      ctx.font = `${fs1}px monospace`;
      ctx.fillText('|', cx + tw / 2 + 3, cy - 26 * scale);
    }

    const lw = Math.min(pw * 0.62, 320) * scale;
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.moveTo(cx - lw / 2, cy - 2 * scale);
    ctx.lineTo(cx - lw / 2 + lw * p1, cy - 2 * scale);
    ctx.stroke();

    if (p2 > 0) {
      const fs2 = Math.min(pw * 0.036, 15) * scale;
      ctx.font = `${fs2}px "Share Tech Mono",monospace`;
      ctx.fillStyle = '#333';
      const t2 = LINE2.substring(0, Math.ceil(LINE2.length * p2));
      ctx.fillText(t2, cx, cy + 28 * scale);
      if (p2 < 1) {
        const tw2 = ctx.measureText(t2).width;
        ctx.fillStyle = '#eab308';
        ctx.fillText('_', cx + tw2 / 2 + 3, cy + 28 * scale);
      }
    }

    if (progress > 0.88) {
      const op = (progress - 0.88) / 0.12;
      ctx.save();
      ctx.globalAlpha = op * 0.15;
      ctx.font = `bold ${Math.min(pw * 0.055, 24) * scale}px "Noto Sans JP",sans-serif`;
      ctx.fillStyle = '#000';
      ctx.textAlign = 'right';
      ctx.fillText('ドン！', px + pw - bw * 3.5, py + ph - bw * 4);
      ctx.restore();
    }
  }

  let panel = null;

  function loop() {
    if (done) return;
    requestAnimationFrame(loop);
    phaseFrame++;

    if (phase === 0) {
      drawBG();
      drawSpeedLines(Math.min(phaseFrame / 15, 1));
      drawInk();
      if (phaseFrame >= PHASE_DUR[0]) { phase = 1; phaseFrame = 0; }

    } else if (phase === 1) {
      drawBG(); drawSpeedLines(1); drawInk();
      const t = phaseFrame / PHASE_DUR[1];
      const b = t < 0.75 ? t / 0.75 : 1 + Math.sin((t - 0.75) / 0.25 * Math.PI) * 0.05;
      caseScale = Math.min(b, 1.05);
      panel = drawPanel(caseScale);
      if (phaseFrame >= PHASE_DUR[1]) { phase = 2; phaseFrame = 0; }

    } else if (phase === 2) {
      drawBG(); drawSpeedLines(1); drawInk();
      panel = drawPanel(1);
      penProgress = phaseFrame / PHASE_DUR[2];
      drawText(panel, penProgress);
      if (phaseFrame >= PHASE_DUR[2]) { phase = 3; phaseFrame = 0; penProgress = 1; }

    } else if (phase === 3) {
      drawBG(); drawSpeedLines(1); drawInk();
      panel = drawPanel(1);
      drawText(panel, 1);
      if (phaseFrame >= PHASE_DUR[3]) { phase = 4; phaseFrame = 0; }

    } else if (phase === 4) {
      drawBG(); drawSpeedLines(1); drawInk();
      panel = drawPanel(1); drawText(panel, 1);
      const t = phaseFrame / PHASE_DUR[4];
      ctx.fillStyle = `rgba(255,255,255,${Math.min(t * 2.5, 1)})`;
      ctx.fillRect(0, 0, W, H);
      if (t > 0.45) {
        ctx.fillStyle = `rgba(6,8,10,${Math.min((t - 0.45) * 2, 1)})`;
        ctx.fillRect(0, 0, W, H);
      }
      if (phaseFrame >= PHASE_DUR[4]) {
        done = true;
        if (preloader) {
          preloader.style.transition = 'opacity 0.25s ease';
          preloader.style.opacity    = '0';
          setTimeout(() => preloader.remove(), 300);
        }
      }
    }
  }

  loop();
}


