/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ConstraintType, useAppContext } from '../../context/app-context';
import { ChangeEvent, useCallback, useMemo } from 'react';

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
    rowSentences,
    setRowSentences,
    colSentences,
    setColSentences,
  } = useAppContext();

  const editable = useMemo(() => step === 1, [step]);
  const rowConstraintIndex = useMemo(
    () =>
      (rowSentences[row] || ([] as ConstraintType[])).findIndex(
        (constraint) => constraint.start === col
      ),
    [rowSentences, row, col]
  );
  const colConstraintIndex = useMemo(
    () =>
      (colSentences[col] || ([] as ConstraintType[])).findIndex(
        (constraint) => constraint.start === row
      ),
    [colSentences, row, col]
  );

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

  const handleRowSumChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setRowSentences((sentences) =>
        sentences.map((rowSentences, i) =>
          i === row
            ? rowSentences.map((sentence, j) =>
                j === rowConstraintIndex
                  ? { ...sentence, sum: Number(e.target.value) }
                  : sentence
              )
            : rowSentences
        )
      ),
    [rowConstraintIndex]
  );

  const handleColSumChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setColSentences((sentences) =>
        sentences.map((colSentences, i) =>
          i === col
            ? colSentences.map((sentence, j) =>
                j === colConstraintIndex
                  ? { ...sentence, sum: Number(e.target.value) }
                  : sentence
              )
            : colSentences
        )
      ),
    [colConstraintIndex]
  );

  return (
    <div
      onMouseDown={mouseDownHandler}
      onMouseEnter={mouseEnterHandler}
      css={cellStyle(isSelected)}
      draggable={false}
    >
      {value !== undefined && value}
      {step > 1 && rowConstraintIndex !== -1 && (
        <div>
          <input
            type="number"
            onChange={handleRowSumChange}
            css={[inputStyle, rowSumStyle]}
            disabled={step !== 2}
          />
        </div>
      )}
      {step > 1 && colConstraintIndex !== -1 && (
        <div>
          <input
            type="number"
            onChange={handleColSumChange}
            css={[inputStyle, colSumStyle]}
            disabled={step !== 2}
          />
        </div>
      )}
    </div>
  );
}

const cellStyle = (isSelected: boolean) => css`
  position: relative;
  height: 100px;
  width: 100px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${isSelected ? '#8bc34a' : 'white'};
`;

const inputStyle = css`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
  max-width: 50px;
`;

const rowSumStyle = css`
  position: absolute;
  top: 30px;
  left: -60px;
`;

const colSumStyle = css`
  position: absolute;
  top: -30px;
  left: 20px;
`;

export default Cell;
