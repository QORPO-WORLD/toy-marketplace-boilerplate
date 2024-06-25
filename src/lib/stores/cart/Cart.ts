import { OrderItemType } from '~/api/types/order';
import { compareAddress } from '~/utils/address';
import { BigIntReplacer, BigIntReviver } from '~/utils/bigint';

import type {
  AddToCartData,
  CartItem,
  CartState,
  CollectibleMetadata,
} from './types';
import { CartType, cartStateSchema } from './types';
import { ContractType } from '@0xsequence/indexer';
import * as ethers from 'ethers';
import { proxy, subscribe } from 'valtio';
import { derive } from 'valtio/utils';

const CART_LOCAL_STORAGE_TAG = '@marketplace.cart';

export type { CartItem, CollectibleMetadata };

const defaultCartState = (): CartState => ({
  cartType: CartType.EMPTY,
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
  exchangeAddress: string | undefined;
  collectionAddress: string | undefined;
  orderType: OrderItemType | undefined;
};

// unique id for cart item
export const cartItemId = (
  item: Pick<
    CartItem,
    'itemType' | 'collectibleMetadata' | 'exchangeAddress' | 'orderbookOrderId'
  >,
) => {
  return (
    `${item.itemType}-` +
    `${item.collectibleMetadata.chainId}-` +
    `${item.collectibleMetadata.collectionAddress}-` +
    `${item.collectibleMetadata.tokenId}-` +
    `${item.orderbookOrderId}`
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
    item.subtotal = subtotals[index];
  });
};

const canAddToCart = (
  newItem: CartItem,
): {
  isValid: boolean;
  reason?: string;
} => {
  if (cartState.cartItems.length === 0) {
    // first item, dont care
    return {
      isValid: true,
    };
  }

  // do not allow mixed cart items for now
  // remove this when we support batch transactions / sequence proxy
  const referenceItem = cartState.cartItems[0];

  if (newItem.itemType !== referenceItem.itemType) {
    return {
      isValid: false,
      reason: 'Conflicting item type detected',
    };
  }

  if (
    cartState.cartType === CartType.TRANSFER &&
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

  if (!compareAddress(newItem.exchangeAddress, referenceItem.exchangeAddress)) {
    return {
      isValid: false,
      reason: 'Conflicting exchange address detected',
    };
  }

  // no issues
  return {
    isValid: true,
  };
};

export const _addToCart_ = (data: AddToCartData) => {
  const cartItem: CartItem = {
    itemType: data.item.itemType,
    chainId: data.item.collectibleMetadata.chainId,
    collectibleMetadata: data.item.collectibleMetadata,
    quantity: data.item.quantity,
    subtotal: 0n, // calculated dynamically in cart
  };

  // special orderbook handling
  if (data.type === CartType.ORDERBOOK) {
    cartItem.orderbookOrderId = data.item.orderbookOrderId;
  }

  // special TRANSFER handling
  if (data.type === CartType.TRANSFER) {
    cartItem.contractType = data.item.contractType;
  }

  // escape hatch
  if (data.item.itemType === OrderItemType.UNKNOWN) {
    console.error('unknown item type');
    return;
  }

  // set cart states
  if (cartState.cartItems.length === 0) {
    // pop open the cart if first item is being added
    cartState.isCartOpen = true;
    // set cart type!
    cartState.cartType = data.type; // TODO: do we need this?
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

  if (itemAlreadyInCart) {
    // item already in cart
    switch (data.item.itemType) {
      case OrderItemType.DEPOSIT:
        itemAlreadyInCart.quantity = cartItem.quantity;
        itemAlreadyInCart.subtotal = cartItem.subtotal;
        break;
      case OrderItemType.WITHDRAW:
        itemAlreadyInCart.quantity = cartItem.quantity;
      default:
        break;
    }
  } else {
    // new item
    cartState.cartItems.push(cartItem);
  }
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
        exchangeAddress: defaultItem?.exchangeAddress,
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
