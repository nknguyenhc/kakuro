from typing import Callable

class UnsatifiableError(Exception):
    def __init__(self, message: str):
        self.message = message

class Sentence:
    def __init__(self, sum: int, is_col: bool, start: int, end: int):
        self.sum = sum
        self.is_col = is_col
        self.start = start
        self.end = end
        self.possible_combinations = self._find_possible_combinations(sum, end - start + 1, 0)
    
    def _find_possible_combinations(self, sum: int, count: int, floor: int) -> list[set[int]]:
        """Finds all possible combinations of `count` numbers that sum to `sum` and are greater than `floor`."""
        assert count >= 1
        if count == 1:
            return [{sum}] if sum > floor and sum < 10 else []
        
        combinations: list[set[int]] = []
        for i in range(floor + 1, 10):
            sub_combinations = self._find_possible_combinations(sum - i, count - 1, i)
            for sub_combination in sub_combinations:
                combinations.append({i} | sub_combination)
        return combinations
    
    def is_index_in_range(self, index: int):
        return self.start <= index <= self.end
    
    def place(self, integer: int) -> list[set[int]]:
        """Place the number, returning all combinations that are removed from this sentence."""
        possible_combinations = list(filter(lambda combination: integer in combination, self.possible_combinations))
        if len(possible_combinations) == 0:
            raise UnsatifiableError(
                f"No possible combinations left for sentence, {self}")
        removed_combinations = list(filter(lambda combination: integer not in combination, self.possible_combinations))
        self.possible_combinations = possible_combinations
        return removed_combinations
    
    def add_back(self, combinations: list[set[int]]):
        """Add back the combinations that were removed."""
        self.possible_combinations += combinations
    
    def __repr__(self):
        return f"Sentence({self.sum=}, {self.is_col=}, {self.start=}, {self.end=}, {self.possible_combinations=})"
    
    def __str__(self):
        return self.__repr__()


class Cell:
    def __init__(self, row: int, col: int,
                 row_sentence: Sentence, col_sentence: Sentence,
                 row_values: set[int], col_values: set[int]):
        self.row = row
        self.col = col
        self.row_sentence = row_sentence
        self.col_sentence = col_sentence
        self.row_values = row_values
        self.col_values = col_values
        self.value: int | None = None
        self.possible_values = set()
        self.calculate_possible_values()
        self.removed_row_combinations: list[set[int]] | None = None
        self.removed_col_combinations: list[set[int]] | None = None
    
    def calculate_possible_values(self) -> tuple[int, int] | None:
        """Calculate the possible values for this cell.
        Returns None if the cell has already been solved,
        or a tuple of previous count of possible values and the new count."""
        if self.value is not None:
            return None
        previous_count = len(self.possible_values)
        possible_values = {i for i in range(1, 10) 
            if i not in self.row_values
            and i not in self.col_values
            and any(i in col_comb for col_comb in self.col_sentence.possible_combinations) 
            and any(i in row_comb for row_comb in self.row_sentence.possible_combinations)}
        if len(possible_values) == 0:
            raise UnsatifiableError(
                f"No possible values left for cell, {self}")
        self.possible_values = possible_values
        return previous_count, len(possible_values)
    
    def place(self, integer: int):
        """Place the number, keeping track of the removed combinations."""
        assert self.value is None and integer in self.possible_values
        assert self.removed_row_combinations is None and self.removed_col_combinations is None
        self.value = integer
        self.row_values.add(integer)
        self.col_values.add(integer)
        self.removed_row_combinations = self.row_sentence.place(integer)
        self.removed_col_combinations = self.col_sentence.place(integer)
    
    def undo(self):
        """Undo the placement of the number."""
        assert self.value is not None
        assert self.removed_row_combinations is not None and self.removed_col_combinations is not None
        self.row_values.remove(self.value)
        self.col_values.remove(self.value)
        self.value = None
        self.row_sentence.add_back(self.removed_row_combinations)
        self.col_sentence.add_back(self.removed_col_combinations)
        self.removed_row_combinations = None
        self.removed_col_combinations = None
    
    def __repr__(self):
        return f"Cell({self.value=}, {self.row=}, {self.col=}, {self.possible_values=}, {self.row_sentence=}, {self.col_sentence=})"
    
    def __str__(self):
        return self.__repr__()


class Board:
    def __init__(self, board: list[list[bool]],
                 row_sentences: dict[int, list[Sentence]], col_sentences: dict[int, list[Sentence]]):
        assert len(board) > 0 and len(board[0]) > 0
        self.rows = len(board)
        self.cols = len(board[0])
        self.unsolved_count = 0
        self.cell_map: dict[int, set[tuple[int, int]]] = dict()
        self.row_values = [set() for _ in range(self.rows)]
        self.col_values = [set() for _ in range(self.cols)]
        self.board = [list(map(
            lambda cell: self._create_cell(row_sentences, col_sentences,
                                           i, cell[0],
                                           self.row_values[i], self.col_values[cell[0]]) if cell[1] else None,
            enumerate(row)
        )) for i, row in enumerate(board)]
    
    def _create_cell(self, row_sentences: dict[int, list[Sentence]], col_sentences: dict[int, list[Sentence]],
                     row: int, col: int,
                     row_values: set[int], col_values: set[int]) -> Cell:
        row_sentence = None
        col_sentence = None
        for test_row_sentence in row_sentences[row]:
            if test_row_sentence.is_index_in_range(col):
                row_sentence = test_row_sentence
                break
        for test_col_sentence in col_sentences[col]:
            if test_col_sentence.is_index_in_range(row):
                col_sentence = test_col_sentence
                break
        
        assert row_sentence is not None and col_sentence is not None
        cell = Cell(row, col, row_sentence, col_sentence, row_values, col_values)

        count = len(cell.possible_values)
        if count not in self.cell_map:
            self.cell_map[count] = set()
        self.cell_map[count].add((row, col))
        self.unsolved_count += 1

        return cell

    def solve(self, save_board: Callable[[list[list[str]]], None] | None = None) -> bool:
        if save_board is not None:
            save_board(self.to_solution_board())

        if self.unsolved_count == 0:
            return True
        self.unsolved_count -= 1
        
        row, col, count = self._find_best_cell()
        for i in range(1, 10):
            cell: Cell = self.board[row][col]
            if i not in cell.possible_values:
                continue

            cell.place(i)
            try:
                self._propagate(row, col)
            except UnsatifiableError:
                cell.undo()
                continue

            if self.solve(save_board=save_board):
                return True
            cell.undo()

        self._propagate(row, col)
        self.unsolved_count += 1
        self.cell_map[count].add((row, col))
        return False
    
    def _find_best_cell(self) -> tuple[int, int, int]:
        for i in range(1, 10):
            if i in self.cell_map and len(self.cell_map[i]) > 0:
                row, col = self.cell_map[i].pop()
                return row, col, i
    
    def _propagate(self, row: int, col: int):
        for i in range(row - 1, -1, -1):
            if self.board[i][col] is None:
                break
            self._recalculate(i, col)
        for i in range(row + 1, self.rows):
            if self.board[i][col] is None:
                break
            self._recalculate(i, col)
        
        for i in range(col - 1, -1, -1):
            if self.board[row][i] is None:
                break
            self._recalculate(row, i)
        for i in range(col + 1, self.cols):
            if self.board[row][i] is None:
                break
            self._recalculate(row, i)
    
    def _recalculate(self, row: int, col: int) -> None:
        result = self.board[row][col].calculate_possible_values()
        if result is None:
            return
        previous_count, new_count = result
        self.cell_map[previous_count].remove((row, col))
        if new_count not in self.cell_map:
            self.cell_map[new_count] = set()
        self.cell_map[new_count].add((row, col))
    
    def to_solution_board(self) -> list[list[str]]:
        return [list(map(
            lambda cell: str(cell.value if cell.value else ".") if cell is not None else "X",
            row)) for row in self.board]
