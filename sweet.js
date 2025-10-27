// --- Efek Bintang Jatuh (Kode ini tetap sama) ---
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
function createStar() { /* ... kode bintang jatuh tetap sama ... */
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: Math.random() * 0.1 - 0.05,
        vy: Math.random() * 0.1 + 0.05,
        opacity: Math.random() * 0.5 + 0.3
    };
}
for (let i = 0; i < 150; i++) { stars.push(createStar()); }
function drawStars() { /* ... kode menggambar bintang tetap sama ... */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.globalAlpha = star.opacity;
        ctx.fill();
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
window.addEventListener('resize', () => { /* ... kode resize canvas tetap sama ... */
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 150; i++) { stars.push(createStar()); }
});


// --- Animasi Ketik & KONTROL AUDIO BARU ---
const messageElement = document.getElementById('romanticMessage');
const playSongBtn = document.getElementById('playSongBtn'); // Ganti songLinkElement
const audioElement = document.getElementById('ourSong');
let isPlaying = false;

// GANTI PESAN INI SESUKA HATI KAMU! \n untuk baris baru
const message = "Aku cuma mau bilang...\nKamu itu spesial banget buat aku.\nSetiap hari sama kamu rasanya kayak mimpi.\nMakasih udah selalu ada ya.\n\nLove you always ❤️";
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
        
        // Tampilkan tombol musik setelah pesan selesai
        playSongBtn.style.display = 'inline-block';
        fadeIn(playSongBtn);
    }
}

function fadeIn(element) { /* ... kode fadeIn tetap sama ... */
    let op = 0.1;
    element.style.opacity = op;
    let timer = setInterval(function () {
        if (op >= 1){ clearInterval(timer); }
        element.style.opacity = op;
        op += op * 0.1;
    }, 30);
}

// --- LOGIKA BARU UNTUK TOMBOL MUSIK ---
playSongBtn.addEventListener('click', () => {
    // Cek apakah audio sedang diputar atau dijeda
    if (isPlaying) {
        audioElement.pause();
        playSongBtn.innerHTML = '<i class="fas fa-play"></i> Putar Lagi';
    } else {
        audioElement.play();
        playSongBtn.innerHTML = '<i class="fas fa-pause"></i> Jeda Lagu';
    }
    // Balikkan status isPlaying
    isPlaying = !isPlaying;
});

document.addEventListener('DOMContentLoaded', () => {
    messageElement.innerHTML = '';
    setTimeout(typeWriter, 1000);
});

// Perbaikan kecil untuk kursor HTML
const style = document.createElement('style');
style.innerHTML = `.cursor { display: inline-block; animation: blinkCursor 0.7s steps(40, end) infinite; }`;
document.head.appendChild(style);