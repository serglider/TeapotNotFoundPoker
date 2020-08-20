function createCardView(x, y, w, h, margin) {
    let ctx;
    let card;
    const halfMargin = margin / 2;
    const back = '\ud83c\udcbf';

    let isFlipped = true;
    let isSwap = false;
    let scaleY = 1;
    let add = -0.16;
    let flipResolver = () => {};

    return {
        render,
        setContext,
        flip,
        setCard,
        getCard,
        isPointInside,
        update,
    };

    function isPointInside(point) {
        return inRange(point.x, x, x + w) && inRange(point.y, y, y + h);
    }

    function inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    }

    function render() {
        ctx.save();
        const shiftY = (h - halfMargin) / 2;
        ctx.translate(x, y + shiftY);
        ctx.scale(1, scaleY);
        ctx.fillStyle = 'white';
        ctx.roundRect(0, shiftY * -1, w, h - halfMargin, halfMargin);
        ctx.fill();
        ctx.font = `${h}px sans-serif`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillStyle = isFlipped ? '#DCB600' : card.color;
        const text = isFlipped ? back : card.string;
        ctx.fillText(text, 0, shiftY * -1 + margin);

        ctx.restore();
    }

    function update() {
        if (isSwap) {
            scaleY += add;
            if (scaleY <= 0) {
                scaleY = 0;
                add *= -1;
                isFlipped = !isFlipped;
            } else if (scaleY >= 1) {
                scaleY = 1;
                add *= -1;
                isSwap = false;
                flipResolver();
            }
        }
    }

    function setCard(cd) {
        card = cd;
    }

    function getCard() {
        return card;
    }

    function flip(dt) {
        add = -1 * dt;
        isSwap = true;
        return new Promise((resolve) => {
            flipResolver = resolve;
        });
    }

    function setContext(c) {
        ctx = c;
    }
}
