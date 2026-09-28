import { BadgeDollarSign } from 'lucide-react'
import styles from './CompanyLogo.module.css';

export const CompanyLogo = () => {
  return (
    <a href='#' className={styles.companyLogo}>
      <BadgeDollarSign size={40} />
      YOUNG TRAD.
    </a>
  )
}