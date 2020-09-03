function createTextView(style) {
    let text = '',
        x,
        y,
        fs;
    let { fill, stroke, textAlign, fontFamily = 'system' } = style;

    return {
        render,
        setText,
        setPosition,
        setFontSize,
        setContext,
    };

    function setText(t) {
        text = t;
    }

    function setPosition(nx, ny) {
        x = nx;
        y = ny;
    }

    function setFontSize(fontSize) {
        fs = fontSize;
    }

    function render(ctx) {
        ctx.save();
        ctx.font = `${fs}px ${fontFamily}`;
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
        // ctx = c;
    }
}
