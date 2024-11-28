export const masterDataTransform = (data: any[]) => {
  const result = data.map((item: any) => {
    return {
      value: item.id,
      label: item.name,
    }
  })

  return result;
}