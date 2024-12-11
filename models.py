from pydantic import BaseModel

class Constraint(BaseModel):
    start: int
    end: int
    sum: int

class Problem(BaseModel):
    board: list[list[bool]]
    row_constraints: list[list[Constraint]]
    col_constraints: list[list[Constraint]]

class Response(BaseModel):
    success: bool
    is_solved: bool | None = None
    steps: list[list[list[str]]] | None = None
    error: str | None = None
