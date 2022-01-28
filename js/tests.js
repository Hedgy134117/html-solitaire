import { Card } from "./card.js";
import { Pile, Foundation, Column, Table } from "./table.js";

let table = new Table();
table.generateGame();
table.updateHTML();
console.log(table);
