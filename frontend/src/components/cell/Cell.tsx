/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

function Cell({
  isSelected,
  value,
}: {
  isSelected: boolean;
  value?: number;
}): JSX.Element {
  return <div css={cellStyle(isSelected)}>{value !== undefined && value}</div>;
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
