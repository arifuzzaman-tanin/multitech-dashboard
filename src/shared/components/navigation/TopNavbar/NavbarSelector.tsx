import type { NavbarSelectorConfig } from '@/app/config/navigation'
import { NavIcon } from '@/shared/components/navigation/icons'
import styles from './TopNavbar.module.scss'

interface NavbarSelectorProps {
  selector: NavbarSelectorConfig
}

export function NavbarSelector({ selector }: NavbarSelectorProps) {
  const selectedValue =
    selector.options.find((option) => option.label === selector.value)?.value ??
    selector.options[0]?.value

  return (
    <label className={styles.selector}>
      <NavIcon name={selector.icon} size={18} />
      <select
        aria-label={selector.ariaLabel}
        className={styles.selectorControl}
        defaultValue={selectedValue}
      >
        {selector.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
