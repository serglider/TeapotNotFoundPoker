function createCardView() {
    let card, x, y, w, h, margin, halfMargin;
    // const back = '\ud83c\udcbf';
    const back = '\uD83C\uDCA0';

    let isFlipped = true;
    let isSwap = false;
    let scaleX = 1;
    let add = -0.16;
    let flipResolver = () => {};
    const isFF = navigator.userAgent.includes('Firefox');

    return {
        render,
        flip,
        flipBack,
        setCard,
        getCard,
        isPointInside,
        update,
        updateLayout,
    };

    function updateLayout({ cx, cy, cardH, cardW, cardGap, cardBlockY }) {
        y = cy;
        x = cx;
        w = cardW;
        h = cardH;
        margin = isFF ? cardGap / 2 : cardGap;
        halfMargin = cardGap / 2;
    }

    function isPointInside(point) {
        return inRange(point.x, x, x + w) && inRange(point.y, y, y + h);
    }

    function inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    }

    function render(ctx) {
        ctx.save();
        const shiftX = w / 2;
        ctx.translate(x + shiftX, y);
        ctx.scale(scaleX, 1);
        ctx.fillStyle = 'white';
        ctx.roundRect(shiftX * -1, 0, w, h - halfMargin, halfMargin);
        ctx.fill();
        ctx.font = `${h}px system`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillStyle = isFlipped ? '#DCB600' : card.color;
        const text = isFlipped ? back : card.string;
        ctx.fillText(text, shiftX * -1, margin);

        ctx.restore();
    }

    function update() {
        if (isSwap) {
            scaleX += add;
            if (scaleX <= 0) {
                scaleX = 0;
                add *= -1;
                isFlipped = !isFlipped;
            } else if (scaleX >= 1) {
                scaleX = 1;
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

    function flipBack() {
        isFlipped = true;
    }
}
