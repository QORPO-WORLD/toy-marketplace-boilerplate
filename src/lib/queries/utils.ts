import { collectableQueries } from '.';
import { type CartItem } from '../stores/cart/types';
import { fetchSyncOrders } from './fetchers';
import { getQueryClient } from './getQueryClient';
import { type CollectibleOrder } from './marketplace/marketplace.gen';

export const invalidateLowestListings = async (cartItems: CartItem[]) => {
  const lowestListings = getOrder(
    cartItems,
    collectableQueries.lowestListings(),
  );

  if (!lowestListings?.length) return;

  try {
    await fetchSyncOrders({
      orders: lowestListings,
      chainId: lowestListings[0]!.chainId,
    });
  } catch (error) {
    console.error('Error updating collectable orders', error);
  }

  const queryClient = getQueryClient();
  await queryClient.invalidateQueries({
    queryKey: collectableQueries.lowestListings(),
  });
  await queryClient.invalidateQueries({
    queryKey: collectableQueries.listLowestListings(),
  });
};

const getOrder = (cartItems: CartItem[], queryKey: string[]) => {
  const queryClient = getQueryClient();
  const highestOffers = queryClient.getQueryData<CollectibleOrder[]>(queryKey);

  if (!highestOffers) return;

  const orders = highestOffers
    .filter((order) => {
      return cartItems.every((item) => {
        return order.order?.orderId === item.orderId;
      });
    })
    .map((order) => order.order!);

  return orders;
};
