import { Navigate, Route, Routes } from "react-router-dom";
import styles from "./RightSideLayout.module.css";
import { routes } from "../../routes/routes";
import { Header } from "../Header/Header";

export const RightSideLayout = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
      <Header />
        <Routes>
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          <Route path="*" element={<Navigate to='/dashboard' replace />} />
        </Routes>
      </div>
    </div>
  );
};
