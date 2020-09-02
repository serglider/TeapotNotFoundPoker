function createWorld() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let objects = [];
    let dynamicObjects = [];
    let mouseListeners = [];
    let resizeObjects = [];

    canvas.addEventListener('touchstart', onClick);
    canvas.addEventListener('click', onClick);

    window.addEventListener('resize', onResize);

    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';

        const cw = canvas.width;
        const ch = canvas.height;
        const buttonY = ch * 0.8;
        let factor = 0.6;
        let cardH = Math.round(ch * factor);
        let cardW = Math.round(cardH * 0.66);
        let cardGap = Math.round(cardH * 0.06);
        let cardBlockW = 5 * (cardW + cardGap);
        const balanceY = ch * 0.2;

        const fs1 = Math.round(ch * 0.045);
        const fs2 = Math.round(fs1 * 0.75);

        while (cardBlockW > cw) {
            factor -= 0.05;
            cardH = Math.round(ch * factor);
            cardW = Math.round(cardH * 0.66);
            cardGap = Math.round(cardH * 0.06);
            cardBlockW = 5 * (cardW + cardGap);
        }

        const cardBlockX = (cw - cardBlockW + cardGap) / 2;
        const cardBlockY = (ch - cardH) / 2;
        const infoTextY = cardBlockY - cardGap * 1.5;
        const buttonH = Math.round(cardH * 0.2);

        const data = {
            orientation:
                canvas.width > canvas.height ? 'landscape' : 'portrait',
            cw,
            ch,
            cardH,
            cardW,
            cardGap,
            cardBlockX,
            cardBlockY,
        };
        resizeObjects.forEach((obj) => obj.updateLayout(data));
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';

    requestAnimationFrame(loop);

    return {
        getBounds,
        add,
        // reset,
    };

    function getBounds() {
        return [canvas.width, canvas.height];
    }

    function add(obj) {
        obj.setContext(ctx);
        objects.push(obj);
        if (typeof obj.mouseListener === 'function') {
            mouseListeners.push(obj.mouseListener);
        }
        if (typeof obj.update === 'function') {
            dynamicObjects.push(obj);
        }
        if (typeof obj.updateLayout === 'function') {
            resizeObjects.push(obj);
        }
    }

    function onClick(e) {
        const mouse = getMousePosition(e);
        mouseListeners.forEach((listener) => listener(mouse));
    }

    function getMousePosition(e) {
        const bcr = canvas.getBoundingClientRect();
        return {
            x: e.pageX - bcr.left,
            y: e.pageY - bcr.top,
        };
    }

    // function reset() {
    //     objects = [];
    //     dynamicObjects = [];
    //     mouseListeners = [];
    // }

    function loop(t) {
        update(t);
        clear();
        render();
        requestAnimationFrame(loop);
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update(t) {
        dynamicObjects.forEach((obj) => obj.update(t));
    }

    function render() {
        objects.forEach((obj) => obj.render());
    }
}
