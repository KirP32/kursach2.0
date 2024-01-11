import { Sudoku } from "./sudoku.js";

const AllSize = 9;
const SmallSize = 3;

let cells = document.querySelectorAll(".container__grid__cell");
let counter = 0;
let dif = 0;
let flag = false;
let sudoku;
let counter_clear = 0;
let SelectedCell;
let VictoryFlag = false;
let SelectedIndex = 0;
let score = 0;
let past = 0, pastIndex = 0;
InsertScore();

window.setDifficulty = setDifficulty;

export function setDifficulty(x) {
    dif = x;
    flag = true;
}

function InsertScore() {
    function fetchData() {
        document.getElementById('ScoresContainer').innerHTML = '';
        fetch('display_score.php')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    document.getElementById('ScoresContainer').innerHTML += `<p>Name: ${item.name} <br> Score: ${item.score}</p>`;
                });
            })
    }
    fetchData();
}


let PlayButton = document.querySelector("#btn-play");
PlayButton.addEventListener("click", () => PlayButtonClicked());

function PlayButtonClicked() {
    let name = document.querySelector("#input-name").value;
    if (name.length <= 3) {
        alert("Длина имени не может быть меньше 4 символов");
    }
    else {
        if (flag === false) {
            alert("Сложность тоже нужно выбирать!");
        }
        else {
            VictoryFlag = false;
            counter = 0;
            score = 0;
            cleargrid();
            ButtonsInIt();
            KeyInput();
            sudoku = new Sudoku(dif);
            main();
        }
    }
}

function main() {
    document.querySelector(".container").classList.remove("start");
    for (let i = 0; i < AllSize; i++) {
        for (let j = 0; j < AllSize; j++) {
            if (sudoku.grid[i][j] !== null && cells[counter]) {
                cells[counter].innerHTML = sudoku.grid[i][j];
                cells[counter].classList.add("fill");
            }   
            counter++;
        }
    }

    cells.forEach((cell, index) => { cell.addEventListener("click", () => CellClick(cell, index)) });

}

function ButtonClicked(x) {
    if (!VictoryFlag) {
        if (SelectedCell === null || SelectedCell.classList.contains(".fill")) {
            return;
        }
        cells.forEach(cell => cell.classList.remove("wrong", "help"));
        SelectedCell.classList.add("clicked");

        let row = Math.floor(SelectedIndex / AllSize);
        let column = SelectedIndex % AllSize;
        let WrongPositions = sudoku.DuplicatePositions(row, column, x);
        if (WrongPositions.length > 0) {
            WrongPositions.forEach(position => {
                let index = position.row * AllSize + position.column;
                cells[index].classList.add("wrong");
            });

            if (x != past && SelectedIndex != pastIndex) {
                score -= 5;
                document.querySelector(".score").querySelector("span").innerHTML = `${score}`;
            }
            past = x;
            pastIndex = SelectedIndex;
            return;
        }
        if (x != past && SelectedIndex != pastIndex) {
            score += 10;
            document.querySelector(".score").querySelector("span").innerHTML = `${score}`;
        }
        past = x;
        pastIndex = SelectedIndex;
        sudoku.grid[row][column] = x;
        SelectedCell.innerHTML = x;
        const PlayerName = document.getElementById('input-name').value;
        const PlayerScore = document.getElementById('ScoreBD').textContent;
        if (sudoku.EmptyCells() == false) {
            VictoryFlag = true;
            fetch('req_connection.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'PlayerName=' + encodeURIComponent(PlayerName) +
                    '&PlayerScore=' + encodeURIComponent(PlayerScore),
            })
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            alert("Вы победили!");
        }
    }


}


function CellClick(cell, index) {
    if (!VictoryFlag) {
        cells.forEach(cell => cell.classList.remove("clicked", "highlighted", "help", "wrong"));
        if (cell.classList.contains("fill") == false) {
            SelectedCell = cell;
            SelectedIndex = index;
            cell.classList.add("clicked");  
            highlight(index);
        }
        past = 0, pastIndex = 0;
        if (cell.innerHTML === "") return;
        cells.forEach(value => {
            if (value.innerHTML === cell.innerHTML) value.classList.add("help")
        });
    }

}

function highlight(index) {
    // выделить
    // колонку
    let columnIndex = index % 9;
    for (let i = 0; i < AllSize; i++) {
        cells[columnIndex + i * 9].classList.add("highlighted");
    }
    // строку
    let rowIndex = Math.floor(index / AllSize);
    for (let i = 0; i < AllSize; i++) {
        cells[rowIndex * AllSize + i].classList.add("highlighted");
    }
    // квадрат
    let beginRow = rowIndex - rowIndex % SmallSize;
    let beginColumn = columnIndex - columnIndex % SmallSize;
    for (let i = beginRow; i < beginRow + SmallSize; i++) {
        for (let j = beginColumn; j < beginColumn + SmallSize; j++) {
            cells[i * AllSize + j].classList.add("highlighted");
        }
    }
}

function cleargrid() {
    cells.forEach(cell => cell.classList.remove("clicked", "highlighted", "help", "fill", "wrong"));
    for (let i = 0; i < AllSize; i++) {
        for (let j = 0; j < AllSize; j++) {
            if (cells[counter_clear]) {
                cells[counter_clear].innerHTML = "";

            }
            counter_clear++;
        }
    }
    counter_clear = 0;
}
function ButtonsInIt() {
    let ButtonsArray = document.querySelectorAll(".button");
    ButtonsArray.forEach(button => { button.addEventListener("click", () => ButtonClicked(parseInt(button.innerHTML))) });
    document.querySelector(".delete-button").addEventListener("click", () => DeleteClicked());

}

function DeleteClicked() {
    if (!VictoryFlag) {
        if (SelectedCell.classList.contains("fill")) return;
        let row = Math.floor(SelectedIndex / AllSize);
        let column = SelectedIndex % AllSize;
        SelectedCell.innerHTML = "";
        sudoku.grid[row][column] = null;
        cells.forEach(cell => cell.classList.remove("wrong", "help"));
    }

}

function KeyInput() {
    if (!VictoryFlag) {
        document.addEventListener("keydown", button => {
            if (button.key == 'Backspace') {
                DeleteClicked();
            }
            else if (button.key >= '1' && button.key <= '9') {
                ButtonClicked(parseInt(button.key));
            }
        });
    }

}