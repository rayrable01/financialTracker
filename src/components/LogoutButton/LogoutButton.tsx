import { LogOut } from "lucide-react"

import styles from './LogoutButton.module.css';

export const LogoutButton = () => {
  return (
    <button className={styles.logoutButton}>
      <LogOut size={20} />
      Log out
    </button>
  )
}