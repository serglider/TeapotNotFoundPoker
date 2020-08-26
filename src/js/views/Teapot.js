function createTeapots(cw) {
    let isLoaded = 0;
    const dx = cw / 14;
    let ctx, scale, img1, img2, w, num;
    img1 = new Image();
    img1.onload = () => {
        isLoaded += 0.5;
        scale = 0.06;
        w = img1.width * scale;
        while (w > dx) {
            scale -= 0.002;
            w = img1.width * scale;
        }
    };
    img1.src = 'assets/teapot_y.svg';

    img2 = new Image();
    img2.onload = () => (isLoaded += 0.5);
    img2.src = 'assets/teapot_p.svg';

    return {
        render,
        setContext,
        setNumber,
    };

    function setNumber(n) {
        num = n;
    }

    function render() {
        if (isLoaded === 1) {
            ctx.save();
            ctx.scale(scale, scale);
            for (let i = 0; i < 14; i++) {
                const f = dx / 2 - w / 2;
                let img = i < num ? img1 : img2;
                ctx.drawImage(img, (dx * i + f) / scale, 0);
            }
            ctx.restore();
        }
    }

    function setContext(c) {
        ctx = c;
    }
}
