function createTextView(text, x, y, style) {
    let ctx;
    const { fontSize, fill, stroke, textAlign, fontFamily = 'system' } = style;

    return {
        render,
        setContext,
        setText,
    };

    function setText(t) {
        text = t;
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
