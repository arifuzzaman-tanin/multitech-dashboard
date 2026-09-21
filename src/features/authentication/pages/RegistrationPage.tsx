import { BrandMark } from '../components/BrandMark/BrandMark'
import { LoginHero } from '../components/LoginHero/LoginHero'
import { RegistrationForm } from '../components/RegistrationForm/RegistrationForm'
import styles from './LoginPage.module.scss'

export function RegistrationPage() {
  return (
    <main className={styles.page}>
      <LoginHero />
      <section className={styles.formPanel} aria-label="Create account">
        <div className={styles.mobileBrand}><BrandMark compact /></div>
        <RegistrationForm />
      </section>
    </main>
  )
}
