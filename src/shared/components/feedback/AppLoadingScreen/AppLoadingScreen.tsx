import styles from './AppLoadingScreen.module.scss'

export function AppLoadingScreen() {
  return (
    <div className={styles.screen} role="status" aria-live="polite" aria-label="Loading application">
      <div className={styles.progressTrack} aria-hidden="true">
        <span className={styles.progressBar} />
      </div>

      <div className={styles.content}>
        <span className={styles.pulse} aria-hidden="true" />
        <p className={styles.title}>Preparing your workspace</p>
        <p className={styles.message}>Restoring your secure session...</p>
      </div>
    </div>
  )
}
