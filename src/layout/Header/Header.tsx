import { Avatar, Stack } from "@mui/material";
import { NotificationButton } from "../../components/NotificationButton/NotificationButton";
import { Search } from "../../components/Search/Search";
import { ThemeSwitcher } from "../../components/ThemeSwitcher/ThemeSwitcher";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>Welcome, Your Name</h2>
      <Stack direction='row' className={styles.stack}>
        <Search />
        <NotificationButton />
        <ThemeSwitcher />
        <Avatar alt="avatar logo" src="/assets/react.svg" />
      </Stack>
    </header>
  );
};
