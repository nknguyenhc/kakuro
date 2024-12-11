import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { BACKEND_URL } from '../constants/urls';

type CellState = {
  value?: number;
  isSelected: boolean;
};

export type ConstraintType = {
  start: number;
  end: number;
  sum?: number;
};

type AppStateType = {
  step: number;
  incrementStep: () => void;
  decrementStep: () => void;
  cells: CellState[][];
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
  setSelected: (row: number, col: number, isSelected: boolean) => void;
  isSelecting: boolean;
  setIsSelecting: (isSelecting: boolean) => void;
  isDeselecting: boolean;
  setIsDeselecting: (isDeselecting: boolean) => void;
  rowSentences: ConstraintType[][];
  setRowSentences: Dispatch<SetStateAction<ConstraintType[][]>>;
  colSentences: ConstraintType[][];
  setColSentences: Dispatch<SetStateAction<ConstraintType[][]>>;
  nextSolutionStep: () => void;
  previousSolutionStep: () => void;
  firstSolutionStep: () => void;
  lastSolutionStep: () => void;
  hasSolution: boolean;
};

const useAppStates = (): AppStateType => {
  const [step, setStep] = useState(1);
  const [cells, setCells] = useState<CellState[][]>([[{ isSelected: false }]]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDeselecting, setIsDeselecting] = useState(false);
  const [rowSentences, setRowSentences] = useState<ConstraintType[][]>([]);
  const [colSentences, setColSentences] = useState<ConstraintType[][]>([]);
  const [solutionSteps, setSolutionSteps] = useState<CellState[][][]>([]);
  const [solutionStepIndex, setSolutionStepIndex] = useState(0);
  const hasSolution = useMemo(() => solutionSteps.length > 0, [solutionSteps]);

  const setHeight = useCallback((height: number) => {
    if (height < 1) {
      alert('Height must be greater than 0');
      return;
    }
    setCells((prev) => {
      const newCells = new Array(height)
        .fill(0)
        .map(() => new Array(prev[0].length).fill({ isSelected: false }));
      for (let i = 0; i < Math.min(height, prev.length); i++) {
        newCells[i] = [...prev[i]];
      }
      return newCells;
    });
  }, []);

  const setWidth = useCallback((width: number) => {
    if (width < 1) {
      alert('Width must be greater than 0');
      return;
    }
    setCells((prev) => {
      const newCells = prev.map((row) => {
        const newRow = new Array(width).fill({ isSelected: false });
        for (let i = 0; i < Math.min(width, row.length); i++) {
          newRow[i] = row[i];
        }
        return newRow;
      });
      return newCells;
    });
  }, []);

  const setSelected = useCallback(
    (row: number, col: number, isSelected: boolean) => {
      setCells((prev) => {
        const newCells = prev.map((r, i) => {
          return r.map((c, j) => {
            if (i === row && j === col) {
              return { ...c, isSelected: isSelected };
            }
            return c;
          });
        });
        return newCells;
      });
    },
    []
  );

  const calculateConstraints = useCallback(() => {
    const rowSentences: ConstraintType[][] = [];
    for (let i = 0; i < cells.length; i++) {
      const row: ConstraintType[] = [];
      let start: number = 0;
      let end: number = 0;
      while (start < cells[i].length) {
        while (start < cells[i].length) {
          if (cells[i][start].isSelected) {
            break;
          }
          start++;
        }
        if (start === cells[i].length) {
          break;
        }

        end = start;
        while (end < cells[i].length) {
          if (!cells[i][end].isSelected) {
            break;
          }
          end++;
        }
        end--;
        row.push({ start, end });
        start = end + 1;
      }
      rowSentences.push(row);
    }
    setRowSentences(rowSentences);

    const colSentences: ConstraintType[][] = [];
    for (let i = 0; i < cells[0].length; i++) {
      const col: ConstraintType[] = [];
      let start: number = 0;
      let end: number = 0;
      while (start < cells.length) {
        while (start < cells.length) {
          if (cells[start][i].isSelected) {
            break;
          }
          start++;
        }
        if (start === cells.length) {
          break;
        }

        end = start;
        while (end < cells.length) {
          if (!cells[end][i].isSelected) {
            break;
          }
          end++;
        }
        end--;
        col.push({ start, end });
        start = end + 1;
      }
      colSentences.push(col);
    }
    setColSentences(colSentences);
  }, [cells]);

  const getSolution = useCallback(() => {
    fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board: cells.map((row) => row.map((cell) => cell.isSelected)),
        row_constraints: rowSentences,
        col_constraints: colSentences,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) {
          alert(res.error);
          return;
        }
        if (res.steps.length === 0) {
          alert('Something went wrong, no solution step found');
          return;
        }
        const solutionSteps = res.steps.map((step: string[][]) =>
          step.map((row: string[]) =>
            row.map((cell) => ({
              isSelected: cell !== 'X',
              value: isNaN(parseInt(cell)) ? undefined : parseInt(cell),
            }))
          )
        );
        setSolutionSteps(solutionSteps);
        setCells(solutionSteps[0]);
      });
  }, [cells, rowSentences, colSentences]);

  const incrementStep = useCallback(() => {
    if (step === 1) {
      calculateConstraints();
    } else if (step === 2) {
      getSolution();
    }
    setStep((prev) => (prev < 3 ? prev + 1 : prev));
  }, [step, calculateConstraints, getSolution]);

  const decrementStep = useCallback(() => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
    setCells((prev) =>
      prev.map((row) => row.map((cell) => ({ ...cell, value: undefined })))
    );
  }, []);

  const nextSolutionStep = useCallback(() => {
    if (solutionStepIndex + 1 >= solutionSteps.length) {
      return;
    }
    setSolutionStepIndex(solutionStepIndex + 1);
    setCells(solutionSteps[solutionStepIndex + 1]);
  }, [solutionStepIndex, solutionSteps]);

  const previousSolutionStep = useCallback(() => {
    if (solutionStepIndex - 1 < 0) {
      return;
    }
    setSolutionStepIndex(solutionStepIndex - 1);
    setCells(solutionSteps[solutionStepIndex - 1]);
  }, [solutionStepIndex, solutionSteps]);

  const firstSolutionStep = useCallback(() => {
    setSolutionStepIndex(0);
    setCells(solutionSteps[0]);
  }, [solutionSteps]);

  const lastSolutionStep = useCallback(() => {
    setSolutionStepIndex(solutionSteps.length - 1);
    setCells(solutionSteps[solutionSteps.length - 1]);
  }, [solutionSteps]);

  return {
    step,
    incrementStep,
    decrementStep,
    cells,
    setHeight,
    setWidth,
    setSelected,
    isSelecting,
    setIsSelecting,
    isDeselecting,
    setIsDeselecting,
    rowSentences,
    setRowSentences,
    colSentences,
    setColSentences,
    nextSolutionStep,
    previousSolutionStep,
    firstSolutionStep,
    lastSolutionStep,
    hasSolution,
  };
};

const AppContext = createContext<AppStateType | null>(null);

export const AppContextProvider = ({ children }: PropsWithChildren<{}>) => (
  <AppContext.Provider value={useAppStates()}>{children}</AppContext.Provider>
);

export const useAppContext = (): AppStateType =>
  useContext(AppContext) as AppStateType;
