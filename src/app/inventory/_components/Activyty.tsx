// 'use client';

// import { useEffect } from 'react';

// import { useFetchActivity } from '../../../hooks/utils/useActivity';
// import { useQuery } from '@tanstack/react-query';

// interface UseTransactionHistoryArgs {
//   chainId: number;
//   accountAddress: string;
//   contractAddress: string;
//   tokenIDs: string[];
//   disabled?: boolean;
// }

// function Activity({
//   chainId,
//   accountAddress,
//   contractAddress,
//   tokenIDs,
// }: UseTransactionHistoryArgs) {
//   const { data, isLoading, isError } = useFetchActivity({
//     collectionAddress: contractAddress,
//     currencyAddresses: [],
//     orderbookContractAddress: '',
//     tokenIDs,
//     userAddress: accountAddress,
//   });

//   return (
//     <div>
//       <ul>
//         <li>type</li>
//         <li>item</li>
//         <li>price</li>
//         <li>r</li>
//       </ul>
//     </div>
//   );
// }

// export default Activity;
