function createTextView(text, x, y, style) {
    let ctx;
    const { fontSize, fill, stroke } = style;

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
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = fill;
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
