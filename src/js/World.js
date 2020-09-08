function createWorld(onUpdateLayout) {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let objects = [];
    let dynamicObjects = [];
    let mouseListeners = [];
    let resizeObjects = [];
    let isStarted = false;

    // ctx.save();
    // ctx.fill();
    // ctx.font = `100px system`;
    // const back1 = '\ud83c\udcbf';
    // const back2 = '\uD83C\uDCA0';
    // const as = '\ud83c\udca1';
    // let { width } = ctx.measureText(as);
    // console.log(width);
    // ctx.restore();

    canvas.addEventListener('touchstart', onClick);
    canvas.addEventListener('click', onClick);

    window.addEventListener('resize', onResize);

    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';

        const isLandscape = canvas.width > canvas.height;

        const cw = canvas.width;
        const ch = canvas.height;
        const buttonY = ch * 0.8;
        let factor = 0.6;
        let cardH = Math.round(ch * factor);
        let cardW = Math.round(cardH * 0.66);
        let cardGap = Math.round(cardH * 0.06);
        let cardBlockW = 5 * (cardW + cardGap);

        const fs1 = Math.round(ch * 0.045);
        const fs2 = Math.round(fs1 * 0.75);
        const cardsInRow = isLandscape ? 5 : 3;

        while (cardBlockW > cw) {
            factor -= 0.05;
            cardH = Math.round(ch * factor);
            cardW = Math.round(cardH * 0.66);
            cardGap = Math.round(cardH * 0.06);
            cardBlockW = cardsInRow * (cardW + cardGap);
        }

        const cardBlockX = (cw - cardBlockW + cardGap) / 2;
        const cardBlockY = isLandscape ? (ch - cardH) / 2 : ch / 2 - cardH;
        const infoTextY = cardBlockY - fs2;
        const balanceY = Math.min(cardBlockY - fs1 * 2, ch * 0.2);
        const buttonHFactor = isLandscape ? 0.2 : 0.34;
        const buttonH = Math.round(cardH * buttonHFactor);

        const data = {
            cardsInRow,
            cw,
            ch,
            cardH,
            cardW,
            cardGap,
            cardBlockW,
            cardBlockX,
            cardBlockY,
            balanceY,
            buttonY,
            infoTextY,
            buttonH,
            fs1,
            fs2,
        };
        resizeObjects.forEach((obj) => obj.updateLayout(data));
        onUpdateLayout(data);
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';

    requestAnimationFrame(loop);

    return {
        add,
        start,
        stop,
    };

    function start() {
        onResize();
        isStarted = true;
    }

    function stop() {
        isStarted = false;
    }

    function add(...args) {
        args.forEach((o) => addObj(o));
    }

    function addObj(obj) {
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

    function loop(t) {
        if (isStarted) {
            update(t);
            clear();
            render();
        }
        requestAnimationFrame(loop);
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update(t) {
        dynamicObjects.forEach((obj) => obj.update(t));
    }

    function render() {
        objects.forEach((obj) => obj.render(ctx));
    }
}
