/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect } from 'react';
import DimensionsControl from './dimensions/DimensionsControl';
import { useAppContext } from '../../context/app-context';
import StepControl from './step/StepControl';

function Controls(): JSX.Element {
  const { step, setIsSelecting, setIsDeselecting } = useAppContext();

  useEffect(() => {
    const mouseUpHandler = () => {
      setIsSelecting(false);
      setIsDeselecting(false);
    };
    window.addEventListener('mouseup', mouseUpHandler);
    return () => {
      window.removeEventListener('mouseup', mouseUpHandler);
    };
  }, [setIsSelecting, setIsDeselecting]);

  return (
    <div css={controlsStyle}>
      <StepControl />
      {step === 1 && <DimensionsControl />}
      {step === 2 && (
        <div>Indicate the sums for all applicable rows and columns.</div>
      )}
      {step === 3 && (
        <div>
          View step-by-step solution of how our AI agent solves the puzzle!
        </div>
      )}
    </div>
  );
}

const controlsStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default Controls;
