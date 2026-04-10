const logoFiles = ['logocreality.svg', 'logoelegoo.svg', 'logoesun.svg','logorevopoint.svg'];
const logoImages = logoFiles.map(src => {
    const img = new Image();
    img.src = src;
    img.isReady = false;
    img.aspectRatio = 1; 
    img.onload = () => {
        img.isReady = true;
        // Calculate original aspect ratio to prevent compression
        img.aspectRatio = img.naturalWidth / img.naturalHeight;
    };
    return img;
});

let flyingLogos = [];
let lastLogoIndex = -1;

export function spawnFlyingLogo(W, H, CHAR_W, CHAR_H, speed) {
    if (logoImages.length === 0) return;

    let index;
    do {
        index = Math.floor(Math.random() * logoImages.length);
    } while (index === lastLogoIndex && logoImages.length > 1);

    lastLogoIndex = index;
    const selectedImg = logoImages[index];

    // Adjust size based on aspect ratio (Width is set, Height follows)
    const targetWidth = CHAR_W * 2.2; 
    const targetHeight = targetWidth / selectedImg.aspectRatio;

    flyingLogos.push({
        img: selectedImg,
        x: W + 150,
        y: H * 0.28, // Height in the sky
        w: targetWidth,
        h: targetHeight,
        speed: (speed || 5) * 0.65,
        // Random offset so logos don't vibrate in perfect sync
        vibrateOffset: Math.random() * Math.PI * 2
    });
}

export function updateAndDrawLogos(ctx, W, H, CHAR_W, CHAR_H, speed, gameState) {
    // Current time factor for smooth vibration
    const time = Date.now() * 0.004; 

    for (let i = flyingLogos.length - 1; i >= 0; i--) {
        const logo = flyingLogos[i];
        
        if (gameState === 'playing') {
            logo.x -= logo.speed;
        }

        if (logo.img.isReady) {
            // Calculate vibration (bobbing up and down)
            const vibrateY = logo.y + Math.sin(time + logo.vibrateOffset) * 15;

            ctx.save();
            ctx.globalAlpha = 0.85; // Slight transparency to blend with sky
            ctx.drawImage(logo.img, logo.x, vibrateY, logo.w, logo.h);
            ctx.restore();
        }

        // Remove and respawn
        if (logo.x + logo.w < -100) {
            flyingLogos.splice(i, 1);
            if (gameState === 'playing') {
                spawnFlyingLogo(W, H, CHAR_W, CHAR_H, speed);
            }
        }
    }
}

export function resetLogos() {
    flyingLogos = [];
    lastLogoIndex = -1;
}
