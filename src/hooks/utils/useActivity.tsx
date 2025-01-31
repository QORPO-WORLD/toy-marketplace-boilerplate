// import { useCurrency } from '@0xsequence/marketplace-sdk/react';
// import { useQuery } from '@tanstack/react-query';

// interface FetchActivityParams {
//   collectionAddress: string;
//   currencyAddresses: string[];
//   orderbookContractAddress: string;
//   tokenIDs: string[];
//   userAddress: string;
// }

// interface Activity {
//   // Define the structure of the activity data
//   // Example:
//   activityType: string;
//   timestamp: string;
//   // Add other fields as needed
// }
// const fetchActivity = async ({
//   collectionAddress,
//   currencyAddresses,
//   orderbookContractAddress,
//   tokenIDs,
//   userAddress,
// }: FetchActivityParams) => {
//   const body = {
//     collectionAddress,
//     currencyAddresses,
//     orderbookContractAddress,
//     page: { sort: [{ column: 'createdAt', order: 'DESC' }] },
//     tokenIDs,
//     userAddress,
//   };

//   const response = await fetch(
//     'https://marketplace-api.sequence.app/toy-testnet/rpc/Marketplace/GetUserActivities',
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     },
//   );

//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }

//   const data: Activity[] = await response.json(); // Define the type of the response data
//   return data;
// };

// export const useFetchActivity = (params: FetchActivityParams) => {
//   return useQuery({
//     queryKey: [
//       'activity',
//       params.collectionAddress,
//       params.currencyAddresses,
//       params.orderbookContractAddress,
//       params.tokenIDs,
//       params.userAddress,
//     ],
//     queryFn: () => fetchActivity(params),
//     enabled: !!params,
//   });
// };
