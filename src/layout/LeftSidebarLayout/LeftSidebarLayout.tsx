import { CompanyLogo } from '../../components/CompanyLogo/CompanyLogo';
import { LogoutButton } from '../../components/LogoutButton/LogoutButton';
import { MenuList } from '../../components/SidebarMenu/MenuList/MenuList';
import { Subscription } from '../../components/Subscription/Subscription';
import { generalItems, menuItems } from '../../utils/const';
import styles from './LeftSidebarLayout.module.css';


export const LeftSidebarLayout = () => {
  return <div className={styles.wrapper}>
    <CompanyLogo />
    <MenuList title='MENU' itemsList={menuItems} />
    <MenuList title='GENERAL' itemsList={generalItems} />
    <Subscription />
    <LogoutButton />
  </div>
}