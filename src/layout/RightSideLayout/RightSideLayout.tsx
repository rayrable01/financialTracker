import { Navigate, Route, Routes } from "react-router-dom";
import styles from "./RightSideLayout.module.css";
import { routes } from "../../routes/routes";

export const RightSideLayout = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Routes>
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          <Route path="*" element={<Navigate to='/dasboard' replace />} />
        </Routes>
      </div>
    </div>
  );
};
