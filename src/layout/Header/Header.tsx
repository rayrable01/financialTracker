import { NotificationButton } from '../../components/NotificationButton/NotificationButton';
import { Search } from '../../components/Search/Search';
import { ThemeSwitcher } from '../../components/ThemeSwitcher/ThemeSwitcher';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>Welcome, Your Name</h2>
      <div className={styles.stack}>
        <Search />
        <NotificationButton />
        <ThemeSwitcher />
        <img className={styles.avatar} alt="avatar logo" src="/assets/react.svg" />
      </div>
    </header>
  );
};
