import { Table, type TableColumnProps, type TableProps } from 'antd'
import { type FC, useMemo } from 'react'
import styled from '@emotion/styled'
import { isObject } from 'lodash-es'
import { Empty } from '../result'
import { TruncateText } from '../TruncateText'

const StyledTable = styled<FC<BaseTableProps<any>>>(Table)((props) => ({
  '& .ant-empty-description': { color: 'inherit' },
  '& .ant-empty-normal': {
    // color: '#fff',
  },
  '& .ant-table-tbody .ant-table-row ': {
    cursor: props.rowClickable ? 'pointer' : '',
  },
  '&.ant-table-wrapper': {
    borderRadius: '0 0 14px 14px',
    overflow: 'hidden',
  },
  '&.ant-table-wrapper .ant-table': {
    fontSize: '14px',
  },
  '&.ant-table-wrapper .ant-table-column-sorter-up, &.ant-table-wrapper .ant-table-column-sorter-down':
    {
      color: '#bababa',
    },
  '&.ant-table-wrapper .ant-table-column-sorter-up.active, &.ant-table-wrapper .ant-table-column-sorter-down.active':
    {
      color: '#101010',
    },
  '&.ant-table-wrapper .ant-table-container table>thead>tr:first-child >*:first-child': {
    borderRadius: 0,
  },
  '&.ant-table-wrapper .ant-table-container table>thead>tr:first-child >*:last-child': {
    borderRadius: 0,
  },

  '&.ant-table-wrapper .ant-table-tbody >tr >th, &.ant-table-wrapper .ant-table-tbody >tr >td': {
    // border: 'none',
    borderColor: '#edf2f7',
    // textAlign: 'center',
  },
  '&.ant-table-wrapper .ant-table-thead >tr >th, &.ant-table-wrapper .ant-table-thead >tr >td': {
    background: '#ffffff',
    border: 'none',
    color: '#ababab',
    fontWeight: 500,
    // textAlign: 'center',
    // opacity: 0.5,
  },
  '&.ant-table-wrapper .ant-table-thead >tr>th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before, &.ant-table-wrapper .ant-table-thead >tr>td:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before':
    {
      display: 'none',
    },
  '&.ant-table-wrapper table': {
    // borderRadius: '14px',
  },
}))

export interface BaseTableProps<T = any> extends TableProps<T> {
  align?: TableColumnProps<T>['align']
  /**
   * 为true时自动给每一行加上pointer手势
   */
  rowClickable?: boolean
  truncate?: boolean
  emptyCellValue?: React.ReactNode
}

export function BaseTable<T = any>(props: BaseTableProps<T>) {
  const {
    align = 'center',
    locale,
    rowClickable,
    scroll,
    columns,
    truncate,
    emptyCellValue,
    ...rest
  } = props
  const currentLocale = useMemo<typeof locale>(
    () => ({ emptyText: <Empty className="py-20" />, ...locale }),
    [locale],
  )
  const currentColumns = useMemo<typeof columns>(
    () =>
      columns?.map((item, i) => {
        const { render, ...rest } = item
        return {
          ...rest,
          align: rest.align || align,
          render: render
            ? (text, record, index) => {
              const res = render?.(text, record, index)
              if (isObject(res)) {
                return res
              }
              return truncate ? (
                <TruncateText tooltipProps={{ overlayStyle: { maxWidth: '90vw' } }}>
                  {res ?? emptyCellValue}
                </TruncateText>
              ) : (
                res ?? emptyCellValue
              )
            }
            : undefined,
        }
      }),
    [columns, align, truncate, emptyCellValue],
  )
  return (
    <StyledTable
      columns={currentColumns}
      locale={currentLocale}
      rowClickable={rowClickable}
      scroll={{ x: true, ...scroll }}
      {...rest}
    />
  )
}
