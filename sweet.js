// --- Efek Bintang Jatuh & Parallax ---
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let stars = [];

function createStar() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: Math.random() * 0.1 - 0.05,
        vy: Math.random() * 0.1 + 0.05,
        opacity: Math.random() * 0.5 + 0.3,
        // EFEK BARU: z-index palsu untuk kecepatan parallax
        z: Math.random() * 0.5 + 0.5 // 0.5 (jauh) sampai 1 (dekat)
    };
}

for (let i = 0; i < 150; i++) { stars.push(createStar()); }

// EFEK BARU: Variabel untuk parallax mouse
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

    // EFEK BARU: Hitung pergerakan parallax
    const moveX = (mouse.x - canvas.width / 2) * 0.01;
    const moveY = (mouse.y - canvas.height / 2) * 0.01;

    stars.forEach(star => {
        ctx.beginPath();
        // EFEK BARU: Terapkan parallax berdasarkan 'z'
        const starMoveX = moveX * star.z;
        const starMoveY = moveY * star.z;
        ctx.arc(star.x + starMoveX, star.y + starMoveY, star.radius, 0, Math.PI * 2);
        
        ctx.globalAlpha = star.opacity;
        ctx.fill();

        // Gerakan bintang jatuh (tetap sama)
        star.x += star.vx;
        star.y += star.vy;
        if (star.y > canvas.height + star.radius) {
            star.y = 0 - star.radius;
            star.x = Math.random() * canvas.width;
        }
        if (star.x > canvas.width + star.radius) { star.x = 0 - star.radius; } 
        else if (star.x < 0 - star.radius) { star.x = canvas.width + star.radius; }
    });
    ctx.globalAlpha = 1.0;
    requestAnimationFrame(drawStars);
}

drawStars();
window.addEventListener('resize', () => { /* ... kode resize tetap sama ... */ });


// --- Animasi Ketik & KONTROL AUDIO BARU ---
const messageElement = document.getElementById('romanticMessage');
const playSongBtn = document.getElementById('playSongBtn');
const audioElement = document.getElementById('ourSong');
let isPlaying = false;

// KONTEN BARU: Inisialisasi Audio Visualizer
const visualizerCanvas = document.getElementById('audioVisualizer');
const visCtx = visualizerCanvas.getContext('2d');
let audioContext, analyser, source, dataArray, bufferLength;
let animationFrameId;

function setupAudioVisualizer() {
    if (audioContext) return; // Jangan setup dua kali
    
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audioElement);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 128; // Kualitas visualizer (harus pangkat 2)
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    visualizerCanvas.style.display = 'block'; // Tampilkan canvas
    drawVisualizer();
}

function drawVisualizer() {
    animationFrameId = requestAnimationFrame(drawVisualizer);
    
    analyser.getByteFrequencyData(dataArray);
    visCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

    const barWidth = (visualizerCanvas.width / bufferLength) * 1.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2; // Bagi 2 biar tidak terlalu tinggi
        
        // Buat gradasi warna untuk barnya
        const gradient = visCtx.createLinearGradient(0, visualizerCanvas.height, 0, visualizerCanvas.height - barHeight);
        gradient.addColorStop(0, '#ffd700'); // Emas
        gradient.addColorStop(1, '#ffec80'); // Emas muda

        visCtx.fillStyle = gradient;
        visCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 2; // Jarak antar bar
    }
}

// Pesan (tetap sama)
const message = "Aku cuma mau bilang...\nKamu adalah orang yang spesial untuk ku.\nKamu adalah wanita yang kuat dan hebat.\nTetaplah berjuang dan terimakasih sudah bertahan.\n\nwish you all the best! and i still with same old feelings";
let i = 0;
const typingSpeed = 80;

function typeWriter() {
    if (i < message.length) {
        messageElement.innerHTML = message.substring(0, i + 1).replace(/\|/g, '') + '<span class="cursor">|</span>';
        i++;
        setTimeout(typeWriter, typingSpeed);
    } else {
        messageElement.innerHTML = message.replace(/\|/g, '');
        messageElement.style.borderRight = 'none';
        
        playSongBtn.style.display = 'inline-block';
        fadeIn(playSongBtn);
        // EFEK BARU: Tambahkan kelas pulse
        playSongBtn.classList.add('pulse');
    }
}

function fadeIn(element) { /* ... kode fadeIn tetap sama ... */ }

// --- LOGIKA BARU UNTUK TOMBOL MUSIK ---
playSongBtn.addEventListener('click', () => {
    // EFEK BARU: Setup visualizer saat pertama kali play
    setupAudioVisualizer();

    // EFEK BARU: Hapus animasi pulse saat diklik
    playSongBtn.classList.remove('pulse');
    playSongBtn.style.animation = 'none'; // Matikan animasi

    if (isPlaying) {
        audioElement.pause();
        playSongBtn.innerHTML = '<i class="fas fa-play"></i> Putar Lagi';
        cancelAnimationFrame(animationFrameId); // Hentikan visualizer
    } else {
        audioElement.play();
        playSongBtn.innerHTML = '<i class="fas fa-pause"></i> Jeda Lagu';
        drawVisualizer(); // Mulai lagi visualizer
    }
    isPlaying = !isPlaying;
});

document.addEventListener('DOMContentLoaded', () => {
    messageElement.innerHTML = '';
    setTimeout(typeWriter, 1000);
});

// Kursor (tetap sama)
const style = document.createElement('style');
style.innerHTML = `.cursor { display: inline-block; animation: blinkCursor 0.7s steps(40, end) infinite; }`;
document.head.appendChild(style);