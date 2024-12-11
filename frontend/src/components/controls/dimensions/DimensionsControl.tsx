/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useAppContext } from '../../../context/app-context';
import { useMemo } from 'react';

function DimensionsControl(): JSX.Element {
  const { cells, setHeight, setWidth } = useAppContext();
  const height = useMemo(() => cells.length, [cells]);
  const width = useMemo(() => cells[0].length, [cells]);

  return (
    <div css={dimensionsControlStyle}>
      <div>Click on the cells to indicate those included in the puzzle.</div>
      <label>Height:</label>
      <input
        type="number"
        css={inputStyle}
        value={height}
        onChange={(e) => setHeight(Number(e.target.value))}
      />
      <label>Width:</label>
      <input
        type="number"
        css={inputStyle}
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
      />
    </div>
  );
}

const dimensionsControlStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
`;

const inputStyle = css`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1em;
  text-align: center;
  max-width: 200px;
`;

export default DimensionsControl;
