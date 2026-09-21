import { OverviewIcon } from './OverviewIcon'
import type { OverviewMetric, TrendSentiment } from '../types/overview.types'
import styles from './MetricsGrid.module.scss'

interface MetricsGridProps {
  metrics: OverviewMetric[]
}

const sentimentSymbol: Record<TrendSentiment, string> = {
  negative: '↓',
  neutral: '→',
  positive: '↑',
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <section className={styles.grid} aria-label="Fleet summary metrics">
      {metrics.map((metric) => (
        <article className={[styles.card, metric.accent ? styles[metric.accent] : ''].filter(Boolean).join(' ')} key={metric.id}>
          <div className={styles.icon}>
            <OverviewIcon name={metric.icon} />
          </div>
          <div className={styles.body}>
            <p className={styles.label}>{metric.label}</p>
            <strong className={styles.value}>{metric.value}</strong>
            {metric.trendValue !== undefined && metric.trendSentiment && (
              <span className={[styles.trend, styles[metric.trendSentiment]].join(' ')}>
                {sentimentSymbol[metric.trendSentiment]} {metric.trendValue > 0 ? '+' : ''}
                {metric.trendValue}%
              </span>
            )}
          </div>
        </article>
      ))}
    </section>
  )
}
