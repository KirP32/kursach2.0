const AllSize = 9;
const SmallSize = 3;

var lvl__choosen = 0;
// выбранный уровень будет браться из уровня сложности
export function OnStart(x) {
    lvl__choosen = x;
    const sudoku = Grid(); // создаём поле 81 клетка
    FillGrid(sudoku);
    console.table(sudoku);
    return Clear(sudoku);
}

function Grid() {
    return new Array(AllSize).fill().map(() => new Array(AllSize).fill(null)); // массив из 9 массивов заполненые 0
}

// заполняем массив числами
// Алгоритм: фун-ия находит пустую ячейку и пытается добавить значение
// проверяя, что значение не повторяется в строке, столбце и маленьком квадрате (3x3)
// после добавления числа ф-ия вызывает сама себя, ищет пустую ячейку и т.д. пока сетка не заполнится
// если сетка заполнена некорректно, удалит последнее значение, возвращается на шаг вверх и пробует другое значение

function FillGrid(grid) {
    // Ищем пустую ячейку
    let EmptyCell = findcell(grid);
    if (!EmptyCell) return true; // заполнен
    else {
        let numbers = Array.from({ length: 9 }, (value, i) => i + 1);
        for (let index = 0; index < numbers.length; index++) {
            let numindex = Math.floor(Math.random() * (index + 1));
            [numbers[index], numbers[numindex]] = [numbers[numindex], numbers[index]];
        }
        // добавляем число в ячейку
        for (let i = 0; i < numbers.length; i++) {
            // проверка подходит ли число
            if (!Checked(grid, EmptyCell.row, EmptyCell.column, numbers[i])) continue;

            grid[EmptyCell.row][EmptyCell.column] = numbers[i];

            if (FillGrid(grid)) return true; // успешно заполнили ячейку

            grid[EmptyCell.row][EmptyCell.column] = null; // не успешно
        }
    }
}

function Clear(grid) {
    let i = 0;
    while (i < lvl__choosen) {
        let random_row = Math.floor(Math.random() * AllSize);
        let random_column = Math.floor(Math.random() * AllSize);
        if (grid[random_row][random_column] !== null) {
            grid[random_row][random_column] = null;
            i++;
        }
    }

    return grid;
}

export function findcell(a) {
    for (let row = 0; row < AllSize; row++) {
        for (let column = 0; column < AllSize; column++) {
            if (a[row][column] === null) return { row, column };
        }
    }
    return null; // если нет пустых ячеек
}

function Checked(grid, row, column, value) {
    return checkColumn(grid, row, column, value)
        && checkRow(grid, row, column, value) && checkSquare(grid, row, column, value);

}

function checkColumn(grid, row, column, value) {
    for (let j = 0; j < AllSize; j++) {
        if (grid[j][column] === value && j !== row) {
            return false;
        }
    }
    return true;
}

function checkRow(grid, row, column, value) {
    for (let j = 0; j < AllSize; j++) {
        if (grid[row][j] === value && j !== column) {
            return false;
        }
    }
    return true;
}

function checkSquare(grid, row, column, value) {
    let beginRow = row - row % SmallSize;
    let beginColumn = column - column % SmallSize;
    for (let i = beginRow; i < beginRow + SmallSize; i++) {
        for (let j = beginColumn; j < beginColumn + SmallSize; j++) {
            if (grid[i][j] === value && i !== row && j !== column) return false;
        }
    }
    return true;
}