import styles from './Search.module.css';
import { SearchIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { SearchDropdownMenu } from './SearchDropdownMenu';
import { routes } from '../../routes/routes';
import { useEffect, useRef, useState } from 'react';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const existingSearchValue = searchParams.get('pageSearch') || '';
  const wrapperRef = useRef<HTMLDivElement>(null);

  const searchResult = routes.filter((route) => {
    const { title } = route;

    return title.toLowerCase().includes(existingSearchValue.toLowerCase());
  });

  const onChange = (value: string) => {
    setSearchParams(
      (prev) => {
        if (value.trim()) {
          prev.set('pageSearch', value);
        } else {
          prev.delete('pageSearch');
        }
        return prev;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.mainWrapper} ref={wrapperRef}>
      <div className={styles.wrapper}>
        <SearchIcon size={23} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          onFocus={() => setIsOpen(true)}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search anything"
          value={existingSearchValue}
        />
      </div>
      {searchResult.length > 0 && isOpen && (
        <SearchDropdownMenu searchItem={searchResult} setIsOpen={setIsOpen} />
      )}
    </div>
  );
};
