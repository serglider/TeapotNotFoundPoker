function createCoinView(x, y, r) {
    let ctx;

    return {
        render,
        setContext,
    };

    function render() {
        ctx.save();
        ctx.strokeStyle = 'green';
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.font = `bold ${r * 2}px sans-serif`;
        ctx.fillStyle = 'white';
        ctx.fillText('$', x, y + 5);
        ctx.strokeText('$', x, y + 5);

        ctx.restore();
    }

    function setContext(c) {
        ctx = c;
    }
}
