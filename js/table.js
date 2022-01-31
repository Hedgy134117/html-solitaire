import { Card } from "./card.js";

export class Pile {
    constructor(cards) {
        this.cards = [] || cards;
        this.current = null;
        this.drawn = [];
    }

    draw() {
        this.drawn.push(this.current);
        if (this.cards.length <= 0) {
            this.cards = this.drawn;
            this.drawn = [];
            this.current = null;
            return null;
        }
        this.current = this.cards.pop();
    }
}

export class Foundation {
    constructor(suite) {
        this.suite = suite;
        this.cards = [];
    }

    addCard(card) {
        if (card.suite != this.suite) {
            return false;
        }

        if (this.cards.length == 0) {
            if (card.value == 1) {
                this.cards.push(card);
            }
            else {
                return false;
            }
        }

        if (card.value > this.cards[this.cards.length - 1]) {
            this.cards.push(card);
        }
        return false;
    }
}

export class Column {
    constructor(id, cards, dom) {
        this.id = id;
        this.cards = [] || cards;
        this.dom = dom;
    }

    addCard(card) {
        let prevCard = this.cards[this.cards.length - 1];
        let prevCardIsBlack = prevCard.suite % 2 == 0;
        let cardIsBlack = card.suite % 2 == 0;

        if (prevCardIsBlack == cardIsBlack) {
            return false;
        }

        if (prevCard.value < card.value) {
            return false;
        }

        this.cards.push(card);
        this.updateHTML();
        return true;
    }

    remCard() {
        this.cards.pop();
    }

    revealCard() {
        let lastCard = this.cards[this.cards.length - 1];
        if (lastCard == undefined) {
            return;
        }
        if (lastCard.visible) {
            return;
        }

        lastCard.visible = true;
        this.updateHTML();
    }

    updateHTML() {
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].updateHTML();
        }
    }
}

export class Table {
    constructor(pile, foundations, columns) {
        this.pile = new Pile() || pile;
        this.foundations = [];
        if (foundations) {
            this.foundations = foundations;
        }
        else {
            for (let i = 0; i < 4; i++) {
                this.foundations.push(new Foundation(i));
            }
        }

        this.columns = [];
        if (columns) {
            this.columns = columns;
        }
        else {
            for (let i = 0; i < 7; i++) {
                this.columns.push(new Column(i, [], document.querySelector(`#col-${i + 1}`)));
            }
        }

        this.selectedCardA = null;
        this.selectedCardB = null;
    }

    updateHTML() {
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].updateHTML();
        }
    }

    generateGame() {
        // Generate the deck
        let cards = [];
        for (let suite = 0; suite < 4; suite++) {
            for (let value = 1; value <= 13; value++) {
                cards.push(new Card(value, suite, false, this, null));
            }
        }

        // Generate the columns
        for (let i = 0; i < this.columns.length; i++) {
            for (let j = 0; j < i + 1; j++) {
                let cardIndex = Math.floor(Math.random() * cards.length);
                let card = cards[cardIndex];
                card.col = this.columns[i];
                if (!(j + 1 < i + 1)) {
                    card.visible = true;
                }
                cards.splice(cardIndex, 1);
                this.columns[i].cards.push(card);
            }
        }

        // Go through each card in each column and create its dom element
        for (let i = 0; i < this.columns.length; i++) {
            let col = this.columns[i];
            for (let j = 0; j < col.cards.length; j++) {
                let card = col.cards[j];
                let dom = document.createElement("p");
                /* 
                Just adding the event listener to call the function "action" on the card makes `this` the
                DOM object instead of the card itself. By using bind, we make sure that when the DOM object
                is clicked on, `this` is the card object itself, not the DOM object.
                https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
                */
                let action = card.action.bind(card);
                dom.addEventListener("click", action);
                card.dom = dom;
                col.dom.appendChild(dom);
            }
        }

        // Randomly place the remaining cards in the pile
        while (cards.length > 0) {
            let cardIndex = Math.floor(Math.random() * cards.length);
            let card = cards[cardIndex];
            cards.splice(cardIndex, 1);
            this.pile.cards.push(card);
        }
    }

    resetSelectedCards() {
        this.selectedCardA.unhighlight();
        this.selectedCardA = null;
        this.selectedCardB = null;
    }

    moveCard() {
        // selectedCardA = Card to be moved
        // selectedCardB = Card to move to
        if (this.selectedCardA == this.selectedCardB) {
            this.resetSelectedCards();
            return;
        }

        let success = this.selectedCardB.col.addCard(this.selectedCardA);
        console.log(success);
        if (!success) {
            this.resetSelectedCards();
            return;
        }
        this.selectedCardA.col.remCard();
        this.selectedCardA.col.revealCard();
        this.selectedCardA.col = this.selectedCardB.col;

        this.selectedCardB.col.dom.appendChild(this.selectedCardA.dom);

        this.resetSelectedCards();
    }
}