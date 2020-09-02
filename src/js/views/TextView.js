function createTextView(text, x, y, style) {
    let ctx;
    const { fontSize, fill, stroke, textAlign, fontFamily = 'system' } = style;

    return {
        render,
        setContext,
        setText,
        setPosition,
    };

    function setText(t) {
        text = t;
    }

    function setPosition(nx, ny) {
        x = nx;
        y = ny;
    }

    function render() {
        ctx.save();
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fill;
        if (textAlign) {
            ctx.textAlign = textAlign;
        }
        ctx.fillText(text, x, y);
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.strokeText(text, x, y);
        }
        ctx.restore();
    }

    function setContext(c) {
        ctx = c;
    }
}
