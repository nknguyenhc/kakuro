/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Cell from '../cell/Cell';
import { useAppContext } from '../../context/app-context';

function Board(): JSX.Element {
  const { cells } = useAppContext();

  return (
    <div css={boardStyle}>
      {cells.map((row, i) => (
        <div key={i} css={rowStyle}>
          {row.map((cell, j) => (
            <Cell
              key={j}
              isSelected={cell.isSelected}
              value={cell.value}
              row={i}
              col={j}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const boardStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding: 80px;
`;

const rowStyle = css`
  display: flex;
  flex-direction: row;
  gap: 0px;
`;

export default Board;
