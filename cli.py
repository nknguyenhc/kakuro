from functools import reduce

from solver import Sentence, Board

def _get_board_dimensions() -> tuple[int, int]:
    return _get_number("Rows: ", 1, None), _get_number("Columns: ", 1, None)

def _get_number(prompt: str, min_value: int, max_value: int) -> int:
    while True:
        try:
            value = int(input(prompt))
            if (min_value is None or value >= min_value) and (max_value is None or value <= max_value):
                return value
            print(f"Value must be between {min_value} and {max_value}.")
        except ValueError:
            print("Invalid input. Please enter a number.")

def _get_boolean_board(row_count: int, col_count: int) -> list[list[bool]]:
    board: list[list[bool]] = []
    for i in range(row_count):
        while True:
            row = input(f"Row {i + 1}, in binary format: ")
            if len(row) == col_count:
                break
            print(f"Row must have {col_count} columns.")
        board.append([cell == "1" for cell in row])
    return board

def _get_sentences(board: list[list[bool]],
                   row_count: int,
                   col_count: int) -> tuple[dict[int, list[Sentence]], dict[int, list[Sentence]]]:
    return _get_row_sentences(board, row_count, col_count), _get_col_sentences(board, row_count, col_count)

def _get_row_sentences(board: list[list[bool]], row_count: int, col_count: int) -> dict[int, list[Sentence]]:
    sentences: dict[int, list[Sentence]] = dict()
    for i in range(col_count):
        sentences[i] = []
        start: int = 0
        end: int = 0
        
        while start < row_count:
            while start < row_count:
                if board[i][start]:
                    break
                start += 1
            if start >= row_count:
                break

            end: int = 0
            while end < row_count:
                if not board[i][end]:
                    break
                end += 1
            end -= 1
            
            count = end - start + 1
            min_value = count * (count + 1) // 2
            max_value = reduce(lambda x, y: x + y, range(9, 9 - count, -1))
            sum = _get_number(f"Row {i + 1}, start: {start + 1}, end: {end + 1}, sum: ", min_value, max_value)
            sentences[i].append(Sentence(sum, False, start, end))
            start = end + 1
    
    return sentences

def _get_col_sentences(board: list[list[bool]], row_count: int, col_count: int) -> dict[int, list[Sentence]]:
    sentences: dict[int, list[Sentence]] = dict()
    for i in range(row_count):
        sentences[i] = []
        start: int = 0
        end: int = 0
        
        while start < col_count:
            while start < col_count:
                if board[start][i]:
                    break
                start += 1
            if start >= col_count:
                break

            end: int = 0
            while end < col_count:
                if not board[end][i]:
                    break
                end += 1
            end -= 1
            
            count = end - start + 1
            min_value = count * (count + 1) // 2
            max_value = reduce(lambda x, y: x + y, range(9, 9 - count, -1))
            sum = _get_number(f"Column {i + 1}, start: {start + 1}, end: {end + 1}, sum: ", min_value, max_value)
            sentences[i].append(Sentence(sum, True, start, end))
            start = end + 1
    
    return sentences


def main():
    row_count, col_count = _get_board_dimensions()
    board = _get_boolean_board(row_count, col_count)
    row_sentences, col_sentences = _get_sentences(board, row_count, col_count)
    board = Board(board, row_sentences, col_sentences)
    boards = []
    solved = board.solve(lambda b: boards.append(b))
    if solved:
        print(f"Solution: {board.to_solution_board()}")
    else:
        print("No solution found.")
    print("Steps:")
    for board in boards:
        print(board)


if __name__ == '__main__':
    main()
