import { createContext, useContext } from 'react'

export interface IFilterContext {
  loading?: boolean
}

export const FilterContext = createContext<IFilterContext | null>(null)

export function useFilterContext() {
  const context = useContext(FilterContext)
  if (context === null) {
    throw new Error('You must add a <FilterContext.Provider> into the React tree')
  }
  return context
}
