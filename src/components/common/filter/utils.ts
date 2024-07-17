export function genValues<T extends Record<string, any>>(
  field: string | string[],
  value: unknown[] | unknown,
) {
  const values: Partial<T> = {}
  if (Array.isArray(field)) {
    field.reduce((acc, item, i) => {
      acc[item] = Array.isArray(value) ? value[i] : value
      return acc
    }, values)
  } else {
    values[field] = value
  }
  return values
}
