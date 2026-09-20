import { appConfig } from '@/app/config/appConfig'
import heroImageUrl from '@/assets/hero.png'
import styles from './DashboardPage.module.scss'

export function DashboardPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="dashboard-title">
        <div className={styles.content}>
          <p className={styles.eyebrow}>System overview</p>
          <h1 className={styles.title} id="dashboard-title">
            {appConfig.appName}
          </h1>
          <p className={styles.summary}>{appConfig.appDescription}</p>
        </div>
        <img
          className={styles.image}
          src={heroImageUrl}
          alt=""
          aria-hidden="true"
        />
      </section>
    </main>
  )
}
