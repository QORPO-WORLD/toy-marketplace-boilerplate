'use client';

import React, { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { WalletButton } from '~/app/_layout/Header/Buttons/WalletButton';
import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import { getPresentableChainName } from '~/config/networks';
import { useOrderbookApprovals } from '~/hooks/orderbook/useOrderbookApprovals';
import {
  useOrderbookFormData,
  type OrderbookFormData,
} from '~/hooks/orderbook/useOrderbookFormData';
import { useOrderbookOrderMatch } from '~/hooks/orderbook/useOrderbookOrderMatch';
import { getFrontEndFeeAmount } from '~/lib/sdk/niftyswap-v2';
import { formatDecimals } from '~/lib/utils/helpers';
import {
  generateStepsOrderbookOrder,
  type CreateRequestParams,
} from '~/lib/utils/txBundler';
import { getRequestIdFromHash } from '~/lib/utils/txBundler/getRequestIdFromHash';

import {
  Avatar,
  Box,
  Flex,
  Image,
  Input,
  InformationIcon,
  Button,
  Text,
  Tooltip,
  toast,
  ChevronRightIcon,
  LoaderIcon,
  cn,
  DatePicker,
} from '$ui';
import type { OrderbookModalType } from '.';
import { transactionNotification } from '../Notifications/transactionNotification';
import { BestOrder } from './BestOrder';
import { CurrencyDropdown } from './CurrencyDropdown';
import { MatchingOrderInfo } from './MatchedOrderDisplay';
import { TokenSummary } from './TokenSummary';
import { type OrderbookOrder } from '@0xsequence/indexer';
import {
  compareAddress,
  useCollectibleBalance,
  formatDisplay,
} from '@0xsequence/kit';
import type { ContractInfo, TokenMetadata } from '@0xsequence/metadata';
import { useQueryClient } from '@tanstack/react-query';
import { addDays } from 'date-fns';
import { useSnapshot } from 'valtio';
import type { Hex } from 'viem';
import { formatUnits } from 'viem';
import {
  useAccount,
  useSwitchChain,
  useWalletClient,
  usePublicClient,
} from 'wagmi';
import type { GetWalletClientData } from 'wagmi/query';

interface OrderFormProps {
  type: OrderbookModalType;
  chainId: number;
  collectionMetadata: ContractInfo;
  tokenMetadata: TokenMetadata;
  currencyOptions: DefaultCurrency[];
  royaltyPercentage: bigint | undefined;

  isERC1155: boolean;

  bestOrder?: OrderbookOrder;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OrderForm = ({
  type,
  chainId,
  collectionMetadata,
  tokenMetadata,
  currencyOptions,
  isERC1155,
  bestOrder,
  setOpen,
  royaltyPercentage,
}: OrderFormProps) => {
  const decimalEnabled = (tokenMetadata.decimals || 0) > 0;
  const isListing = type === 'listing';
  const isOffer = type === 'offer';

  const { address, isConnected, connector, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();

  const { analytics } = useSnapshot(analyticsState);

  const { switchChainAsync, isPending: isSwitchNetworkLoading } =
    useSwitchChain();

  const [approveTxPending, setApproveTxPending] = useState<boolean>(false);
  const [orderTxPending, setOrderTxPending] = useState<boolean>(false);

  const networkMismatch = chain?.id !== chainId;

  const defaultCurrency = bestOrder
    ? currencyOptions.find((c) =>
        compareAddress(c.contractAddress, bestOrder.currencyAddress),
      ) || currencyOptions[0]
    : currencyOptions[0];

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    watch,
    formState: { errors },
    computedValues: {
      totalCost,
      pricePerToken,
      tokenAmount,
      listedPrice,
      royaltyFee,
      listingAmountReceived,
    },
  } = useOrderbookFormData({
    currency: {
      defaultCurrency,
    },
    options: {
      tokenDecimalDisabled: !decimalEnabled,
    },
    tokenMetadata,
    royaltyPercentage,
    isOffer,
  });

  const { matched, fillableTokenAmountRaw, unfillableTokenAmountRaw } =
    useOrderbookOrderMatch({
      bestOrder,
      selectedCurrencyAddress: watch('currency.contractAddress'),
      selectedTokenAmountRaw: tokenAmount.raw,
      selectedPerTokenPriceRaw: pricePerToken.raw,
      tokenDecimal: tokenMetadata?.decimals || 0,
      chainId,
    });

  const shouldAutoFill = matched && unfillableTokenAmountRaw === 0n;

  useEffect(() => {
    if (!bestOrder || !tokenMetadata) {
      return;
    }

    const bestOrderCurrency = currencyOptions.find((c) =>
      compareAddress(c.contractAddress, bestOrder.currencyAddress),
    );

    const oneUnit = 10 ** (tokenMetadata?.decimals || 0);
    const unitPriceRaw = BigInt(oneUnit) * BigInt(bestOrder.pricePerToken);

    const unitPrice = formatUnits(
      unitPriceRaw,
      bestOrderCurrency?.decimals || 0,
    );

    setValue('unitPrice', unitPrice);
  }, [bestOrder, tokenMetadata]);

  const {
    data: isApprovedData,
    isLoading: isLoadingIsApproved,
    refetch: refetchIsApproved,
  } = useOrderbookApprovals({
    userAddress: address,
    isErc1155: !!isERC1155,
    chainId,
    collectionAddress: collectionMetadata.address as Hex,
    type,
    erc20Address: watch('currency.contractAddress'),
    erc20Amount: totalCost.raw,
    orderbookAddress: SEQUENCE_MARKET_V1_ADDRESS,
    walletClient: walletClient as GetWalletClientData<any, any> | undefined,
  });

  const { steps, isBundled } = generateStepsOrderbookOrder({
    isListing,
    isERC1155: !!isERC1155,
    currency: watch('currency.contractAddress') as Hex,
    tokenContract: collectionMetadata.address as Hex,
    isApproved: !!isApprovedData,
    chainId,
    connectorId: connector?.id,
    walletClient: walletClient as GetWalletClientData<any, any> | undefined,
  });

  const approveOnClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const approveStep = steps.find(
      (s) =>
        s.id === 'approveERC1155' ||
        s.id === 'approveERC20' ||
        s.id === 'approveERC721',
    );

    if (!approveStep) return;

    setApproveTxPending(true);

    try {
      const txHash = await approveStep.action();

      await transactionNotification({
        network: getNetworkConfigAndClients(chainId).networkConfig,
        txHash,
      });
      await refetchIsApproved();
    } catch (error) {
      toast.error('Error approving token');
    }
    setApproveTxPending(false);
  };

  const {
    data: userCollectibleBalance,
    isLoading: isUserCollectibleBalanceLoading,
  } = useCollectibleBalance({
    chainId,
    userAddress: address as string,
    contractAddress: collectionMetadata.address,
    tokenId: tokenMetadata.tokenId,
  });

  const formattedTokenBalance = formatDisplay(
    formatDecimals(userCollectibleBalance || 0, tokenMetadata?.decimals || 0),
  );

  const { data: userCurrencyBalance, isLoading: isUserCurrencyBalanceLoading } =
    useERC20UserBalanceDirect({
      chainId,
      userAddress: address as string,
      erc20contractAddress: watch('currency.contractAddress'),
    });

  const formattedCurrencyBalance = formatDecimals(
    userCurrencyBalance || 0,
    watch('currency.decimals') || 0,
  );

  useEffect(() => {
    // this is a computed error, set it manually instead of on any single input
    if (isOffer && !isUserCurrencyBalanceLoading) {
      // if total cost > selected currency balance, show error
      if (totalCost.decimal > Number(formattedCurrencyBalance)) {
        setError('root', {
          type: 'error',
          message: 'Insufficient Balance',
        });
      } else {
        // clear error
        clearErrors('root');
      }
    }
  }, [totalCost.decimal, isUserCurrencyBalanceLoading]);

  const formHasValidationErrors = !!Object.values(errors).length;

  const addOne = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const tokenAmount = getValues('tokenAmount');

    const newAmount = isOffer
      ? // no limit
        Number(tokenAmount || 0) + 1
      : // limit to balance
        Math.min(
          Number(formattedTokenBalance || 0),
          Number(tokenAmount || 0) + 1,
        );

    setValue('tokenAmount', String(newAmount), {
      shouldValidate: true,
    });
  };

  const subtractOne = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const tokenAmount = getValues('tokenAmount');

    if (isNaN(Number(tokenAmount))) {
      return;
    }

    const decimalPlaces = tokenAmount.split('.')[1]?.length || 0;

    const newAmount = Math.max(0, Number(tokenAmount || 0) - 1);

    const formattedAmount =
      newAmount > 0 ? newAmount.toFixed(decimalPlaces) : '0';

    setValue('tokenAmount', String(formattedAmount), {
      shouldValidate: true,
    });
  };

  const maxAmount = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    setValue('tokenAmount', formattedTokenBalance, {
      shouldValidate: true,
    });
  };

  const postTransactionCacheClear = () => {
    queryClient.invalidateQueries({ queryKey: [...orderbookKeys.all()] });
    queryClient.invalidateQueries({ queryKey: [...balancesKeys.all()] });
    queryClient.invalidateQueries({
      queryKey: [...metadataKeys.useCollectionTokenIDs()],
    });
  };

  const onSubmit: SubmitHandler<OrderbookFormData> = async (data) => {
    const createOrderStep = steps.find((s) => s.id === 'createOrder');

    if (!createOrderStep) return;

    setOrderTxPending(true);
    try {
      if (!walletClient) {
        return;
      }

      let action: CreateRequestParams;

      if (shouldAutoFill && bestOrder && fillableTokenAmountRaw) {
        const feePerceentage = getMarketplaceFeePercentage(
          bestOrder.tokenContract,
        );

        const orderSubtotalRaw =
          BigInt(bestOrder.pricePerToken) * fillableTokenAmountRaw;

        action = {
          partialOrders: [
            {
              orderId: bestOrder.orderId,
              quantity: fillableTokenAmountRaw,
              address: address!,
              tokenId: bestOrder.tokenId,
              additionalFeeRecipients: [getPlatformFeeRecipient(chainId)],
              additionalFees: [
                getFrontEndFeeAmount(orderSubtotalRaw, feePerceentage),
              ],
            },
          ],
        };
      } else {
        const expiryInUnixSec = BigInt(
          Math.floor(new Date(data.expiry).getTime() / 1000),
        );
        action = {
          createOrder: {
            tokenId: tokenMetadata.tokenId,
            quantity: tokenAmount.raw,
            expiry: expiryInUnixSec,
            pricePerToken: pricePerToken.raw,
          },
        };
      }

      const txnHash = await createOrderStep.action(action);

      await transactionNotification({
        network: getNetworkConfigAndClients(chainId).networkConfig,
        txHash: txnHash,
        onSuccess: async () => {
          if (action.partialOrders) {
            // matched order or partial fulfillment
            if (isListing) {
              // order is matched in create listing mode, this means this is a sell order
              analytics()?.trackSellItems({
                props: {
                  txnHash,
                  chainId: String(chainId),
                  marketplaceType: 'orderbook',
                  collectionAddress: collectionMetadata.address.toLowerCase(),
                  currencyAddress: data.currency.contractAddress.toLowerCase(),
                  currencySymbol:
                    data.currency.symbol?.toUpperCase() || 'unknown',
                  requestId: action.partialOrders[0].orderId,
                  tokenId: action.partialOrders[0].tokenId,
                },
                nums: {
                  currencyValueDecimal: totalCost.decimal,
                  currencyValueRaw: Number(totalCost.raw),
                },
              });
            } else {
              // order is matched in create offer mode, this means this is a buy order
              analytics()?.trackBuyItems({
                props: {
                  txnHash,
                  chainId: String(chainId),
                  marketplaceType: 'orderbook',
                  collectionAddress: collectionMetadata.address.toLowerCase(),
                  currencyAddress: data.currency.contractAddress.toLowerCase(),
                  currencySymbol:
                    data.currency.symbol?.toUpperCase() || 'unknown',
                  requestId: action.partialOrders[0].orderId,
                  tokenId: action.partialOrders[0].tokenId,
                },
                nums: {
                  currencyValueDecimal: totalCost.decimal,
                  currencyValueRaw: Number(totalCost.raw),
                },
              });
            }
          }

          if (action.createOrder) {
            const requestId = await getRequestIdFromHash(
              txnHash,
              walletClient,
              publicClient,
            );
            if (isListing) {
              // order is not matched in create listing mode, normal listing
              analytics()?.trackCreateListing({
                props: {
                  txnHash,
                  chainId: String(chainId),
                  marketplaceType: 'orderbook',
                  collectionAddress: collectionMetadata.address.toLowerCase(),
                  currencyAddress: data.currency.contractAddress.toLowerCase(),
                  currencySymbol:
                    data.currency.symbol?.toUpperCase() || 'unknown',
                  requestId,
                  tokenId: action.createOrder.tokenId,
                },
                nums: {
                  currencyValueDecimal: totalCost.decimal,
                  currencyValueRaw: Number(totalCost.raw),
                },
              });
            } else {
              // order is not matched in create offer mode, normal offer
              analytics()?.trackCreateOffer({
                props: {
                  txnHash,
                  chainId: String(chainId),
                  marketplaceType: 'orderbook',
                  collectionAddress: collectionMetadata.address.toLowerCase(),
                  currencyAddress: data.currency.contractAddress.toLowerCase(),
                  currencySymbol:
                    data.currency.symbol?.toUpperCase() || 'unknown',
                  requestId,
                  tokenId: action.createOrder.tokenId,
                },
                nums: {
                  currencyValueDecimal: totalCost.decimal,
                  currencyValueRaw: Number(totalCost.raw),
                },
              });
            }
          }
        },
      });
      postTransactionCacheClear();
      setOpen(false);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'unknown error';
      toast.error('The transaction has failed or was cancelled');
    }
    setOrderTxPending(false);
  };

  const isApproveDisabled =
    !!isApprovedData ||
    isLoadingIsApproved ||
    approveTxPending ||
    formHasValidationErrors;

  const isCreateDisabled =
    (!isApprovedData && !isBundled) ||
    isLoadingIsApproved ||
    approveTxPending ||
    orderTxPending ||
    formHasValidationErrors ||
    totalCost.raw <= 0;

  // if (isLoading) {
  //   return <Spinner />
  // }

  const actionLabel = () => {
    if (shouldAutoFill) {
      return 'Accept Order';
    }

    if (isListing) {
      return 'Create Listing';
    } else {
      return 'Create Offer';
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-h-[calc(100dvh-60px)] overflow-auto"
    >
      <Flex className="flex-col gap-10 pt-10">
        <Flex
          className={cn(
            'relative flex-col gap-2',
            approveTxPending || orderTxPending
              ? 'pointer-events-none opacity-30'
              : '',
          )}
        >
          <TokenSummary
            tokenMetadata={tokenMetadata}
            collectionData={collectionMetadata}
            type={type}
          />

          <BestOrder
            bestOrder={bestOrder}
            type={type}
            tokenMetadata={tokenMetadata}
            currency={defaultCurrency}
          />

          <Flex className="mt-8 w-full flex-col gap-5">
            {decimalEnabled && (
              <Flex className="w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <Flex className="w-1/3 items-center gap-2">
                  <Text className="text-sm font-medium text-foreground/90">
                    Quantity
                  </Text>

                  <Tooltip.Root>
                    <Tooltip.Trigger onClick={(e) => e.preventDefault()}>
                      <InformationIcon className="h-4 w-4 text-sm text-foreground/30" />
                    </Tooltip.Trigger>

                    <Tooltip.Content>
                      Quantity of collectibles (decimals{' '}
                      {tokenMetadata?.decimals || 0})
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Flex>

                <Flex className="w-full flex-col gap-1">
                  <Input.Control
                    name="tokenAmount"
                    control={control}
                    placeholder="Enter Quantity"
                    type="number"
                    required
                    rules={{
                      required: 'Quantity is required',

                      validate: {
                        isNumber: (val) =>
                          !isNaN(val) || 'Quantity should be a valid number',

                        isMoreThanZero: (val) => {
                          return (
                            Number(val) > 0 || 'Quantity should be more than 0'
                          );
                        },
                        isProperDecimal: (val) => {
                          const tokenAmount = Number(val);
                          const tokenDecimals = tokenMetadata?.decimals || 0;
                          const tokenAmountString = String(tokenAmount);
                          const tokenAmountSplit = tokenAmountString.split('.');
                          const tokenAmountDecimal =
                            tokenAmountSplit.length > 1
                              ? tokenAmountSplit[1].length
                              : 0;
                          return (
                            tokenAmountDecimal <= tokenDecimals ||
                            `${tokenMetadata.name} supports a maximum of ${tokenDecimals} decimals`
                          );
                        },
                        isLessThanMax: (val) => {
                          const tokenAmount = Number(val);
                          const tokenBalance = Number(formattedTokenBalance);

                          if (isOffer) {
                            return true;
                          }

                          return (
                            tokenAmount <= tokenBalance ||
                            'Insufficient balance for Quantity'
                          );
                        },
                      },
                    }}
                    prefix={
                      <Box className="pl-3 pr-0">
                        <Image.Base
                          src={tokenMetadata.image}
                          alt={tokenMetadata.name}
                          containerClassName="w-6 max-w-6 max-h-6 aspect-square rounded-sm"
                        />
                      </Box>
                    }
                    suffix={
                      <Flex className="max-h items-center gap-1 p-2">
                        <Button
                          size="xs"
                          variant="muted"
                          onClick={addOne}
                          className="!rounded-sm px-2.5"
                        >
                          +
                        </Button>
                        <Button
                          size="xs"
                          variant="muted"
                          onClick={subtractOne}
                          className="!rounded-sm px-2.5"
                        >
                          -
                        </Button>
                        {isListing && (
                          <Button
                            className="!rounded-sm font-semibold"
                            size="xs"
                            variant="muted"
                            onClick={maxAmount}
                          >
                            Max
                          </Button>
                        )}
                      </Flex>
                    }
                    className="h-12 divide-x-0"
                  />
                  <Flex className="justify-start pt-1">
                    {isListing && (
                      <Text className="text-xs font-medium text-foreground/40">
                        Balance: {formattedTokenBalance}
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            )}
            <Flex className="w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <Text className="w-1/3 text-sm font-medium text-foreground/90">
                Price Per Unit
              </Text>
              <Flex className="w-full flex-col gap-1">
                <Flex className="w-full flex-col gap-2 sm:flex-row">
                  <CurrencyDropdown
                    defaultCurrency={watch('currency')}
                    currencies={currencyOptions}
                    onSetCurrency={(currency) => {
                      setValue('currency', currency);
                    }}
                    resetCurrencyAmount={() => {
                      setValue('unitPrice', '');
                    }}
                  />
                  <Flex className="w-full flex-col gap-1">
                    <Input.Control
                      name="unitPrice"
                      control={control}
                      type="number"
                      placeholder="Enter Unit Price"
                      className="h-12"
                      // required
                      rules={{
                        required: 'Unit Price is required',
                        validate: {
                          isMoreThanZero: (val) => {
                            return (
                              Number(val) > 0 ||
                              'Unit Price should be more than 0'
                            );
                          },
                          isProperDecimal: (val) => {
                            const currencyDecimals =
                              watch('currency.decimals') || 0;
                            const currencyDecimalString = String(val);
                            const currencyValueSplit =
                              currencyDecimalString.split('.');
                            const currencyDecimal =
                              currencyValueSplit.length > 1
                                ? currencyValueSplit[1].length
                                : 0;
                            return (
                              currencyDecimal <= currencyDecimals ||
                              `${watch(
                                'currency.symbol',
                              )} supports a maximum of ${currencyDecimals} decimals`
                            );
                          },
                        },
                      }}
                    />
                  </Flex>
                </Flex>
                <Flex className="justify-start pt-1">
                  {isOffer && (
                    <Text className="text-xs font-medium text-foreground/40">
                      Balance:{' '}
                      {isUserCurrencyBalanceLoading
                        ? '-'
                        : formattedCurrencyBalance}{' '}
                      {watch('currency.symbol') || ''}
                    </Text>
                  )}
                </Flex>
              </Flex>
            </Flex>

            <Flex className="w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <Text className="w-1/3 text-sm font-medium text-foreground/90">
                {isListing ? 'Listing expiry' : 'Offer expiry'}
              </Text>
              <Box className="w-full">
                <Controller
                  name="expiry"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      variant="withPresets"
                      defaultDate={addDays(new Date(), 3)}
                      {...field}
                    />
                  )}
                />
              </Box>
            </Flex>
          </Flex>
          <Flex className="w-full flex-col">
            <Flex className="w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <Text className="w-1/3 text-sm font-medium text-foreground/90">
                Listed Price
              </Text>
              <Flex className="w-full items-center justify-start gap-2">
                <Avatar.Base className="h-5 w-5">
                  <Avatar.Image src={watch('currency.logoUri')} />
                  <Avatar.Fallback>{watch('currency.symbol')}</Avatar.Fallback>
                </Avatar.Base>

                <Text className="flex-col justify-between gap-3 text-sm sm:flex-row sm:items-center">
                  {totalCost.raw === BigInt(0)
                    ? '--'
                    : `${formatUnits(
                        BigInt(listedPrice.raw),
                        watch('currency.decimals') || 0,
                      )} ${watch('currency.symbol')}`}
                </Text>
              </Flex>
            </Flex>

            <Flex className="w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <Text className="w-1/3 text-sm font-medium text-foreground/90">
                Royalty Fee ({Number(royaltyPercentage)}%)
              </Text>
              <Flex className="w-full items-center justify-start gap-2">
                <Avatar.Base className="h-5 w-5">
                  <Avatar.Image src={watch('currency.logoUri')} />
                  <Avatar.Fallback>{watch('currency.symbol')}</Avatar.Fallback>
                </Avatar.Base>
                <Text className="w-full flex-col justify-between gap-3 text-sm sm:flex-row sm:items-center">
                  {totalCost.raw === BigInt(0)
                    ? '--'
                    : `${formatUnits(
                        BigInt(royaltyFee.raw),
                        watch('currency.decimals') || 0,
                      )} ${watch('currency.symbol')}`}
                </Text>
              </Flex>
            </Flex>

            {isListing && (
              <Flex className="w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <Text className="w-1/3 text-sm font-medium text-foreground/90">
                  Amount Received
                </Text>
                <Flex className="w-full items-center justify-start gap-2">
                  <Avatar.Base className="h-5 w-5">
                    <Avatar.Image src={watch('currency.logoUri')} />
                    <Avatar.Fallback>
                      {watch('currency.symbol')}
                    </Avatar.Fallback>
                  </Avatar.Base>
                  <Text className="w-full flex-col justify-between gap-3 text-sm sm:flex-row sm:items-center">
                    {totalCost.raw === BigInt(0)
                      ? '--'
                      : `${formatUnits(
                          BigInt(listingAmountReceived.raw),
                          watch('currency.decimals') || 0,
                        )} ${watch('currency.symbol')}`}
                  </Text>
                </Flex>
              </Flex>
            )}

            {isOffer && (
              <Flex className="w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <Text className="w-1/3 text-sm font-medium text-foreground/90">
                  Total Payment
                </Text>
                <Flex className="w-full items-center justify-start gap-2">
                  <Avatar.Base className="h-5 w-5">
                    <Avatar.Image src={watch('currency.logoUri')} />
                    <Avatar.Fallback>
                      {watch('currency.symbol')}
                    </Avatar.Fallback>
                  </Avatar.Base>
                  <Text className="w-full flex-col justify-between gap-3 text-sm sm:flex-row sm:items-center">
                    {totalCost.raw === BigInt(0)
                      ? '--'
                      : `${formatUnits(
                          BigInt(totalCost.raw),
                          watch('currency.decimals') || 0,
                        )} ${watch('currency.symbol')}`}
                  </Text>
                </Flex>
              </Flex>
            )}
          </Flex>
        </Flex>

        <Flex className="w-full flex-col gap-2">
          {formHasValidationErrors && (
            <Box className="w-full rounded-xl bg-destructive/10 p-5">
              {Object.values(errors).map((error, index) => {
                return (
                  <Text className="text-sm text-destructive" key={index}>
                    {error.message}
                  </Text>
                );
              })}
            </Box>
          )}

          {!formHasValidationErrors && matched && (
            <MatchingOrderInfo
              type={type}
              fillableAmount={fillableTokenAmountRaw}
              unfillableAmount={unfillableTokenAmountRaw}
              tokenDecimal={tokenMetadata.decimals || 0}
            />
          )}

          {isConnected && !networkMismatch && (
            <>
              {!isApprovedData && !isLoadingIsApproved && !isBundled && (
                <Button
                  onClick={approveOnClick}
                  disabled={isApproveDisabled}
                  className="h-[52px] w-full justify-between !rounded-md"
                >
                  {approveTxPending ? (
                    <>
                      Awaiting wallet approval
                      <LoaderIcon className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Approve
                      <ChevronRightIcon />
                    </>
                  )}
                </Button>
              )}

              <Button
                type="submit"
                disabled={isCreateDisabled}
                variant={isApprovedData || isBundled ? 'default' : 'muted'}
                className="h-[52px] w-full justify-between !rounded-md"
              >
                {actionLabel()}
                {totalCost.decimal > 0 && (
                  <Flex className="items-center justify-end gap-2">
                    <Avatar.Base className="h-5 w-5">
                      <Avatar.Image src={watch('currency.logoUri')} />
                      <Avatar.Fallback>
                        {watch('currency.symbol')}
                      </Avatar.Fallback>
                    </Avatar.Base>

                    <Text className="text-md break-words break-all font-bold text-foreground">
                      {totalCost.decimal} {watch('currency.symbol')}
                    </Text>
                  </Flex>
                )}
              </Button>
            </>
          )}

          {isConnected && networkMismatch && (
            <Button
              type="button"
              disabled={isSwitchNetworkLoading}
              variant={!isSwitchNetworkLoading ? 'default' : 'muted'}
              className="h-[52px] w-full justify-between !rounded-md"
              onClick={async () => {
                try {
                  await switchChainAsync({ chainId });
                } catch (err) {
                  console.error('failed to switch network', err);
                  toast.error('Failed to switch network');
                }
              }}
            >
              {isSwitchNetworkLoading ? (
                'Switching'
              ) : (
                <>Switch Network to {getPresentableChainName(chainId)} </>
              )}
            </Button>
          )}

          {!isConnected ? (
            <WalletButton
              buttonProps={{
                type: 'button',
                variant: 'default',
                size: 'default',
                className: 'h-[52px] w-full justify-start !rounded-md',
                onClick: () => {
                  setOpen(false);
                },
              }}
            />
          ) : null}
        </Flex>
      </Flex>
      {/* <Box className="absolute w-full h-full bg-foreground/50 top-0" /> */}
    </form>
  );
};
function postTransactionCacheClear() {
  throw new Error('Function not implemented.');
}
