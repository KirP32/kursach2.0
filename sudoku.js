import { OnStart, findcell } from "./OnStart.js";

const AllSize = 9;
const SmallSize = 3;

export class Sudoku {
  constructor(difficulty = 0) {
    this.grid = OnStart(difficulty);
  }

  DuplicatePositions(row, column, value) {
    const dup_Column = this.find_dup_column(row, column, value)
    const dupl_Row = this.find_dup_row(row, column, value);
    const dup_square = this.find_dup_square(row, column, value);

    const duplicates = [...dup_Column, ...dupl_Row, ...dup_square];
    return duplicates;
  }

  find_dup_column(row, column, value) {
    const duplicates = [];
    for (let i = 0; i < AllSize; i++) {
      if (this.grid[i][column] === value && i !== row) {
        duplicates.push({ row: i, column: column });
      }
    }
    return duplicates;
  }

  find_dup_row(row, column, value) {
    const duplicates = [];
    for (let i = 0; i < AllSize; i++) {
      if (this.grid[row][i] === value && i !== column) {
        duplicates.push({ row: row, column: i });
      }
    }
    return duplicates;
  }

  find_dup_square(row, column, value) {
    const duplicates = [];
    const beginRow = row - row % SmallSize;
    const beginColumn = column - column % SmallSize;

    for (let i = beginRow; i < beginRow + SmallSize; i++) {
      for (let j = beginColumn; j < beginColumn + SmallSize; j++) {
        if (this.grid[i][j] === value && i !== row && j !== column) {
          duplicates.push({ row: i, column: j });
        }
      }
    }
    return duplicates;
  }

  EmptyCells() {
    return Boolean(findcell(this.grid));
  }
}