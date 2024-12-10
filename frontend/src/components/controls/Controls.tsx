import { useEffect } from 'react';
import DimensionsControl from './dimensions/DimensionsControl';
import { useAppContext } from '../../context/app-context';

function Controls(): JSX.Element {
  const { setIsSelecting, setIsDeselecting } = useAppContext();

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
      <DimensionsControl />
    </div>
  );
}

export default Controls;
