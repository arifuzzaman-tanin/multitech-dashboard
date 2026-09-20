import heroImageUrl from '@/assets/images/login-industrial-hero-logo-devices.png'
import { BrandMark } from '../BrandMark/BrandMark'
import { ArrowRightIcon, DashboardIcon, DataCloudIcon, EdgeDeviceIcon, IndustrialSensorIcon } from '../icons'
import styles from './LoginHero.module.scss'

const steps = [
  { Icon: IndustrialSensorIcon, title: 'Industrial Sensors', copy: 'Collect real-time data' },
  { Icon: EdgeDeviceIcon, title: 'Edge Devices', copy: 'Securely transmit' },
  { Icon: DataCloudIcon, title: 'MultiTech mCloud', copy: 'Store, process and analyze' },
  { Icon: DashboardIcon, title: 'Centralized Dashboard', copy: 'Monitor and control anywhere' },
] as const

export function LoginHero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <img className={styles.heroImage} src={heroImageUrl} alt="" />
      <BrandMark />
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Industrial connectivity, simplified</p>
        <h2 id="hero-title">Connecting data<br />to decisions.</h2>
        <p className={styles.summary}>Securely connect and manage your devices from one dashboard.</p>
      </div>

      <div className={styles.process} aria-label="Data flows from industrial sensors through edge devices and mCloud to the centralized dashboard">
        {steps.map((step, index) => {
          const { Icon } = step

          return (
            <div className={styles.stepWrap} key={step.title}>
              <div className={styles.step}>
                <span className={styles.processIcon}><Icon size={42} /></span>
                <span className={styles.stepText}>
                  <strong>{step.title}</strong>
                  <small>{step.copy}</small>
                </span>
              </div>
              {index < steps.length - 1 && (
                <span className={styles.flowArrow} aria-hidden="true">
                  <ArrowRightIcon size={15} />
                </span>
              )}
            </div>
          )
        })}
      </div>

      <p className={styles.footer}>Built for connected operations</p>
    </section>
  )
}
