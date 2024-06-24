'use client';

import React from 'react';

import { getNetworkConfigAndClients } from '~/api';
import { formatDecimals } from '~/api';
import { OrderItemType } from '~/api/types/order';
import { ConnectButton } from '~/components/buttons/ConnectButton';
import { NetworkSwitchButton } from '~/components/buttons/NetworkSwitchButton';
import {
  balancesKeys,
  metadataKeys,
  orderbookKeys,
  useCountryCode,
} from '~/hooks/data';
import type { OrderWithID } from '~/hooks/orderbook';
import { useERC20Approval } from '~/hooks/transactions/useERC20Approval';
import { useERC721Approval } from '~/hooks/transactions/useERC721Approval';
import { useERC1155Approval } from '~/hooks/transactions/useERC1155Approval';
import { useIsMinWidth } from '~/hooks/ui/useIsMinWidth';
import { useNetworkSwitch } from '~/hooks/utils/useNetworkSwitch';
import { resetCart, cartState, toggleCart } from '~/lib/stores';
import {
  onTransactionFinish,
  setTransactionPendingState,
} from '~/lib/stores/Transaction';
import { getFrontEndFeeAmount } from '~/sdk/niftyswap-v2';
import {
  ORDERBOOK_CONTRACT_ADDRESS,
  Orderbook,
} from '~/sdk/orderbook/clients/Orderbook';
import { isProduction } from '~/utils/environment';
import type {
  GenericStep,
  GenerateStepsOrderbookAcceptRequest,
} from '~/utils/txBundler';
import { generateStepsOrderbookAcceptRequest } from '~/utils/txBundler';

import { Box, Button, Text, toast } from '$ui';
import { transactionNotification } from '../../../Notifications/transactionNotification';
import { useCheckoutModal } from '@0xsequence/kit-checkout';
import { useQueryClient } from '@tanstack/react-query';
import { snapshot, useSnapshot } from 'valtio';
import type { Hex } from 'viem';
import { useAccount, useWalletClient } from 'wagmi';
import type { GetWalletClientData } from 'wagmi/query';

interface OrderbookOrderButtonsProps {
  orders: OrderWithID[];
  erc20Address: string;
  erc20Amount: bigint;
  erc20Symbol: string;
  erc20Decimals: number;
  platformFee: bigint;
  frontEndFeeRecipient?: string;
  isLoading: boolean;
  hasMultipleCurrencies: boolean;
  containsInvalidOrder: boolean;
  frontendFeePercentage: number;
}

export const OrderbookOrderButtons = ({
  orders,
  erc20Amount,
  erc20Address,
  erc20Symbol,
  erc20Decimals,
  platformFee,
  frontEndFeeRecipient,
  isLoading,
  hasMultipleCurrencies,
  containsInvalidOrder,
  frontendFeePercentage,
}: OrderbookOrderButtonsProps) => {
  const queryClient = useQueryClient();
  const {
    baseOrderInfo: { chainId, orderType: cartType },
    orderData,
    cartItems,
  } = useSnapshot(cartState);
  const isDesktop = useIsMinWidth('@xl');

  const { address: userAddress, isConnected, connector } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { triggerCheckout } = useCheckoutModal();

  const { networkMismatch, targetChainId } = useNetworkSwitch({
    targetChainId: chainId,
  });

  const defaultOrder = orders[0];
  const collectionAddress = defaultOrder?.tokenContract;

  const erc20ApprovalEnabled =
    !!erc20Amount && cartType === OrderItemType.BUY_ORDERBOOK;

  const { data: countryCodeData, isLoading: isLoadingCountryCode } =
    useCountryCode();
  const isDev = !isProduction;

  const countryCode = isDev ? 'US' : countryCodeData?.countryCode;

  const {
    data: erc20Approval,
    isLoading: isErc20ApprovalLoading,
    refetch: refetchErc20Approval,
  } = useERC20Approval({
    spenderAddress: ORDERBOOK_CONTRACT_ADDRESS,
    erc20Address: erc20Address,
    userAddress: userAddress,
    targetAmount: erc20Amount,
    chainId: chainId,
    disabled: !erc20ApprovalEnabled,
  });

  const erc721ApprovalEnabled =
    cartType === OrderItemType.SELL_ORDERBOOK &&
    defaultOrder?.isERC1155 === false;

  const {
    data: erc721Approval,
    isLoading: isErc721ApprovalLoading,
    refetch: refetchERC721Approval,
  } = useERC721Approval({
    operatorAddress: ORDERBOOK_CONTRACT_ADDRESS,
    erc721Address: collectionAddress,
    ownerAddress: userAddress,
    chainId: chainId,
    disabled: !erc721ApprovalEnabled,
  });

  const erc1155ApprovalEnabled =
    cartType === OrderItemType.SELL_ORDERBOOK &&
    defaultOrder?.isERC1155 === true;

  const {
    data: erc1155Approval,
    isLoading: isErc1155ApprovalLoading,
    refetch: refetchERC1155Approval,
  } = useERC1155Approval({
    operatorAddress: ORDERBOOK_CONTRACT_ADDRESS,
    erc1155Address: collectionAddress,
    ownerAddress: userAddress,
    chainId: chainId,
    disabled: !erc1155ApprovalEnabled,
  });

  if (!cartItems.length || !chainId || orders.length === 0) {
    return null;
  }

  if (hasMultipleCurrencies) {
    return (
      <>
        <Button className="w-full" label="Disabled" disabled />
      </>
    );
  }

  const postTransactionCacheClear = () => {
    queryClient.invalidateQueries({ queryKey: [...orderbookKeys.all()] });
    queryClient.invalidateQueries({ queryKey: [...balancesKeys.all()] });
    queryClient.invalidateQueries({
      queryKey: [...metadataKeys.useCollectionTokenIDs()],
    });
  };

  if (!isConnected) {
    return (
      <ConnectButton
        variant="default"
        className="w-full"
        onClick={() => {
          if (!isDesktop) {
            toggleCart();
          }
        }}
      />
    );
  }

  if (containsInvalidOrder) {
    return <Button className="w-full" label="Invalid Order" disabled />;
  }

  if (
    (erc20ApprovalEnabled && isErc20ApprovalLoading) ||
    (erc721ApprovalEnabled && isErc721ApprovalLoading) ||
    (erc1155ApprovalEnabled && isErc1155ApprovalLoading) ||
    isLoading ||
    isLoadingCountryCode ||
    !orderData
  ) {
    return <Button className="w-full" label="estimating" disabled />;
  }

  if (erc20Approval?.isUserInsufficientBalance) {
    return (
      <>
        <Button className="w-full" label="Insufficient Balance" disabled />
      </>
    );
  }

  const requiresErc20Approval =
    erc20ApprovalEnabled && erc20Approval?.isRequiresAllowanceApproval;

  const requiresErc721Approval =
    erc721ApprovalEnabled && erc721Approval?.isApprovedForAll === false;

  const requiresErc1155Approval =
    erc1155ApprovalEnabled && erc1155Approval?.isApprovedForAll === false;

  const requiresApproval =
    requiresErc20Approval || requiresErc721Approval || requiresErc1155Approval;

  const { steps, isBundled } = generateStepsOrderbookAcceptRequest({
    connectorId: connector?.id,
    tokenContract: collectionAddress,
    currency: erc20Address as Hex,
    chainId,
    isERC1155: defaultOrder?.isERC1155 === true,
    isListing: cartType === OrderItemType.BUY_ORDERBOOK,
    isApproved: !requiresApproval,
    walletClient: walletClient as GetWalletClientData<any, any> | undefined,
  });

  const renderCurrencyApprovalButton = () => {
    const onApprove = async () => {
      if (!walletClient || !erc20Address) return;

      const approveStep = steps.find((s) => s.id === 'approveERC20') as
        | GenericStep
        | undefined;
      if (!approveStep) return;

      setTransactionPendingState(true);
      try {
        const txnHash = await approveStep.action();

        await transactionNotification({
          network: getNetworkConfigAndClients(chainId).networkConfig,
          txHash: txnHash,
        });

        await refetchErc20Approval();
      } catch (error) {
        console.error(error);
        toast.error('Error approving token');
      } finally {
        setTransactionPendingState(false);
      }
    };

    if (erc20Approval?.isRequiresAllowanceApproval) {
      return (
        <Button
          className="w-full"
          label={`Approve`}
          variant="secondary"
          onClick={onApprove}
        />
      );
    }
  };

  const renderERC1155ApprovalButton = () => {
    const onApprove = async () => {
      if (!walletClient || !collectionAddress) return;

      const approveStep = steps.find((s) => s.id === 'approveERC1155') as
        | GenericStep
        | undefined;
      if (!approveStep) return;

      setTransactionPendingState(true);
      try {
        const txnHash = await approveStep.action();

        await transactionNotification({
          network: getNetworkConfigAndClients(chainId).networkConfig,
          txHash: txnHash,
        });

        await refetchERC1155Approval();
      } catch (error) {
        console.error(error);
        toast.error('Error approving token');
      } finally {
        setTransactionPendingState(false);
      }
    };

    if (erc1155ApprovalEnabled && erc1155Approval?.isApprovedForAll === false) {
      return (
        <Button
          className="w-full"
          label={`Approve Collection`}
          variant="secondary"
          onClick={onApprove}
        />
      );
    }
  };

  const renderERC721ApprovalButton = () => {
    const onApprove = async () => {
      if (!walletClient || !collectionAddress) return;

      const approveStep = steps.find((s) => s.id === 'approveERC721') as
        | GenericStep
        | undefined;
      if (!approveStep) return;

      setTransactionPendingState(true);
      try {
        const txnHash = await approveStep.action();

        await transactionNotification({
          network: getNetworkConfigAndClients(chainId).networkConfig,
          txHash: txnHash,
        });

        await refetchERC721Approval();
      } catch (error) {
        console.error(error);
        toast.error('Error approving token');
      } finally {
        setTransactionPendingState(false);
      }
    };

    if (erc721ApprovalEnabled && erc721Approval?.isApprovedForAll === false) {
      return (
        <Button
          className="w-full"
          label={`Approve Collection`}
          variant="secondary"
          onClick={onApprove}
        />
      );
    }
  };

  const buyAction = async () => {
    if (!walletClient || !orderData) return;

    const acceptOrderStep = steps.find((s) => s.id === 'acceptRequestBatch') as
      | GenerateStepsOrderbookAcceptRequest
      | undefined;
    if (!acceptOrderStep) return;

    setTransactionPendingState(true);

    try {
      const txnHash = await acceptOrderStep.action({
        acceptRequests: cartItems.map((item) => ({
          orderId: item.orderbookOrderId!,
          quantity: item.quantity,
          address: userAddress || '',
          tokenId: item.collectibleMetadata.tokenId,
          additionalFees: [BigInt(platformFee?.toString() || 0n)],
          additionalFeeRecipients: [frontEndFeeRecipient as Hex],
        })),
      });

      await transactionNotification({
        network: getNetworkConfigAndClients(chainId).networkConfig,
        txHash: txnHash,
        onSuccess: () => {
          cartItems.forEach((item) => {
            const frontendFeeAmount = getFrontEndFeeAmount(
              item.subtotal,
              frontendFeePercentage,
            );
            const currencyAmountRaw = defaultOrder?.isListing
              ? item.subtotal + frontendFeeAmount
              : item.subtotal - frontendFeeAmount;

            analytics()?.trackBuyItems({
              props: {
                txnHash,
                chainId: String(chainId),
                marketplaceType: 'orderbook',
                collectionAddress: collectionAddress.toLowerCase(),
                currencyAddress: erc20Address.toLowerCase(),
                currencySymbol: erc20Symbol.toUpperCase(),
                tokenId: item.collectibleMetadata.tokenId,
                requestId: item.orderbookOrderId || '',
              },
              nums: {
                currencyValueDecimal: Number(
                  formatDecimals(currencyAmountRaw, erc20Decimals),
                ),
                currencyValueRaw: Number(currencyAmountRaw),
              },
            });
          });
        },
      });

      postTransactionCacheClear();

      onTransactionFinish({
        transactionId: txnHash,
        cartItems: snapshot(cartState.cartItems),
        cartType: cartType,
      });

      resetCart();
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'unknown error';
      analytics()?.trackTransactionFailed({
        chainId: String(chainId),
        txnHash: '',
        description: 'orderbook - buy from cart',
        errorMessage,
      });
      showErrorToast(error);
    }

    setTransactionPendingState(false);
  };

  const sellAction = async () => {
    if (!walletClient || !orderData) return;

    const acceptOrderStep = steps.find((s) => s.id === 'acceptRequestBatch') as
      | GenerateStepsOrderbookAcceptRequest
      | undefined;
    if (!acceptOrderStep) return;

    setTransactionPendingState(true);

    try {
      const txnHash = await acceptOrderStep.action({
        acceptRequests: cartItems.map((item) => ({
          orderId: item.orderbookOrderId!,
          quantity: item.quantity,
          address: userAddress || '',
          tokenId: item.collectibleMetadata.tokenId,
          additionalFees: [BigInt(platformFee?.toString() || 0n)],
          additionalFeeRecipients: [frontEndFeeRecipient as Hex],
        })),
      });

      await transactionNotification({
        network: getNetworkConfigAndClients(chainId).networkConfig,
        txHash: txnHash,
        onSuccess: () => {
          cartItems.forEach((item) => {
            const frontendFeeAmount = getFrontEndFeeAmount(
              item.subtotal,
              frontendFeePercentage,
            );
            const currencyAmountRaw = defaultOrder?.isListing
              ? item.subtotal + frontendFeeAmount
              : item.subtotal - frontendFeeAmount;

            analytics()?.trackSellItems({
              props: {
                txnHash,
                chainId: String(chainId),
                marketplaceType: 'orderbook',
                collectionAddress: collectionAddress.toLowerCase(),
                currencyAddress: erc20Address.toLowerCase(),
                currencySymbol: erc20Symbol.toUpperCase(),
                tokenId: item.collectibleMetadata.tokenId,
                requestId: item.orderbookOrderId || '',
              },
              nums: {
                currencyValueDecimal: Number(
                  formatDecimals(currencyAmountRaw, erc20Decimals),
                ),
                currencyValueRaw: Number(currencyAmountRaw),
              },
            });
          });
        },
      });

      postTransactionCacheClear();

      onTransactionFinish({
        transactionId: txnHash,
        cartItems: snapshot(cartState.cartItems),
        cartType: cartType,
      });

      resetCart();
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'unknown error';
      analytics()?.trackTransactionFailed({
        chainId: String(chainId),
        txnHash: '',
        description: 'orderbook - sell from cart',
        errorMessage,
      });
      showErrorToast(error);
    }

    setTransactionPendingState(false);
  };

  const renderOrderButton = () => {
    const onBuyClick = () => {
      buyAction();
    };

    const onSellClick = () => {
      sellAction();
    };

    switch (cartType) {
      case OrderItemType.BUY_ORDERBOOK:
        return (
          <Button
            className="w-full"
            label={`BUY`}
            onClick={onBuyClick}
            disabled={!isBundled && requiresApproval}
          />
        );
      case OrderItemType.SELL_ORDERBOOK:
        return (
          <Button
            className="w-full"
            label={`SELL`}
            onClick={onSellClick}
            disabled={!isBundled && requiresApproval}
          />
        );
      default:
        break;
    }
  };

  if (networkMismatch) {
    return <NetworkSwitchButton targetChainId={targetChainId} />;
  }

  return (
    <>
      {renderNFTCheckoutButton()}
      {!isBundled && renderCurrencyApprovalButton()}
      {!isBundled && renderERC1155ApprovalButton()}
      {!isBundled && renderERC721ApprovalButton()}
      {renderOrderButton()}
    </>
  );
};

const showErrorToast = (error: any) => {
  // https://github.com/MetaMask/rpc-errors/blob/main/src/error-constants.ts
  console.log('TRANSACTION ERROR CODE:', error?.code, error);

  switch (error?.code) {
    case 'ACTION_REJECTED':
    case 4001: {
      toast.error('User has rejected the Transaction!');
      break;
    }
    case -32003: {
      toast.error('User has rejected the transaction!');
      break;
    }
    default: {
      toast.error(error?.message?.substring(0, 100));
    }
  }
};
