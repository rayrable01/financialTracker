import { Star } from 'lucide-react';
import styles from './Subscription.module.css';

export const Subscription = () => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>
        Switch to Pro
        <Star size={20} />
      </h3>
      <p className={styles.descr}>Unlock advanced analytics, unlimited projects and priorty support to take your workflow to the next level</p>
    </div>
  )
}