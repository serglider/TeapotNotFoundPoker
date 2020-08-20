function createWorld() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let objects = [];
    let dynamicObjects = [];
    let mouseListeners = [];

    canvas.addEventListener('click', onClick);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';

    requestAnimationFrame(loop);

    return {
        getBounds,
        add,
        reset,
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

    function reset() {
        objects = [];
        dynamicObjects = [];
    }

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
