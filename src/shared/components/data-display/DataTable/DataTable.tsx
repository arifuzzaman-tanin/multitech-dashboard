import type { ReactNode } from 'react'
import styles from './DataTable.module.scss'

export interface DataTableColumn<T> {
  id: string
  header: string
  cell: (row: T) => ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  emptyMessage?: string
  compact?: boolean
}

export function DataTable<T>({
  columns,
  compact = true,
  emptyMessage = 'No records found.',
  getRowKey,
  rows,
}: DataTableProps<T>) {
  return (
    <div className={styles.tableWrap}>
      <table className={[styles.table, compact ? styles.compact : ''].filter(Boolean).join(' ')}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className={column.align ? styles[column.align] : undefined}
                key={column.id}
                scope="col"
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((column) => (
                  <td
                    className={column.align ? styles[column.align] : undefined}
                    key={column.id}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className={styles.empty} colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
