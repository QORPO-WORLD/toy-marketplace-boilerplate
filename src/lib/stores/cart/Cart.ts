import type { CollectibleOrder } from '~/lib/queries/marketplace/marketplace.gen';
import { BigIntReplacer, BigIntReviver } from '~/lib/utils/bigint';
import { defaultSelectionQuantity } from '~/lib/utils/quantity';

import {
  type AddToCartData,
  type CartItem,
  type CartState,
  type CollectibleMetadata,
  OrderItemType,
} from './types';
import { cartStateSchema } from './types';
import { ContractType } from '@0xsequence/indexer';
import { compareAddress } from '@0xsequence/kit';
import * as ethers from 'ethers';
import { proxy, subscribe } from 'valtio';
import { derive } from 'valtio/utils';

const CART_LOCAL_STORAGE_TAG = '@marketplace.cart';

export type { CartItem, CollectibleMetadata };

const defaultCartState = (): CartState => ({
  isCartOpen: false,
  cartItems: [],
  override: undefined,
});

export type OrderData = {
  tokenIds: string[];
  tokenAmounts: string[];
  subtotals: string[];
};

// fixed properties for a given cart instance
// since we don't support mixed cart yet
export type BaseOrderInfo = {
  chainId: number | undefined;
  collectionAddress: string | undefined;
  orderType: OrderItemType | undefined;
};

// unique id for cart item
export const cartItemId = (
  item: Pick<CartItem, 'itemType' | 'collectibleMetadata' | 'orderId'>,
) => {
  return (
    `${item.itemType}-` +
    `${item.collectibleMetadata.chainId}-` +
    `${item.collectibleMetadata.collectionAddress}-` +
    `${item.collectibleMetadata.tokenId}-` +
    `${item.orderId}`
  );
};

const getExistingCartItem = (item: CartItem) => {
  return cartState.cartItems.find((ci) => cartItemId(ci) === cartItemId(item));
};

export const toggleCart = () => {
  cartState.isCartOpen = !cartState.isCartOpen;
};

export const setCartOpen = (open: boolean) => {
  cartState.isCartOpen = open;
};

export const removeFromCart = (item: CartItem) => {
  const index = cartState.cartItems.findIndex(
    (ci) => cartItemId(ci) === cartItemId(item),
  );
  cartState.cartItems.splice(index, 1);

  if (cartState.cartItems.length === 0) {
    setCartState(defaultCartState());
  }
};

export const editQuantity = (item: CartItem, quantity: bigint) => {
  const existingItem = getExistingCartItem(item);

  if (!existingItem) {
    return;
  }

  if (quantity <= 0n) {
    removeFromCart(item);
    return;
  }

  existingItem.quantity = quantity;
};

export const updateCartItemSubtotals = (subtotals: bigint[]) => {
  if (cartState.cartItems.length !== subtotals.length) {
    console.error('cart item length mismatch, subtotal not updated');
    return;
  }

  cartState.cartItems.forEach((item, index) => {
    item.subtotal = subtotals[index]!;
  });
};

const canAddToCart = (
  newItem: CartItem,
): {
  isValid: boolean;
  reason?: string;
} => {
  if (cartState.cartItems.length === 0) {
    // first item, will always be valid
    return {
      isValid: true,
    };
  }

  // do not allow mixed cart items for now
  // remove this when we support batch transactions / sequence proxy
  const referenceItem = cartState.cartItems[0]!;

  if (newItem.itemType !== referenceItem.itemType) {
    return {
      isValid: false,
      reason: 'Conflicting item type detected',
    };
  }

  if (
    referenceItem.itemType === OrderItemType.TRANSFER &&
    newItem.contractType === ContractType.ERC721
  ) {
    return {
      isValid: false,
      reason: 'Can only transfer one ERC721 at a time',
    };
  }

  if (newItem.chainId !== referenceItem.chainId) {
    return {
      isValid: false,
      reason: 'Conflicting chainId detected',
    };
  }

  if (
    !compareAddress(
      newItem.collectibleMetadata.collectionAddress,
      referenceItem.collectibleMetadata.collectionAddress,
    )
  ) {
    return {
      isValid: false,
      reason: 'Conflicting collection address detected',
    };
  }

  // no issues
  return {
    isValid: true,
  };
};

type AddCollectibleOrderToCartProps = {
  collectibleOrder: CollectibleOrder;
  itemType: OrderItemType.BUY | OrderItemType.SELL;
};

export const addCollectibleOrderToCart = ({
  collectibleOrder: { order, metadata },
  itemType,
}: AddCollectibleOrderToCartProps) => {
  if (!order) return;
  _addToCart_({
    item: {
      chainId: order.chainId,
      itemType,
      collectibleMetadata: {
        collectionAddress: order.collectionId.toString(),
        tokenId: order.tokenId,
        name: metadata.name || '',
        imageUrl: metadata.image || '',
        decimals: metadata.decimals || 0,
        chainId: order.chainId,
      },
      quantity: defaultSelectionQuantity({
        type: itemType,
        tokenDecimals: metadata.decimals || 0,
        tokenAvailableAmount: BigInt(Number(order.quantityRemaining)),
      }),
      orderId: order.orderId,
    },
    options: {
      toggle: true,
    },
  });
};

type AddTransferOrderToCartProps = {
  collectibleOrder: CollectibleOrder;
  itemType: OrderItemType.TRANSFER;
  contractType: ContractType;
};

export const addTransferOrderToCart = ({
  collectibleOrder: { order, metadata },
  contractType,
  itemType,
}: AddTransferOrderToCartProps) => {
  if (!order) return;
  _addToCart_({
    item: {
      chainId: order.chainId,
      itemType,
      contractType,
      collectibleMetadata: {
        collectionAddress: order.collectionId.toString(),
        tokenId: order.tokenId,
        name: metadata.name || '',
        imageUrl: metadata.image || '',
        decimals: metadata.decimals || 0,
        chainId: order.chainId,
      },
      quantity: defaultSelectionQuantity({
        type: itemType,
        tokenDecimals: metadata.decimals || 0,
        tokenAvailableAmount: BigInt(Number(order.quantityRemaining)),
      }),
    },
    options: {
      toggle: true,
    },
  });
};

export const _addToCart_ = (data: AddToCartData) => {
  const cartItem: CartItem = {
    itemType: data.item.itemType,
    chainId: data.item.collectibleMetadata.chainId,
    collectibleMetadata: data.item.collectibleMetadata,
    quantity: data.item.quantity,
    subtotal: 0n, // calculated dynamically in cart
  };

  if (data.item.itemType == OrderItemType.TRANSFER) {
    cartItem.contractType = data.item.contractType;
  } else {
    cartItem.orderId = data.item.orderId;
  }

  // set cart states
  if (cartState.cartItems.length === 0) {
    // pop open the cart if first item is being added
    cartState.isCartOpen = true;
  }

  // cart conflict conditions
  const { isValid, reason } = canAddToCart(cartItem);

  if (!isValid) {
    console.warn(`${reason}, please clear current cart to continue`);

    cartState.isCartOpen = true;
    cartState.override = {
      cartItems: [cartItem],
    };

    return;
  }

  const itemAlreadyInCart = getExistingCartItem(cartItem);

  if (data.options?.toggle) {
    if (itemAlreadyInCart) {
      // remove item from cart if option.toggle is true
      removeFromCart(itemAlreadyInCart);
      return;
    }
  }

  cartState.cartItems.push(cartItem);
};

export const overrideCart = () => {
  if (cartState.override) {
    cartState.cartItems = cartState.override.cartItems;

    cartState.override = undefined;
  }
};

export const resetCart = () => {
  setCartState(defaultCartState());
};

const setCartState = (newState: CartState) => {
  Object.assign(cartState, newState);
};

export const restoreCartState = (options?: { forceCartHide: boolean }) => {
  const storedStateString = localStorage.getItem(CART_LOCAL_STORAGE_TAG);

  if (storedStateString) {
    try {
      const state = JSON.parse(storedStateString, BigIntReviver) as CartState;

      const validated = cartStateSchema.safeParse(state);

      if (!validated.success) {
        throw new Error(validated.error.message);
      }

      if (options?.forceCartHide) {
        state.isCartOpen = false;
      }

      setCartState(state);
    } catch (error) {
      console.error('cart restoration failed, discarded', error);
      setCartState(defaultCartState());
    }
  }
};

export const clearOverrideCartState = () => {
  cartState.override = undefined;
};

const cartProxy = proxy<CartState>(defaultCartState());

export const cartState = derive(
  {
    baseOrderInfo: (get): BaseOrderInfo => {
      const state = get(cartProxy);
      const defaultItem = state.cartItems[0];

      return {
        chainId: defaultItem?.chainId,
        collectionAddress: defaultItem?.collectibleMetadata.collectionAddress,
        orderType: defaultItem?.itemType,
      };
    },
    orderData: (get): OrderData => {
      const state = get(cartProxy);

      return {
        tokenIds: state.cartItems.map((ci) =>
          ethers.BigNumber.from(ci.collectibleMetadata.tokenId).toString(),
        ),
        tokenAmounts: state.cartItems.map((ci) =>
          ethers.BigNumber.from(ci.quantity).toString(),
        ),
        subtotals: state.cartItems.map((ci) =>
          ethers.BigNumber.from(ci.subtotal).toString(),
        ),
      };
    },
  },
  {
    proxy: cartProxy,
  },
);

// persist cart state in local storage on change
subscribe(cartState, () => {
  localStorage.setItem(
    CART_LOCAL_STORAGE_TAG,
    JSON.stringify(cartState, BigIntReplacer),
  );
});
