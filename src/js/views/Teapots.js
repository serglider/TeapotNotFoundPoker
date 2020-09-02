function createTeapots(cw, img1, img2) {
    let ctx, num, dx, scale, w;
    updateLayout({ cw });

    return {
        render,
        setContext,
        setNumber,
        updateLayout,
    };

    function updateLayout({ cw }) {
        dx = cw / 14;
        scale = 0.06;
        w = img1.width * scale;
        while (w > dx) {
            scale -= 0.002;
            w = img1.width * scale;
        }
    }

    function setNumber(n) {
        num = n;
    }

    function render() {
        ctx.save();
        ctx.scale(scale, scale);
        for (let i = 0; i < 14; i++) {
            const f = dx / 2 - w / 2;
            let img = i < num ? img1 : img2;
            ctx.drawImage(img, (dx * i + f) / scale, 0);
        }
        ctx.restore();
    }

    function setContext(c) {
        ctx = c;
    }
}
