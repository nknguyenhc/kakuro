/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useAppContext } from '../../context/app-context';
import { useCallback, useMemo } from 'react';

function Cell({
  isSelected,
  row,
  col,
  value,
}: {
  isSelected: boolean;
  row: number;
  col: number;
  value?: number;
}): JSX.Element {
  const {
    step,
    isSelecting,
    setIsSelecting,
    isDeselecting,
    setIsDeselecting,
    setSelected,
  } = useAppContext();

  const editable = useMemo(() => step === 1, [step]);

  const mouseDownHandler = useCallback(() => {
    if (!editable) {
      return;
    }
    if (isSelected) {
      setIsDeselecting(true);
    } else {
      setIsSelecting(true);
    }
    setSelected(row, col, !isSelected);
  }, [setIsSelecting, setIsDeselecting, row, col, isSelected, step]);

  const mouseEnterHandler = useCallback(() => {
    if (!editable) {
      return;
    }
    if (isSelecting) {
      setSelected(row, col, true);
    }
    if (isDeselecting) {
      setSelected(row, col, false);
    }
  }, [isSelecting, isDeselecting, setSelected, row, col, editable]);

  return (
    <div
      onMouseDown={mouseDownHandler}
      onMouseEnter={mouseEnterHandler}
      css={cellStyle(isSelected)}
      draggable={false}
    >
      {value !== undefined && value}
    </div>
  );
}

const cellStyle = (isSelected: boolean) => css`
  height: 100px;
  width: 100px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${isSelected ? '#8bc34a' : 'white'};
`;

export default Cell;
