import { ContractType } from '@0xsequence/indexer';
import { z } from 'zod';

export enum OrderItemType {
  BUY = 'BUY',
  SELL = 'SELL',
  TRANSFER = 'TRANSFER',
}

const orderItemTypeSchema = z.nativeEnum(OrderItemType);

const collectibleMetadataSchema = z.object({
  chainId: z.number(),
  collectionAddress: z.string(),
  tokenId: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  decimals: z.number().optional(),
});

export type CollectibleMetadata = z.infer<typeof collectibleMetadataSchema>;

const cartItemSchema = z.object({
  itemType: orderItemTypeSchema,
  collectibleMetadata: collectibleMetadataSchema,
  chainId: z.number(),
  subtotal: z.bigint(),
  quantity: z.bigint(),
  contractType: z.nativeEnum(ContractType).optional(), // Needed for transfer flow
  customUnitPrice: z.bigint().optional(), // TODO: should this be renamed to customSubtotal? Trade deposit flow to find out.
  orderId: z.string().optional(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const cartStateSchema = z.object({
  isCartOpen: z.boolean(),
  cartItems: z.array(cartItemSchema),
  override: z
    .object({
      cartItems: z.array(cartItemSchema),
    })
    .optional(),
});

export type CartState = z.infer<typeof cartStateSchema>;

// add to cart types
interface AddToCart_Base {
  itemType: OrderItemType;
  collectibleMetadata: CollectibleMetadata;
  quantity: bigint;
  chainId: number;
}

interface AddToCart_Options {
  toggle?: boolean;
}

export interface AddToCart_Orderbook {
  item: AddToCart_Base & {
    orderId: string;
  };
  options?: AddToCart_Options;
}

export interface AddToCart_Transfer {
  item: AddToCart_Base & {
    contractType: ContractType;
  };
  options?: AddToCart_Options;
}

export type AddToCartData = AddToCart_Orderbook | AddToCart_Transfer;
