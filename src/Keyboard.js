function createKeyboard() {
    let listeners = {};
    let keys = [];

    window.addEventListener('keyup', handleKeyUp);

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
        } else if (isPlus(e.key)) {
            event.isPlus = true;
        } else if (isMinus(e.key)) {
            event.isMinus = true;
        } else if (isDigit(dig)) {
            event.digit = dig;
            event.isDigit = true;
        } else {
            event[`is${e.key}`] = true;
        }
        keys.forEach((key) => listeners[key] && listeners[key](event));
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

    function isPlus(value) {
        return value === '+';
    }

    function isMinus(value) {
        return value === '-';
    }
}
