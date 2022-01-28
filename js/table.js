import { Card, Deck } from "./card.js";

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
    constructor(cards) {
        this.cards = [] || cards;
    }

    addCard(card) {
        let prevCard = this.cards[this.cards.length - 1];
        let prevCardIsBlack = prevCard.suite % 2 == 0;
        let cardIsBlack = card.suite % 2 == 0;
        
        if (prevCardIsBlack == cardIsBlack) {
            return false;
        }
        
        if (prevCard.value > card) {
            this.cards.push(card);
            return true;
        }
        return false;
    }
}

export class Table {
    constructor(pile, foundations, columns) {
        this.pile = pile;
        this.foundations = foundations;
        this.columns = columns;
    }
}