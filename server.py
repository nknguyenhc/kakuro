from fastapi import FastAPI, HTTPException
from copy import deepcopy

from models import Problem, Constraint, Response
from solver import Sentence, Board, UnsatifiableError

app = FastAPI()

@app.post("/solve")
def solve(problem: Problem) -> Response:
    _verify_dimensions(problem)
    _verify_constraints(problem)
    return _solve(problem)

def _verify_dimensions(problem: Problem):
    board = problem.board
    if len(board) == 0:
        raise HTTPException(status_code=400, detail="Board must have at least one row")
    
    col_count = len(board[0])
    if col_count == 0:
        raise HTTPException(status_code=400, detail="Board must have at least one column")
    for row in board:
        if len(row) != col_count:
            raise HTTPException(status_code=400, detail="All rows must have the same number of columns")

def _verify_constraints(problem: Problem):
    row_count = len(problem.board)
    col_count = len(problem.board[0])

    board = deepcopy(problem.board)
    for i, row_constraints in enumerate(problem.row_constraints):
        for constraint in row_constraints:
            if constraint.start < 0 or constraint.end >= col_count:
                raise HTTPException(status_code=400, detail="Row constraints are out of bounds")
            if constraint.start > constraint.end:
                raise HTTPException(status_code=400, detail="Row constraints ranges are invalid")
            count = constraint.end - constraint.start + 1
            min_value = count * (count + 1) // 2
            max_value = sum(range(9, 9 - count, -1))
            if constraint.sum < min_value or constraint.sum > max_value:
                raise HTTPException(status_code=400, detail="Row constraints sums are invalid")
            for j in range(constraint.start, constraint.end + 1):
                if not board[i][j]:
                    raise HTTPException(status_code=400, detail="Row constraints overlap")
                board[i][j] = False
    for row in board:
        for cell in row:
            if cell:
                raise HTTPException(status_code=400, detail="Row constraints do not cover all cells")
    
    board = deepcopy(problem.board)
    for j, col_constraints in enumerate(problem.col_constraints):
        for constraint in col_constraints:
            if constraint.start < 0 or constraint.end >= row_count:
                raise HTTPException(status_code=400, detail="Column constraints are out of bounds")
            if constraint.start > constraint.end:
                raise HTTPException(status_code=400, detail="Column constraints ranges are invalid")
            count = constraint.end - constraint.start + 1
            min_value = count * (count + 1) // 2
            max_value = sum(range(9, 9 - count, -1))
            if constraint.sum < min_value or constraint.sum > max_value:
                raise HTTPException(status_code=400, detail="Column constraints sums are invalid")
            for i in range(constraint.start, constraint.end + 1):
                if not board[i][j]:
                    raise HTTPException(status_code=400, detail="Column constraints overlap")
                board[i][j] = False
    for row in board:
        for cell in row:
            if cell:
                raise HTTPException(status_code=400, detail="Column constraints do not cover all cells")

def _solve(problem: Problem) -> Response:
    row_sentences = _get_sentences(problem.row_constraints, is_col=False)
    col_sentences = _get_sentences(problem.col_constraints, is_col=True)

    try:
        board = Board(problem.board, row_sentences, col_sentences)
    except UnsatifiableError as e:
        return Response(success=False, error=str(e))
    
    boards: list[list[list[str]]] = []
    is_solved = board.solve(lambda board: boards.append(board))
    return Response(success=True, is_solved=is_solved, steps=boards)

def _get_sentences(constraints: list[list[Constraint]], is_col: bool) -> dict[int, list[Sentence]]:
    sentences: dict[int, list[Sentence]] = dict()
    for i, constraint_list in enumerate(constraints):
        sentences[i] = []
        for constraint in constraint_list:
            sentences[i].append(Sentence(constraint.sum, is_col, constraint.start, constraint.end))
    return sentences
