function createActionButton(listener) {
    let isInteractive = false;
    let x,
        y,
        cx,
        cy,
        w,
        h,
        r,
        fs,
        text = '';

    return {
        render,
        setText,
        mouseListener,
        setInteractive,
        updateLayout,
    };

    function updateLayout({
        cardBlockX,
        buttonY,
        buttonH,
        cw,
        cardBlockW,
        cardGap,
    }) {
        x = cardBlockX;
        y = buttonY;
        cx = cw / 2;
        cy = buttonY + buttonH / 2;
        w = cardBlockW - cardGap;
        h = buttonH;
        r = Math.round(h * 0.1);
        fs = Math.round(h * 0.66);
    }

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

    function render(ctx) {
        ctx.save();
        ctx.fillStyle = '#C35B68';
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
        ctx.fillStyle = '#DCB600';
        ctx.font = `${fs}px "Fredoka One"`;
        ctx.fillText(text, cx, cy);
        ctx.restore();
    }
}
