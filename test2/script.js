(function() {
  const INTERVAL = 250;
  const MAX_POINTS = 50;
  const MAX_USERS = 5;
  const STORAGE_KEY = 'mouseTracks';
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const loadingModal = document.getElementById('loadingModal');
  const content = document.getElementById('content');
  const status = document.getElementById('status');
  let width, height;
  let animId;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  let allTracks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const ghosts = allTracks.slice(-MAX_USERS).map((track, i) => ({
    track,
    hue: (i * 360 / MAX_USERS) | 0,
    offset: i * 500
  }));

  function animate(time) {
    ctx.fillStyle = 'rgba(17,17,17,0.1)';
    ctx.fillRect(0, 0, width, height);
    ghosts.forEach(ghost => {
      const elapsed = time - ghost.offset;
      if (elapsed < 0) return;
      const idx = Math.floor(elapsed / INTERVAL);
      if (idx < ghost.track.length - 1) {
        const p0 = ghost.track[idx];
        const p1 = ghost.track[idx + 1];
        const frac = (elapsed % INTERVAL) / INTERVAL;
        const x = p0.x + (p1.x - p0.x) * frac;
        const y = p0.y + (p1.y - p0.y) * frac;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${ghost.hue}, 80%, 60%, 0.7)`;
        ctx.fill();
      }
    });
    animId = requestAnimationFrame(animate);
  }

  status.textContent = '유령 실행 중...';
  animId = requestAnimationFrame(animate);

  const maxTime = ghosts.reduce((m, g) => Math.max(m, g.offset + g.track.length * INTERVAL), 0);
  // 로딩화면 최대 10초 제한, 로딩 종료 이벤트 트리거 추가
  const maxTimeout = Math.min(maxTime + 1000, 10000);
  setTimeout(() => {
    cancelAnimationFrame(animId);
    loadingModal.style.display = 'none';
    content.style.display = 'block';
    const delay = 1000 + Math.random() * 1000;
    setTimeout(startRecording, delay);
  }, maxTimeout);

  let myTrack = [];
  let lastPos = { x: null, y: null };
  function startRecording() {
    status.textContent = '트래킹 기록 중...';
    window.addEventListener('mousemove', e => lastPos = { x: e.clientX, y: e.clientY });
    setInterval(() => {
      if (lastPos.x != null) {
        myTrack.push({ ...lastPos });
        if (myTrack.length > MAX_POINTS) myTrack.shift();
      }
    }, INTERVAL);
    window.addEventListener('beforeunload', () => {
      let arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      arr.push(myTrack);
      while (arr.length > MAX_USERS) arr.shift();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    });
  }
})();
