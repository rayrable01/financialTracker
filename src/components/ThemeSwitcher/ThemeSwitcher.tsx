import { Moon, Sun } from "lucide-react";

import styles from "./ThemeSwitcher.module.css";
import clsx from "clsx";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("userTheme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const changeTheme = (theme: Theme) => {
    setTheme(theme);
    localStorage.setItem("userTheme", theme);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => changeTheme("light")}
        className={clsx(
          styles.themeButton,
          styles.sunButton,
          theme === "light" && styles.active,
        )}
      >
        <Sun size={20} />
      </button>
      <button
        onClick={() => changeTheme("dark")}
        className={clsx(
          styles.themeButton,
          styles.moonButton,
          theme === "dark" && styles.active,
        )}
      >
        <Moon size={20} />
      </button>
    </div>
  );
};