/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useAppContext } from '../../context/app-context';
import Board from './Board';

function BoardDisplay() {
  const {
    step,
    hasSolution,
    nextSolutionStep,
    previousSolutionStep,
    firstSolutionStep,
    lastSolutionStep,
  } = useAppContext();

  return (
    <div css={boardDisplayStyle}>
      <Board />
      {step === 3 && hasSolution && (
        <div css={buttonsStyle}>
          <button onClick={firstSolutionStep}>First</button>
          <button onClick={previousSolutionStep}>Previous</button>
          <button onClick={nextSolutionStep}>Next</button>
          <button onClick={lastSolutionStep}>Last</button>
        </div>
      )}
    </div>
  );
}

const boardDisplayStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const buttonsStyle = css`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export default BoardDisplay;
