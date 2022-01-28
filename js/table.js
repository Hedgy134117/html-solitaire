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
    constructor(id, cards) {
        this.id = id;
        this.cards = [] || cards;
        this.dom = [];
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

    updateHTML() {
        for (let i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            let str = `${card.getStrValue()}${card.getStrSuite()}`;
            this.dom[i].innerText = str;
            this.dom[i].style.color = card.isBlack() ? "black" : "red";
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
                this.columns.push(new Column(i));
            }
        }
        this.setColumnHTML();
    }

    updateHTML() {
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].updateHTML();
        }
    }

    setColumnHTML() {
        let rows = document.querySelectorAll(".row");
        console.log(rows);
        for (let row of rows) {
            for (let i = 0; i < this.columns.length; i++) {
                let el = row.children[i]
                this.columns[i].dom.push(el);
            }
        }
    }

    generateGame() {
        // Generate the deck
        let cards = [];
        for (let suite = 0; suite < 4; suite++) {
            for (let value = 1; value <= 13; value++) {
                cards.push(new Card(value, suite));
            }
        }

        // Generate the columns
        for (let i = 0; i < this.columns.length; i++) {
            for (let j = 0; j < i + 1; j++) {
                let cardIndex = Math.floor(Math.random() * cards.length);
                let card = cards[cardIndex];
                cards.splice(cardIndex, 1);
                this.columns[i].cards.push(card);
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
}