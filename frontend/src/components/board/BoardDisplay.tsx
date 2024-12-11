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
    solutionStepIndex,
    maxStep,
    jumpToStep,
  } = useAppContext();

  return (
    <div css={boardDisplayStyle}>
      <Board />
      {step === 3 && hasSolution && (
        <input
          type="range"
          min="1"
          max={maxStep + 1}
          value={solutionStepIndex + 1}
          onChange={(e) => jumpToStep(parseInt(e.target.value) - 1)}
          css={sliderStyle}
        />
      )}
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

const sliderStyle = css`
  width: 70%;
`;

export default BoardDisplay;
