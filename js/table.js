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
        card.moveDom(prevCard);
        this.updateHTML();
        return true;
    }

    remCard() {
        this.cards.pop();
    }

    revealCard() {
        let lastCard = this.cards[this.cards.length - 1];
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
                cards.push(new Card(value, suite, false, this));
            }
        }

        // Generate the columns
        for (let i = 0; i < this.columns.length; i++) {
            for (let j = 0; j < i + 1; j++) {
                let cardIndex = Math.floor(Math.random() * cards.length);
                let card = cards[cardIndex];
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
                let dom = document.createElement("p");
                col.dom.appendChild(dom);
                col.cards[j].dom = dom;
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

    moveCard() {
        for (let i = 0; i < this.columns.length; i++) {
            let colCards = this.columns[i].cards;
            for (let j = 0; j < colCards.length; j++) {
                if (colCards[j] == this.selectedCardA) {
                    this.columns[i].remCard();
                    this.columns[i].revealCard();
                }
            }
        }

        for (let i = 0; i < this.columns.length; i++) {
            let colCards = this.columns[i].cards;
            for (let j = 0; j < colCards.length; j++) {
                if (colCards[j] == this.selectedCardB) {
                    this.columns[i].addCard(this.selectedCardA);
                }
            }
        }

        console.log(this.columns);

        this.selectedCardA = null;
        this.selectedCardB = null;
    }
}