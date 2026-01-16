// Card flip functionality
function openCard() {
    const cardInner = document.querySelector('.card-inner');
    cardInner.classList.add('flipped');
    startConfetti();
    playSound();
}

function closeCard() {
    const cardInner = document.querySelector('.card-inner');
    cardInner.classList.remove('flipped');
}

// Confetti animation
function startConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiColors = [
        '#ff6b9d', '#c471ed', '#4facfe', '#f093fb', 
        '#f5576c', '#ffd700', '#ff99cc', '#ff80b3'
    ];
    
    const confetti = [];
    const confettiCount = 150;
    
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confettiCount,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((c, index) => {
            ctx.beginPath();
            ctx.lineWidth = c.r;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
            ctx.stroke();
            
            c.tiltAngle += c.tiltAngleIncrement;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.tilt = Math.sin(c.tiltAngle - c.r) * 15;
            
            if (c.y > canvas.height) {
                confetti[index] = {
                    x: Math.random() * canvas.width,
                    y: -20,
                    r: c.r,
                    d: c.d,
                    color: c.color,
                    tilt: Math.floor(Math.random() * 10) - 10,
                    tiltAngleIncrement: c.tiltAngleIncrement,
                    tiltAngle: 0
                };
            }
        });
        
        requestAnimationFrame(drawConfetti);
    }
    
    drawConfetti();
    
    // Stop confetti after 10 seconds
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 10000);
}

// Sound effect (optional - using Web Audio API)
function playSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 523.25; // C5 note
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Silently fail if audio context is not available
    }
}

// Add click effect to sparkles
document.querySelectorAll('.sparkle').forEach(sparkle => {
    sparkle.addEventListener('click', function() {
        this.style.transform = 'scale(1.5)';
        this.style.opacity = '1';
        setTimeout(() => {
            this.style.transform = '';
            this.style.opacity = '';
        }, 300);
    });
});

// Add parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const card = document.querySelector('.birthday-card');
    if (card) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        card.style.transform = `perspective(1500px) rotateY(${(x - 0.5) * 5}deg) rotateX(${(y - 0.5) * -5}deg)`;
    }
});

// Reset card position when mouse leaves
document.addEventListener('mouseleave', () => {
    const card = document.querySelector('.birthday-card');
    if (card) {
        card.style.transform = '';
    }
});

// Add random sparkle bursts
setInterval(() => {
    const sparkles = document.querySelectorAll('.sparkle');
    const randomSparkle = sparkles[Math.floor(Math.random() * sparkles.length)];
    randomSparkle.style.animation = 'none';
    setTimeout(() => {
        randomSparkle.style.animation = '';
    }, 10);
}, 3000);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const cardInner = document.querySelector('.card-inner');
        if (cardInner.classList.contains('flipped')) {
            closeCard();
        } else {
            openCard();
        }
    }
});

// Make balloons interactive
document.querySelectorAll('.balloon').forEach((balloon, index) => {
    balloon.addEventListener('click', function() {
        this.style.animation = 'none';
        this.style.transform = 'translateY(-100px) scale(0)';
        setTimeout(() => {
            this.style.animation = '';
            this.style.transform = '';
        }, 2000);
    });
});

// Add entrance animation
window.addEventListener('load', () => {
    const card = document.querySelector('.birthday-card');
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8) translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 1s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
        }, 100);
    }
    
    // Initialize scratch-off coupons
    initScratchCoupons();
    
    // Initialize music player
    initMusicPlayer();
});

// Page Navigation
function showPage(pageNumber) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`page-${pageNumber}`);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach((btn, index) => {
        btn.classList.remove('active');
        if (index === pageNumber - 1) {
            btn.classList.add('active');
        }
    });
    
    // Start confetti on page change
    if (pageNumber !== 1) {
        startConfetti();
    }
}

// Scratch-Off Coupon Functionality
function initScratchCoupons() {
    const canvases = document.querySelectorAll('.scratch-canvas');
    
    canvases.forEach(canvas => {
        const couponCard = canvas.closest('.coupon-card');
        const rect = couponCard.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let scratchedPixels = 0;
        const totalPixels = canvas.width * canvas.height;
        const revealThreshold = 0.3; // 30% scratched reveals the coupon
        
        // Draw silver scratch layer
        function drawScratchLayer() {
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add texture
            ctx.fillStyle = '#a0a0a0';
            for (let i = 0; i < 100; i++) {
                ctx.fillRect(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    2, 2
                );
            }
            
            // Add text
            ctx.fillStyle = '#808080';
            ctx.font = 'bold 20px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);
        }
        
        drawScratchLayer();
        
        // Scratch detection
        function scratch(x, y) {
            const radius = 30;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            
            // Count scratched pixels (approximate)
            scratchedPixels += Math.PI * radius * radius;
            
            if (scratchedPixels / totalPixels >= revealThreshold) {
                canvas.style.pointerEvents = 'none';
                canvas.style.opacity = '0';
                canvas.style.transition = 'opacity 0.5s ease';
                
                // Add celebration effect
                createScratchConfetti(couponCard);
            }
        }
        
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            scratch(e.clientX - rect.left, e.clientY - rect.top);
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (isDrawing) {
                const rect = canvas.getBoundingClientRect();
                scratch(e.clientX - rect.left, e.clientY - rect.top);
            }
        });
        
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
        
        canvas.addEventListener('mouseleave', () => {
            isDrawing = false;
        });
        
        // Touch support
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDrawing = true;
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            scratch(touch.clientX - rect.left, touch.clientY - rect.top);
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (isDrawing) {
                const touch = e.touches[0];
                const rect = canvas.getBoundingClientRect();
                scratch(touch.clientX - rect.left, touch.clientY - rect.top);
            }
        });
        
        canvas.addEventListener('touchend', () => {
            isDrawing = false;
        });
    });
}

function createScratchConfetti(element) {
    const colors = ['#ff6b9d', '#c471ed', '#4facfe', '#f093fb', '#ffd700'];
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = Math.random() * 100 + '%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        confetti.style.animation = 'confettiFall 1s ease-out forwards';
        
        element.style.position = 'relative';
        element.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 1000);
    }
}

// Add confetti fall animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Music Player Functionality
const songs = [
    { title: 'Happy Birthday to You', artist: 'Traditional', notes: [261.63, 261.63, 293.66, 261.63, 349.23, 329.63] },
    { title: 'Celebration', artist: 'Kool & The Gang', notes: [392, 440, 493.88, 523.25, 587.33] },
    { title: "It's My Party", artist: 'Lesley Gore', notes: [293.66, 329.63, 349.23, 392, 440] },
    { title: 'Birthday', artist: 'The Beatles', notes: [261.63, 293.66, 329.63, 349.23, 392] },
    { title: '22', artist: 'Taylor Swift', notes: [349.23, 392, 440, 493.88, 523.25] }
];

let currentSongIndex = 0;
let isPlaying = false;
let audioContext = null;
let currentOscillator = null;

function initMusicPlayer() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Audio context not available');
    }
}

function playSong(index) {
    if (index < 0 || index >= songs.length) return;
    
    currentSongIndex = index;
    updateSongDisplay();
    
    // Update playlist
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.remove('active');
        if (i === index) {
            item.classList.add('active');
        }
    });
    
    if (isPlaying) {
        stopSong();
        playCurrentSong();
    }
}

function playCurrentSong() {
    if (!audioContext) {
        initMusicPlayer();
        if (!audioContext) return;
    }
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    isPlaying = true;
    updatePlayButton();
    
    const song = songs[currentSongIndex];
    const vinyl = document.querySelector('.vinyl-record');
    if (vinyl) vinyl.classList.add('playing');
    
    // Play melody
    playMelody(song.notes);
}

function playMelody(notes) {
    let noteIndex = 0;
    
    function playNote() {
        if (!isPlaying || noteIndex >= notes.length) {
            isPlaying = false;
            updatePlayButton();
            const vinyl = document.querySelector('.vinyl-record');
            if (vinyl) vinyl.classList.remove('playing');
            return;
        }
        
        const frequency = notes[noteIndex];
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
        
        noteIndex++;
        setTimeout(playNote, 400);
    }
    
    playNote();
}

function stopSong() {
    isPlaying = false;
    updatePlayButton();
    const vinyl = document.querySelector('.vinyl-record');
    if (vinyl) vinyl.classList.remove('playing');
}

function togglePlay() {
    if (isPlaying) {
        stopSong();
    } else {
        playCurrentSong();
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
    if (isPlaying) {
        stopSong();
        setTimeout(() => playCurrentSong(), 100);
    }
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
    if (isPlaying) {
        stopSong();
        setTimeout(() => playCurrentSong(), 100);
    }
}

function updateSongDisplay() {
    const song = songs[currentSongIndex];
    const titleEl = document.getElementById('current-song');
    const artistEl = document.getElementById('current-artist');
    
    if (titleEl) titleEl.textContent = song.title;
    if (artistEl) artistEl.textContent = song.artist;
}

function updatePlayButton() {
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.textContent = isPlaying ? '⏸' : '▶';
    }
}
