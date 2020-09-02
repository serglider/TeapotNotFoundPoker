function createResultPanel(cw, ch, img1, img2) {
    let ctx, w, h, scale, origX, origY;
    let isWin = false;
    let isShown = false;

    const tf1 = createTextView('Balance Not Found.', 0, 0, {
        fill: 'white',
        fontSize: 42,
    });

    const tf2 = createTextView('You lose', 0, 0, {
        fill: 'white',
        fontSize: 42,
    });

    updateLayout({ cw, ch });

    return {
        render,
        setContext,
        show,
        updateLayout,
    };

    function updateLayout({ cw, ch }) {
        scale = 1;
        const minSide = Math.min(cw, ch);

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

    function render() {
        if (isShown) {
            ctx.save();
            ctx.fillStyle = '#668706';
            ctx.fillRect(0, 0, cw, ch);
            ctx.save();
            ctx.translate(origX, origY);
            ctx.scale(scale, scale);
            let img = isWin ? img1 : img2;
            ctx.drawImage(img, 0, 0);
            ctx.restore();
            tf1.render();
            tf2.render();
            ctx.restore();
        }
    }

    function setContext(c) {
        ctx = c;
        tf1.setContext(c);
        tf2.setContext(c);
    }
}
