import { Result, type ResultProps } from 'antd'
import type { FC } from 'react'
import styled from '@emotion/styled'

const StyledResult = styled(Result)({
  '&': {
    '.ant-result-extra': { marginTop: '5px' },
    '.ant-result-title': { fontSize: '16px', margin: 0 },
  },
})

export interface BaseResultProps extends ResultProps {}
export const BaseResult: FC<BaseResultProps> = ({ ...rest }) => {
  return <StyledResult {...rest} />
}
