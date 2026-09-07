import type { LucideIcon } from "lucide-react";
import type { FC } from "react";
import { Link } from "react-router-dom";

import styles from './ItemList.module.css';

interface ItemListProps {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const ItemList: FC<ItemListProps> = ({ title, href, icon: Icon }) => {
  return (
    <Link className={styles.link} to={href}>
      <Icon size={20} />
      {title}
    </Link>
  );
};
