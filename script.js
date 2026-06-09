/* ===== Planet Configuration (sizes match CSS) ===== */
const planets = [
  { name: 'mercury', orbit: 80,  duration: 4,  size: 8,  startAngle: Math.random() * 360 },
  { name: 'venus',   orbit: 115, duration: 7,  size: 13, startAngle: Math.random() * 360 },
  { name: 'earth',   orbit: 155, duration: 10, size: 14, startAngle: Math.random() * 360 },
  { name: 'mars',    orbit: 195, duration: 15, size: 10, startAngle: Math.random() * 360 },
  { name: 'jupiter', orbit: 255, duration: 25, size: 30, startAngle: Math.random() * 360 },
  { name: 'saturn',  orbit: 320, duration: 35, size: 26, startAngle: Math.random() * 360 },
  { name: 'uranus',  orbit: 380, duration: 50, size: 18, startAngle: Math.random() * 360 },
  { name: 'neptune', orbit: 435, duration: 70, size: 17, startAngle: Math.random() * 360 },
];

/* ===== Generate Star Background ===== */
function generateStars() {
  const container = document.getElementById('stars');
  const count = 300;
  const shadows = [];

  for (let i = 0; i < count; i++) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const size = Math.random() * 1.5 + 0.5;
    const opacity = Math.random() * 0.7 + 0.3;
    shadows.push(`${x}px ${y}px ${size}px rgba(255,255,255,${opacity})`);
  }

  /* Use a single 1x1 element with many box-shadows for performance */
  const star = document.createElement('div');
  star.style.cssText = `
    position: absolute; width: 1px; height: 1px;
    box-shadow: ${shadows.join(',')};
  `;
  container.appendChild(star);
}

/* ===== Initialize Orbits ===== */
function initOrbits() {
  planets.forEach((p) => {
    const orbitEl = document.querySelector(`.orbit[data-planet="${p.name}"]`);
    if (!orbitEl) return;

    const orbitLine = orbitEl.querySelector('.orbit-line');
    const arm = orbitEl.querySelector('.arm');
    const planet = orbitEl.querySelector('.planet');
    const label = orbitEl.querySelector('.label');

    /* Size the orbit line to match the orbit diameter */
    const diameter = p.orbit * 2;
    orbitLine.style.width = `${diameter}px`;
    orbitLine.style.height = `${diameter}px`;

    /* Position the planet at the orbit radius, centered vertically on the orbit line */
    planet.style.left = `${p.orbit}px`;
    planet.style.top = `${-p.size / 2}px`;

    /* Position label just outside the planet */
    label.style.left = `${p.orbit + p.size / 2 + 8}px`;
    label.style.top = '-8px';

    /* Set animation duration and random start position */
    arm.style.animationDuration = `${p.duration}s`;
    arm.style.animationDelay = `${-(p.startAngle / 360) * p.duration}s`;

    /* Counter-rotate planet and label to keep them upright */
    planet.style.animationDuration = `${p.duration}s`;
    planet.style.animationDelay = `${-(p.startAngle / 360) * p.duration}s`;
    label.style.animationDuration = `${p.duration}s`;
    label.style.animationDelay = `${-(p.startAngle / 360) * p.duration}s`;
  });
}

/* ===== Pause / Resume ===== */
const pauseBtn = document.getElementById('pause-btn');
let paused = false;

pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';

  /* Toggle all running CSS animations */
  const animated = document.querySelectorAll('.arm, .planet, .label, .moon-orbit');
  animated.forEach((el) => {
    el.style.animationPlayState = paused ? 'paused' : 'running';
  });
});

/* ===== Speed Slider ===== */
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');

speedSlider.addEventListener('input', () => {
  const multiplier = parseFloat(speedSlider.value);
  speedValue.textContent = `${multiplier}x`;

  /* Adjust each orbit's duration inversely to the speed multiplier */
  planets.forEach((p) => {
    const orbitEl = document.querySelector(`.orbit[data-planet="${p.name}"]`);
    if (!orbitEl) return;

    const newDuration = p.duration / multiplier;
    const delay = `${-(p.startAngle / 360) * newDuration}s`;

    const arm = orbitEl.querySelector('.arm');
    const planet = orbitEl.querySelector('.planet');
    const label = orbitEl.querySelector('.label');

    /* Update durations for orbit arm, planet counter-rotation, and label */
    [arm, planet, label].forEach((el) => {
      el.style.animationDuration = `${newDuration}s`;
      el.style.animationDelay = delay;
    });
  });

  /* Moon speed scales with global speed too */
  const moonOrbit = document.querySelector('.moon-orbit');
  if (moonOrbit) {
    moonOrbit.style.animationDuration = `${2 / multiplier}s`;
  }
});

/* ===== Bootstrap ===== */
generateStars();
initOrbits();
