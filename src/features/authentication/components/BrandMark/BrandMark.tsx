import multitechLogoUrl from '@/assets/images/multitech-logo.svg'
import styles from './BrandMark.module.scss'

interface BrandMarkProps { compact?: boolean }

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className={`${styles.brand} ${compact ? styles.compact : ''}`} aria-label="MultiTech">
      <img className={styles.logo} src={multitechLogoUrl} alt="" aria-hidden="true" />
    </div>
  )
}
