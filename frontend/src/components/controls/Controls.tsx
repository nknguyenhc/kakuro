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
    <div>
      <StepControl />
      {step === 1 && <DimensionsControl />}
    </div>
  );
}

export default Controls;
