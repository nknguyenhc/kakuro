/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Controls from './components/controls/Controls';
import BoardDisplay from './components/board/BoardDisplay';

function App() {
  return (
    <div css={appStyle}>
      <BoardDisplay />
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
