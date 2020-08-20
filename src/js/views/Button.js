function createButton(cx, cy, w, h, text, listener) {
    let ctx;
    let isInteractive = false;
    const x = cx - w / 2;
    const y = cy - h / 2;
    const r = Math.round(h * 0.1);

    return {
        render,
        setContext,
        setText,
        mouseListener,
        setInteractive,
    };

    function setInteractive(isActive) {
        isInteractive = isActive;
    }

    function setText(t) {
        text = t;
    }

    function mouseListener(point) {
        if (isInteractive && isPointInside(point)) {
            listener();
        }
    }

    function isPointInside(point) {
        return inRange(point.x, x, x + w) && inRange(point.y, y, y + h);
    }

    function inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    }

    function render() {
        ctx.save();
        ctx.fillStyle = '#C35B68';
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `${h / 2}px fantasy`;
        ctx.fillText(text, cx, cy);
        ctx.restore();
    }

    function setContext(c) {
        ctx = c;
    }
}
