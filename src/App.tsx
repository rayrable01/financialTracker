import { LeftSidebarLayout } from "./layout/LeftSidebarLayout/LeftSidebarLayout";
import { RightSideLayout } from "./layout/RightSideLayout/RightSideLayout";

function App() {
  return (
    <div style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
      <LeftSidebarLayout />
      <RightSideLayout />
    </div>
  );
}

export default App;
