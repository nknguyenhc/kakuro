/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Board from './components/board/Board';
import Controls from './components/controls/Controls';

function App() {
  return (
    <div css={appStyle}>
      <Board />
      <Controls />
    </div>
  );
}

const appStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-width: 100%;
  padding: 10px;
  gap: 20px;
`;

export default App;
