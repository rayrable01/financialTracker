import type { FC } from "react";
import type { GeneralItemsType, MenuItemsType } from "../../../utils/const";

import styles from './MenuList.module.css';
import { ItemList } from "../ItemList/ItemList";

interface MenuListProps {
  itemsList: MenuItemsType | GeneralItemsType;
  title: string;
}

export const MenuList: FC<MenuListProps> = ({ itemsList, title }) => {
  return (
    <div className={styles.divWrapper}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {Object.entries(itemsList).map(([label, { url, icon }]) => {
          return (
            <li key={url} className={styles.listItem}>
              <ItemList title={label} href={url} icon={icon} />
            </li>
          )
        })}
      </ul>
    </div>
  );
};
