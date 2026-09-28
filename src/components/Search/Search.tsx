import { Stack } from "@mui/material";
import styles from "./Search.module.css";
import { SearchIcon } from "lucide-react";

export const Search = () => {
  return (
    <Stack className={styles.wrapper}>
      <SearchIcon size={23} className={styles.searchIcon} />
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search anything"
      />
    </Stack>
  );
};
