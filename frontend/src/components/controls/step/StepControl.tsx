/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useAppContext } from '../../../context/app-context';

function StepControl(): JSX.Element {
  const { step, incrementStep, decrementStep } = useAppContext();

  return (
    <div css={stepControlStyle}>
      <div css={stepsStyle}>
        <div css={indicateStyle(step === 1)}>1. Select cells</div>
        <div css={indicateStyle(step === 2)}>2. Indicate constraints</div>
        <div css={indicateStyle(step === 3)}>3. View solution</div>
      </div>
      <div css={buttonsStyle}>
        <button onClick={decrementStep}>Last</button>
        <button onClick={incrementStep}>Next</button>
      </div>
    </div>
  );
}

const stepControlStyle = css`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
`;

const stepsStyle = css`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const buttonsStyle = css`
  display: flex;
  flex-direction: row;
  gap: 40px;
`;

const indicateStyle = (isIndicating: boolean) => css`
  color: ${isIndicating ? '#e91e63' : 'black'};
  border: 1px solid ${isIndicating ? '#e91e63' : 'black'};
  border-radius: 5px;
  padding: 10px;
`;

export default StepControl;
