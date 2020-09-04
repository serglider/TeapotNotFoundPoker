function createResultPanel(winTexture, loseTexture, onRestart) {
    let w, h, fs, centerW, centerH, scale, origX, origY;
    let isWin = false;
    let isShown = false;
    let isShowing = false;
    let alpha = 0;
    let teapotAlpha = 0;
    let showResolver = () => {};
    // show(true);
    return {
        render,
        show,
        hide,
        updateLayout,
        update,
        mouseListener,
    };

    function mouseListener() {
        if (teapotAlpha === 1) {
            onRestart();
        }
    }

    function updateLayout({ cw, ch }) {
        const minSide = Math.min(cw, ch);
        fs = Math.round(minSide * 0.12);
        centerW = cw;
        centerH = ch;
        scale = 1;
        w = winTexture.width * scale;
        h = winTexture.height * scale;
        while (w > minSide * 1.08) {
            scale -= 0.002;
            w = winTexture.width * scale;
            h = winTexture.height * scale;
        }

        origX = (cw - w) / 2;
        origY = (ch - h) / 2;
    }

    function show(isW) {
        isWin = isW;
        return new Promise((resolve) => {
            showResolver = resolve;
            setTimeout(() => {
                isShown = true;
                isShowing = true;
            }, 1000);
        });
    }

    function hide() {
        return new Promise((resolve) => {
            showResolver = resolve;
            isShowing = false;
        });
    }

    function update() {
        if (isShown) {
            if (isShowing) {
                if (alpha === 1) {
                    teapotAlpha += 0.01;
                    if (teapotAlpha >= 1) {
                        teapotAlpha = 1;
                        showResolver();
                    }
                } else {
                    alpha += 0.02;
                    if (alpha >= 1) {
                        alpha = 1;
                    }
                }
            } else {
                if (teapotAlpha === 0) {
                    alpha -= 0.02;
                    if (alpha <= 0) {
                        alpha = 0;
                        showResolver();
                    }
                } else {
                    teapotAlpha -= 0.01;
                    if (teapotAlpha <= 0) {
                        teapotAlpha = 0;
                    }
                }
            }
        }
    }

    function render(ctx) {
        if (isShown) {
            const color = isWin ? '#668706' : '#DCB600';
            const text = isWin ? 'YOU WON' : 'YOU LOSE';
            const texture = isWin ? winTexture : loseTexture;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, centerW, centerH);
            ctx.save();
            ctx.translate(origX, origY);
            ctx.scale(scale, scale);
            ctx.globalAlpha = teapotAlpha;
            ctx.drawImage(texture, 0, 0);
            ctx.restore();
            if (alpha === 1) {
                ctx.font = `${fs}px "Fredoka One"`;
                ctx.fillText(text, centerW / 2, centerH / 2 + fs / 2);
            }
            ctx.restore();
        }
    }
}
