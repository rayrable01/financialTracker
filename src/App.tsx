import { LeftSidebarLayout } from './layout/LeftSidebarLayout/LeftSidebarLayout';
import { RightSideLayout } from './layout/RightSideLayout/RightSideLayout';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.layout}>
      <LeftSidebarLayout />
      <RightSideLayout />
    </div>
  );
}

export default App;
