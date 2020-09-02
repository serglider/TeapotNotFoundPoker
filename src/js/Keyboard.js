function createKeyboard(isMobile) {
    let listeners = {};
    let keys = [];
    let lastTouch;

    if (isMobile) {
        window.addEventListener('touchstart', onStart);
        window.addEventListener('touchend', onEnd);
    } else {
        window.addEventListener('keyup', handleKeyUp);
    }

    return {
        subscribe,
        reset,
    };

    function reset() {
        listeners = {};
        keys = [];
    }

    function handleKeyUp(e) {
        const dig = Number(e.key);
        const event = {};
        if (isSpace(e.key)) {
            event.isSpace = true;
        } else if (isDigit(dig)) {
            event.digit = dig;
            event.isDigit = true;
        } else {
            event[`is${e.key}`] = true;
        }
        keys.forEach((key) => {
            listeners[key](event);
        });
    }

    function onStart(e) {
        lastTouch = e.timeStamp;
    }
    function onEnd(e) {
        const diff = e.timeStamp - lastTouch;
        if (diff > 1000) {
            const event = {
                isEscape: true,
            };
            keys.forEach((key) => {
                listeners[key](event);
            });
        }
    }

    function subscribe(listener) {
        const key = Date.now();
        listeners[key] = listener;
        keys = Object.keys(listeners);

        return function () {
            delete listeners[key];
            keys = Object.keys(listeners);
        };
    }

    function isDigit(value) {
        return Number.isInteger(value);
    }

    function isSpace(value) {
        return value === ' ';
    }
}
