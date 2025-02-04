import { useQuery } from '@tanstack/react-query';

interface FetchActivityParams {
  collectionAddress: string;
  currencyAddresses: string[];
  orderbookContractAddress: string;
  tokenIDs: string[];
  userAddress: string;
}

interface Order {
  blockNumber: number;
  createdAt: number;
  createdBy: string;
  currencyAddress: string;
  expiry: string;
  isListing: boolean;
  orderId: string;
  orderStatus: 'OPEN' | 'CLOSED' | 'CANCELLED';
  orderbookContractAddress: string;
  pricePerToken: string;
  quantity: string;
  quantityRemaining: string;
  tokenContract: string;
  tokenId: string;
}

interface SortOption {
  column: string;
  order: 'ASC' | 'DESC';
}

interface PageInfo {
  more: boolean;
  page: number;
  pageSize: number;
  sort: SortOption[];
}

interface OrdersResponse {
  page: PageInfo;
  orders: Order[];
}

const fetchActivity = async (
  params: FetchActivityParams,
): Promise<OrdersResponse> => {
  const {
    collectionAddress,
    currencyAddresses,
    orderbookContractAddress,
    tokenIDs,
    userAddress,
  } = params;

  const body = {
    collectionAddress,
    currencyAddresses,
    orderbookContractAddress,
    page: { sort: [{ column: 'createdAt', order: 'DESC' }] },
    tokenIDs: tokenIDs || [],
    userAddress,
  };

  const response = await fetch(
    'https://marketplace-api.sequence.app/toy-testnet/rpc/Marketplace/GetUserActivities',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json() as Promise<OrdersResponse>;
};

export const useFetchActivity = (params: FetchActivityParams) => {
  return useQuery<OrdersResponse, Error>({
    queryKey: [
      'activity',
      params.collectionAddress,
      params.currencyAddresses.join(','), // Ensure arrays are stringified for stability
      params.orderbookContractAddress,
      params.tokenIDs?.join(',') || '',
      params.userAddress,
      params,
    ],
    queryFn: () => fetchActivity(params),
    enabled: !!params.collectionAddress && !!params.userAddress, // Ensure the query runs only when necessary
  });
};
