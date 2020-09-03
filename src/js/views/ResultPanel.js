function createResultPanel(img1, img2) {
    let w, h, centerW, centerH, scale, origX, origY;
    let isWin = false;
    let isShown = false;

    const tf1 = createTextView({
        fill: 'white',
    });

    tf1.setText('Balance Not Found.');
    tf1.setFontSize(42);

    const tf2 = createTextView({
        fill: 'white',
    });
    tf2.setText('You lose');
    tf2.setFontSize(42);

    show(true);

    return {
        render,
        show,
        updateLayout,
    };

    function updateLayout({ cw, ch }) {
        scale = 1;
        const minSide = Math.min(cw, ch);

        centerW = cw;
        centerH = ch;
        w = img1.width * scale;
        h = img1.height * scale;
        while (w > minSide * 1.08) {
            scale -= 0.002;
            w = img1.width * scale;
            h = img1.height * scale;
        }

        origX = (cw - w) / 2;
        origY = (ch - h) / 2;

        tf1.setPosition(cw / 2, ch / 2);
        tf2.setPosition(cw / 2, ch / 2 + 42);
    }

    function show(isW) {
        isShown = true;
        isWin = isW;
        if (isWin) {
            tf1.setText('You are a Teapot.');
            tf2.setText('You won.');
        }
    }

    function render(ctx) {
        if (isShown) {
            ctx.save();
            ctx.fillStyle = '#668706';
            ctx.fillRect(0, 0, centerW, centerH);
            ctx.save();
            ctx.translate(origX, origY);
            ctx.scale(scale, scale);
            const img = isWin ? img1 : img2;
            ctx.drawImage(img, 0, 0);
            ctx.restore();
            tf1.render(ctx);
            tf2.render(ctx);
            ctx.restore();
        }
    }
}
