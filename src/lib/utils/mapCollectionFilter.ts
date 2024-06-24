// import { PropertyType } from '@0xsequence/metadata'

// import type { GetCollectionFilterOptionsResponse } from '~/api'

// export interface Filter {
//   name: string
//   values: string[]
// }

// export const mapCollectionFilter = (
//   filters: Filter[],
//   filterData: GetCollectionFilterOptionsResponse
// ) => {
//   return filters.map(filter => {
//     const type =
//       filterData?.data.find(f => f.name === filter.name)?.type ||
//       PropertyType.GENERIC
//     if (type === PropertyType.INT) {
//       return {
//         type: type,
//         name: filter.name,
//         min: filter.values[0],
//         max: filter.values[1]
//       }
//     } else {
//       return {
//         type: type,
//         ...filter
//       }
//     }
//   })
// }
