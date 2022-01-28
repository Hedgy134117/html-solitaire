import { Card, Deck } from "./card.js";
import { Pile, Foundation, Column, Table } from "./table.js";

let pile = new Pile(new Deck().cards);

let foundations = [];
for (let i = 0; i < 4; i++) {
    foundations.push(new Foundation(i));
}

let columns = []
for (let i = 0; i < 7; i++) {
    columns.push(new Column());
}

let table = new Table(pile, foundations, columns);
console.log(table);
