import type { FC, ReactNode } from 'react'
import clsx from 'clsx'
import styled from '@emotion/styled'
import { useRequest } from 'ahooks'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { PublicKey } from '@solana/web3.js'
import type { BaseProps } from '@/types'
import { BaseLink, BaseSvg, BaseTable, type BaseTableProps } from '@/components'

import { type ITransaction, getTXHistoryApi } from '@/services/helius'

import { CLOSURE_REFUND_AMOUNT, DECIMAL_PLACES, ENV_VARS, connection } from '@/constants'
import { omitAddress, toSolscanTXUrl } from '@/web3'
import { bn, formatValue } from '@/utils'

const StyledTable = styled(BaseTable as FC<BaseTableProps<ITransaction>>)({
  '&.ant-table-wrapper .ant-table': {
    backgroundColor: 'transparent',
  },
  '&.ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder:hover>th, &.ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder:hover>td, &.ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder': {
    backgroundColor: 'transparent',
  },
  '&.ant-table-wrapper .ant-table-thead>tr>th, &.ant-table-wrapper .ant-table-thead>tr>td': {
    backgroundColor: 'transparent',
    color: '#2A292E',
    fontSize: '18px',
    fontWeight: 500,
  },
  '&.ant-table-wrapper .ant-table-tbody .ant-table-row >.ant-table-cell-row-hover': {
    backgroundColor: 'transparent',
  },
})

interface ItemProps extends BaseProps {
  img: ReactNode
  lable: ReactNode
  value: ReactNode
}

export function Item(props: ItemProps) {
  const { img, lable, value, className, ...rest } = props
  return (
    <div className={clsx('h-45 rounded-1.5 w-80 flex flex-col justify-center items-center gap-2.5', className)}>
      {img}
      <div className="lg:() text-4.5 fw-500">
        {lable}
      </div>
      <div className="lg:() text-6 fw-700">
        {value}
      </div>
    </div>
  )
}

interface TXsProps extends BaseProps {

}

export function TXs(props: TXsProps) {
  const { ...rest } = props
  const { data: balance } = useRequest(async () => {
    return bn.fromWei(await connection.getBalance(new PublicKey(ENV_VARS.VITE_PLATFORM_ADDRESS)), 9)
  }, { manual: false })
  const { data: txs, loading, refreshAsync: refreshTXs } = useRequest(async () => {
    const res = await getTXHistoryApi({ address: ENV_VARS.VITE_PLATFORM_ADDRESS, limit: 15 })
    return res.filter((item) => item.accountData.some((accountData) => {
      return accountData.nativeBalanceChange > 0 && accountData.account === item.feePayer
    }),
    )
  }, { manual: false })
  const totalAccounts = balance?.div(CLOSURE_REFUND_AMOUNT).dp(0, BigNumber.ROUND_UP)
  const totalAmount = totalAccounts?.times(CLOSURE_REFUND_AMOUNT)

  return (
    <div className="main-content flex items-start justify-between gap-12 py-25">
      <div className="lg:()">
        <div className="lg:() mb-12 text-9 c-#2A292E tracking-tight">
          Latest Transactions
        </div>
        <div className="lg:() flex flex-col gap-7.5">
          <Item
            className="bg-#F7FAFF c-#7BA0FF"
            img={<BaseSvg href="outlined/column" size={72} />}
            lable="Total SOL Recovered"
            value={<>{totalAmount ? formatValue(totalAmount?.toFormat(), 0, BigNumber.ROUND_UP) : '-'} SOL</>}
          />
          <Item
            className="bg-#FAF6FF c-#9F66FF"
            img={<BaseSvg href="outlined/star" size={54} />}
            lable="Total Accounts Claimed "
            value={<>{totalAccounts?.toFormat() || '-'}</>}
          />
        </div>
      </div>
      <div className="lg:() rounded-1.5 px-10 py-6" style={{ backgroundImage: 'linear-gradient(98deg, rgba(159, 102, 255, 0.15) 0%, rgba(123, 160, 255, 0.15) 94.16%)' }}>
        <StyledTable
          columns={[
            {
              title: 'WALLET/TX',
              width: 150,
              render: (_, record) => (
                <div className="lg:() mx-a flex flex-col items-center gap-2 text-4.5">
                  <span>
                    {omitAddress(record.feePayer)}
                  </span>
                  <BaseLink external text className="flex items-center gap-2.5" to={toSolscanTXUrl(record.signature)}>
                    {omitAddress(record.signature)}
                  </BaseLink>
                </div>
              ),
            },
            {
              title: 'ACCTS',
              width: 50,
              render: (_, record) => (
                <span className="text-4.5">
                  {bn(record.accountData.filter((item) => {
                    return item.nativeBalanceChange < 0
                  }).length).toFormat()}
                </span>
              ),
            },
            {
              title: 'CLAIMED',
              width: 250,
              render: (_, record) => {
                const accountData = record.accountData.find((item) => item.account === record.feePayer)
                return (
                  <span className="text-4.5 c-primary">
                    {accountData ? bn.fromWei(accountData.nativeBalanceChange, 9).dp(DECIMAL_PLACES.sol, BigNumber.ROUND_DOWN).toFormat() : '-'} SOL
                  </span>
                )
              },
            },
            {
              title: 'DATE',
              width: 200,
              render: (_, record) => (
                <span className="flex flex-col items-start text-4.5">
                  <span>{dayjs(record.timestamp * 1000).format('YYYY/MM/DD HH:mm')}</span>
                  {/* <span>{dayjs(record.timestamp * 1000).format('HH:mm')}</span> */}
                </span>
              ),
            },
          ]}
          dataSource={txs}
          loading={loading}
          pagination={false}
        />
        <div className="lg:() mt-4 flex items-center justify-between gap-2">
          <span className="text-4.5 c-#9f8cff fw-400">To keep this tool up and running we take 20% fee for SOL recovered.</span>
          <BaseSvg
            className={clsx('c-primary', loading ? 'animate-spin animate-duration-500 animate-fill-both cursor-not-allowed' : 'cursor-pointer')}
            href="outlined/refresh"
            size={30}
            onClick={() => {
              if (loading) {
                return
              }
              refreshTXs()
            }}
          />
        </div>
      </div>
    </div>
  )
}
