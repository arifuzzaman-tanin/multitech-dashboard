import { BrandMark } from '../components/BrandMark/BrandMark'
import { LoginForm } from '../components/LoginForm/LoginForm'
import { LoginHero } from '../components/LoginHero/LoginHero'
import styles from './LoginPage.module.scss'

interface LoginPageProps {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  return (
    <main className={styles.page}>
      <LoginHero />
      <section className={styles.formPanel} aria-label="Sign in">
        <div className={styles.mobileBrand}><BrandMark compact /></div>
        <LoginForm onSuccess={onLoginSuccess} />
      </section>
    </main>
  )
}
