const AudioCtx = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioCtx();

const notes = {
  a: 261.63, // C4 Do
  s: 293.66, // D4 Re
  d: 329.63, // E4 Mi
  f: 349.23, // F4 Fa
  g: 392.00, // G4 Sol
  h: 440.00, // A4 La
  j: 493.88, // B4 Si
  k: 523.25  // C5 Do
};

function play(freq) {
  // Si el navegador bloquea audio, se “desbloquea” al primer keydown
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  // Envolvente simple para que no suene “click”
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.27);
}

function highlight(key, on) {
  const el = document.querySelector(`.key[data-key="${key}"]`);
  if (!el) return;
  el.classList.toggle("active", on);
}

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
