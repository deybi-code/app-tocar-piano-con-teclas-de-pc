const AudioCtx = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioCtx();

// Frecuencias de las notas
const notes = {
  a: 261.63, // Do
  s: 293.66, // Re
  d: 329.63, // Mi
  f: 349.23, // Fa
  g: 392.00, // Sol
  h: 440.00, // La
  j: 493.88, // Si
  k: 523.25  // Do (Octava arriba)
};

function play(freq) {
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Tipo "triangle" suena más lleno y fuerte que "sine"
  osc.type = "triangle";
  osc.frequency.value = freq;

  // Ajuste de volumen (0.6 es bastante fuerte)
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 0.02);
  
  // Duración del sonido (0.6 segundos de desvanecimiento)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.65);
}

function highlight(key, on) {
  const el = document.querySelector(`.key[data-key="${key}"]`);
  if (!el) return;
  
  if (on) {
    el.classList.add("active");
  } else {
    el.classList.remove("active");
  }
}

// Eventos de teclado
document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (!notes[k] || e.repeat) return;
  
  play(notes[k]);
  highlight(k, true);
});

document.addEventListener("keyup", (e) => {
  const k = e.key.toLowerCase();
  if (!notes[k]) return;
  highlight(k, false);
});
