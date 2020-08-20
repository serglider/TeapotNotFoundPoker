function createCardView(x, y, w, h, margin) {
    let ctx;
    let card;
    let isSelected;
    const halfMargin = margin / 2;
    const back = '🂿';

    return {
        render,
        setContext,
        setSelected,
        setCard,
        getCard,
        isPointInside,
    };

    function isPointInside(point) {
        return inRange(point.x, x, x + w) && inRange(point.y, y, y + h);
    }

    function inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    }

    function render() {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.roundRect(x, y, w, h - halfMargin, halfMargin);
        ctx.fill();
        ctx.font = `${h}px sans-serif`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        const isBack = isSelected || !card;
        ctx.fillStyle = isBack ? '#DCB600' : card.color;
        const text = isBack ? back : card.string;
        ctx.fillText(text, x, y + margin);

        ctx.restore();
    }

    function setCard(cd) {
        card = cd;
    }

    function getCard() {
        return card;
    }

    function setSelected(isSel) {
        isSelected = isSel;
    }

    function setContext(c) {
        ctx = c;
    }
}
