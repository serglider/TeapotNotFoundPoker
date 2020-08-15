function createCardView(card, x, y, w, h, margin) {
    let ctx;
    let isSelected;
    const back = '🂿';

    return {
        render,
        setContext,
        setSelected,
        setCard,
        getCard,
    };

    function render() {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, w, h - margin / 2);
        ctx.font = `${h}px sans-serif`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillStyle = isSelected ? 'grey' : card.color;
        const text = isSelected ? back : card.string;
        ctx.fillText(text, x, y + margin);

        ctx.restore();
    }

    function setCard(cd) {
        card = cd;
    }

    function getCard() {
        return card;
    }

    function setSelected(isSel) {
        isSelected = isSel;
    }

    function setContext(c) {
        ctx = c;
    }
}
