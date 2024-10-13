const matchesFilterValue = (item: any, filterValueLower: string) => {
  if (!filterValueLower) {
    return true
  }
  const nameLower = item.name.toLowerCase()
  return nameLower.includes(filterValueLower)
}

export const filterAggregates = (aggregates: any[], filterValue: string) => {
  const filtered: any[] = []
  const filterValueLower = filterValue.toLowerCase()
  for (const item of aggregates) {
    if (matchesFilterValue(item, filterValueLower)) {
      filtered.push(item)
    }
  }
  return filtered
}
