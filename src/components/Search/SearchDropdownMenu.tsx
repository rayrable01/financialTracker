import type { FC } from 'react';
import styles from './SearchDropdownMenu.module.css';
import type { RouteConfig } from '../../routes/routes';
import { useNavigate } from 'react-router-dom';

interface SearchDropdownMenuProps {
  searchItem: RouteConfig[];
  setIsOpen: (arg: boolean) => void;
}

export const SearchDropdownMenu: FC<SearchDropdownMenuProps> = ({ searchItem, setIsOpen }) => {
  const navigate = useNavigate();

  const onSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <ul className={styles.dropdownWrapper}>
      {searchItem.map((route) => (
        <li onClick={() => onSelect(route.path)}>{route.title}</li>
      ))}
    </ul>
  );
};
