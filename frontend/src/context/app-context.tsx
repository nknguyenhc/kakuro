import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

type CellState = {
  value?: number;
  isSelected: boolean;
};

type AppStateType = {
  cells: CellState[][];
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
  setValue: (row: number, col: number, value: number) => void;
  setSelected: (row: number, col: number, isSelected: boolean) => void;
  isSelecting: boolean;
  setIsSelecting: (isSelecting: boolean) => void;
  isDeselecting: boolean;
  setIsDeselecting: (isDeselecting: boolean) => void;
};

const useAppStates = (): AppStateType => {
  const [cells, setCells] = useState<CellState[][]>([[{ isSelected: false }]]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDeselecting, setIsDeselecting] = useState(false);

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

  const setValue = useCallback((row: number, col: number, value: number) => {
    setCells((prev) => {
      const newCells = prev.map((r, i) => {
        if (i === row) {
          return r.map((c, j) => {
            if (j === col) {
              return { value, isSelected: false };
            }
            return c;
          });
        }
        return r;
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

  return {
    cells,
    setHeight,
    setWidth,
    setValue,
    setSelected,
    isSelecting,
    setIsSelecting,
    isDeselecting,
    setIsDeselecting,
  };
};

const AppContext = createContext<AppStateType | null>(null);

export const AppContextProvider = ({ children }: PropsWithChildren<{}>) => (
  <AppContext.Provider value={useAppStates()}>{children}</AppContext.Provider>
);

export const useAppContext = (): AppStateType =>
  useContext(AppContext) as AppStateType;
