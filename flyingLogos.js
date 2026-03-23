const logoFiles = ['logocreality.svg', 'logoelegoo.svg', 'logoesun.svg'];
const logoImages = logoFiles.map(src => {
    const img = new Image();
    img.src = src;
    img.isReady = false; // Custom flag
    img.onload = () => {
        img.isReady = true;
        console.log(`${src} loaded successfully`);
    };
    img.onerror = () => console.error(`${src} failed to load: ${src}`);
    return img;
});

let flyingLogos = [];
let lastLogoIndex = -1;

export function spawnFlyingLogo(W, H, CHAR_W, CHAR_H, speed) {
    let index;
    // Ensure we have logos to pick from
    if (logoImages.length === 0) return;

    do {
        index = Math.floor(Math.random() * logoImages.length);
    } while (index === lastLogoIndex && logoImages.length > 1);

    lastLogoIndex = index;

    // Use a fixed area in the sky (30% from top)
    const fixedY = H * 0.3; 

    flyingLogos.push({
        img: logoImages[index],
        x: W + 100,
        y: fixedY,
        w: CHAR_W * 1.8, // Slightly larger
        h: (CHAR_W * 1.8) * 0.4, 
        speed: (speed || 5) * 0.6 // Fallback speed if speed is 0
    });
}

export function updateAndDrawLogos(ctx, W, H, CHAR_W, CHAR_H, speed, gameState) {
    for (let i = flyingLogos.length - 1; i >= 0; i--) {
        const logo = flyingLogos[i];
        
        if (gameState === 'playing') {
            logo.x -= logo.speed;
        }

        // Only draw if the image is actually loaded
        if (logo.img.isReady) {
            ctx.save();
            ctx.globalAlpha = 0.8; // Subtle transparency for sky logos
            ctx.drawImage(logo.img, logo.x, logo.y, logo.w, logo.h);
            ctx.restore();
        }

        // Reset/Respawn logic
        if (logo.x + logo.w < -50) {
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