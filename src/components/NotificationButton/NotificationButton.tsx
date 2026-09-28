import { Bell } from "lucide-react"

import styles from './NotificationButton.module.css';

export const NotificationButton = () => {
  return (
    <button
      type="button"
      className={styles.notificationButton}
    >
      <Bell size={20} />
    </button>
  )
}