function createHelp() {
    const help = document.querySelector('.help-outer');
    let isShown = false;

    return { toggle };

    function toggle() {
        isShown = !isShown;
        help.style.display = isShown ? 'table' : 'none';
    }
}
