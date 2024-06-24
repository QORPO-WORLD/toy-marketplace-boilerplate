// "use client";

// import { useQueryClient } from "@tanstack/react-query";
// import * as ethers from "ethers";
// import React, { useState } from "react";
// import {
//   Button,
//   toast,
//   Flex,
//   Input,
//   Switch,
//   Text,
//   TransferIcon,
//   Label,
//   SendPlaneIcon,
// } from "system";
// import { snapshot, useSnapshot } from "valtio";
// import type { Hex } from "viem";
// import { isAddress } from "viem";
// import { useAccount, useWalletClient } from "wagmi";

// import type { GetCollectionMetadataResponse } from "~/api";
// import { getNetworkConfigAndClients } from "~/api";
// import { OrderItemType } from "~/api/types/order";
// import { formatDecimals } from "~/api/utils";
// import { NetworkSwitchButton } from "~/app/_components/NetworkSwitchButton";
// import {
//   ammKeys,
//   balancesKeys,
//   metadataKeys,
//   miscKeys,
//   orderbookKeys,
//   useCollectionMetadata,
//   useExchange,
// } from "~/hooks/data";
// import { useERC20Approval } from "~/hooks/transactions/useERC20Approval";
// import { useIsMinWidth } from "~/hooks/ui/useIsMinWidth";
// import { useNetworkSwitch } from "~/hooks/utils/useNetworkSwitch";
// import { SendModal } from "~/modules/Modals/SendModal";
// import { ERC1155_ABI } from "~/sdk/shared/abi/token/ERC1155";
// import { ERC721_ABI } from "~/sdk/shared/abi/token/ERC721";
// import { getOrderDeadlineMinutes } from "~/sdk/shared/utils";
// import {
//   resetCart,
//   cartState,
//   settingsState,
//   toggleCart,
// } from "~/stores";
// import {
//   onTransactionFinish,
//   setTransactionPendingState,
// } from "~/stores/Transaction";
// import { compareAddress } from "~/utils/address";

// import { transactionNotification } from "../../../Notifications/transactionNotification";

// import { ConnectButton } from "~/modules/ConnectButton";
// import { ERC20 } from "~/sdk/shared/clients/ERC20";

// interface OrderButtonsProps {
//   erc20Amount?: bigint;
//   platformFee?: bigint;
//   frontEndFeeRecipient?: string;
//   isLoading: boolean;
// }

// export const OrderButtons = ({
//   erc20Amount,
//   platformFee,
//   frontEndFeeRecipient,
//   isLoading,
// }: OrderButtonsProps) => {
//   const queryClient = useQueryClient();
//   const {
//     baseOrderInfo: {
//       chainId,
//       exchangeAddress,
//       orderType: cartType,
//       collectionAddress,
//     },
//     orderData,
//     cartItems,
//   } = useSnapshot(cartState);
//   const isDesktop = useIsMinWidth("@xl");

//   const { data: exchangeResp } = useExchange({
//     chainId,
//     exchangeAddress,
//   });

//   const exchange = exchangeResp?.data;

//   const { address: userAddress, isConnected } = useAccount();
//   const { data: walletClient } = useWalletClient();

//   const [sendToAnotherAddress, setSendToAnotherAddress] = useState(false);
//   const [isSendModalOpen, setIsSendModalOpen] = useState(false);
//   const [isNftCheckout, setIsNftCheckout] = useState(false);
//   const [nftCheckoutLoading, setNftCheckoutLoading] = useState(false);

//   const { networkMismatch, targetChainId } = useNetworkSwitch({
//     targetChainId: chainId,
//   });

//   const erc20CheckEnabled =
//     !!erc20Amount &&
//     (cartType === OrderItemType.BUY_AMM || cartType === OrderItemType.DEPOSIT);

//   const {
//     data: erc20Checks,
//     isLoading: isErc20ChecksLoading,
//     refetch: recheckApprovals,
//   } = useERC20Approval({
//     spenderAddress: exchange?.exchangeAddress,
//     erc20Address: exchange?.currency.id,
//     userAddress: userAddress,
//     targetAmount: erc20Amount,
//     chainId: exchange?.chainId,
//     disabled: !erc20CheckEnabled,
//   });

//   const { transactionDeadlineMins, slippageTolerancePercent } =
//     useSnapshot(settingsState);

//   if (!cartItems.length || !chainId) {
//     return null;
//   }

//   const network = getNetworkConfigAndClients(chainId).networkConfig;

//   const postTransactionCacheClear = () => {
//     queryClient.invalidateQueries({ queryKey: [...ammKeys.all()] });
//     queryClient.invalidateQueries({ queryKey: [...orderbookKeys.all()] });
//     queryClient.invalidateQueries({ queryKey: [...balancesKeys.all()] });
//     queryClient.invalidateQueries({ queryKey: [...metadataKeys.all()] });
//     queryClient.invalidateQueries({ queryKey: [...miscKeys.all()] });
//   };

// }

//   if (!isConnected) {
//     return (
//       <ConnectButton
//         variant="default"
//         className="w-full"
//         onClick={() => {
//           if (!isDesktop) {
//             toggleCart();
//           }
//         }}
//       />
//     );
//   }

//     const buyWithCCOnClick = sendToAnotherAddress
//       ? () => {
//           setIsNftCheckout(true);
//           setIsSendModalOpen(true);
//         }
//       : () => {
//           redirectToNFTCheckout(userAddress || "");
//         };

//     switch (cartType) {
//       case OrderItemType.BUY_AMM:
//         return (
//           <>
//             <Button
//               className="w-full"
//               label={`Buy With Credit Card ${
//                 sendToAnotherAddress ? "& Send" : ""
//               }`}
//               onClick={buyWithCCOnClick}
//               disabled={nftCheckoutLoading}
//               loading={nftCheckoutLoading}
//             />
//             <Text className="text-center">OR</Text>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   if ((erc20CheckEnabled && isErc20ChecksLoading) || isLoading || !orderData) {
//     return <Button className="w-full" label="estimating" disabled />;
//   }

//   if (erc20Checks?.isUserInsufficientBalance) {
//     return (
//       <>
//         <Button className="w-full" label="Insufficient Balance" disabled />
//       </>
//     );
//   }

//   const renderApprovalButton = () => {
//     const onApprove = async () => {
//       if (!exchange || !walletClient) return;
//       setTransactionPendingState(true);
//       try {
//         const txnHash = await ERC20.approveInfinite(
//           exchange.currency.id,
//           exchange.exchangeAddress,
//           walletClient,
//         );

//         await transactionNotification({
//           network: getNetworkConfigAndClients(exchange.chainId).networkConfig,
//           txHash: txnHash,
//         });

//         await recheckApprovals();
//       } catch (error) {
//         console.error(error);
//         toast.error("Error approving token");
//       } finally {
//         setTransactionPendingState(false);
//       }
//     };

//     if (erc20Checks?.isRequiresAllowanceApproval) {
//       return (
//         <Button
//           className="w-full"
//           label={`Approve ${exchange?.currency.symbol}`}
//           variant="secondary"
//           onClick={onApprove}
//         />
//       );
//     }
//   };

//   const buyAction = async (recipientAddress: string) => {
//     if (!walletClient || !niftyswap || !orderData || !exchange) return;

//     setTransactionPendingState(true);

//     try {
//       const txnHash = await niftyswap.buyTokens({
//         signer: walletClient,
//         tokenIds: orderData.tokenIds,
//         amounts: orderData.tokenAmounts.map(BigInt),
//         maxCurrency: BigInt(erc20Amount?.toString() || 0n),
//         orderDeadline: BigInt(getOrderDeadlineMinutes(transactionDeadlineMins)),
//         recipientAddress: recipientAddress as string,
//         extraFeeAmount: BigInt(platformFee?.toString() || 0n),
//         extraFeeRecipient: frontEndFeeRecipient || ethers.constants.AddressZero,
//       });

//       await transactionNotification({
//         network: getNetworkConfigAndClients(exchange.chainId).networkConfig,
//         txHash: txnHash,
//         onSuccess: () => {
//           cartItems.forEach((cartItem) => {
//             analytics()?.trackBuyItems({
//               props: {
//                 txnHash,
//                 chainId: String(exchange.chainId),
//                 marketplaceType: "amm",
//                 collectionAddress: exchange.collection.id.toLowerCase(),
//                 currencyAddress: exchange.currency.id.toLowerCase(),
//                 currencySymbol: exchange.currency.symbol.toUpperCase(),
//                 tokenId: cartItem.collectibleMetadata.tokenId,
//               },
//               nums: {
//                 currencyValueDecimal: Number(
//                   formatDecimals(
//                     cartItem.subtotal || 0,
//                     exchange.currency.decimals || 0,
//                   ),
//                 ),
//                 currencyValueRaw: Number(cartItem.subtotal || 0),
//               },
//             });
//           });
//         },
//       });

//       postTransactionCacheClear();

//       onTransactionFinish({
//         transactionId: txnHash,
//         cartItems: snapshot(cartState.cartItems),
//         cartType: cartType,
//       });

//       resetCart();
//     } catch (error: any) {
//       const errorMessage =
//         error instanceof Error ? error.message : "unknown error";
//       analytics()?.trackTransactionFailed({
//         chainId: String(exchange.chainId),
//         txnHash: "",
//         description: "amm - buy",
//         errorMessage,
//       });
//       showErrorToast(error);
//     }

//     setTransactionPendingState(false);
//   };

//   const sellAction = async () => {
//     if (!walletClient || !niftyswap || !orderData || !exchange) return;

//     setTransactionPendingState(true);
//     try {
//       const assetContractAddress = await niftyswap.getAssetContractAddress();

//       const txnHash = await niftyswap.sellTokens({
//         signer: walletClient,
//         tokenIds: orderData.tokenIds,
//         amounts: orderData.tokenAmounts.map(BigInt),
//         minCurrency: BigInt(erc20Amount?.toString() || 0),
//         orderDeadline: getOrderDeadlineMinutes(transactionDeadlineMins),
//         userAddress: userAddress as string,
//         assetContractAddress: assetContractAddress,
//         extraFeeAmount: BigInt(platformFee?.toString() || 0n),
//         extraFeeRecipient: frontEndFeeRecipient || ethers.constants.AddressZero,
//       });

//       await transactionNotification({
//         network: getNetworkConfigAndClients(exchange.chainId).networkConfig,
//         txHash: txnHash,
//         onSuccess: () => {
//           cartItems.forEach((cartItem) => {
//             analytics()?.trackSellItems({
//               props: {
//                 txnHash,
//                 chainId: String(exchange.chainId),
//                 marketplaceType: "amm",
//                 collectionAddress: exchange.collection.id.toLowerCase(),
//                 currencyAddress: exchange.currency.id.toLowerCase(),
//                 currencySymbol: exchange.currency.symbol.toUpperCase(),
//                 tokenId: cartItem.collectibleMetadata.tokenId,
//               },
//               nums: {
//                 currencyValueDecimal: Number(
//                   formatDecimals(
//                     cartItem.subtotal || 0,
//                     exchange.currency.decimals || 0,
//                   ),
//                 ),
//                 currencyValueRaw: Number(cartItem.subtotal || 0),
//               },
//             });
//           });
//         },
//       });

//       postTransactionCacheClear();

//       onTransactionFinish({
//         transactionId: txnHash,
//         cartItems: snapshot(cartState.cartItems),
//         cartType: cartType,
//       });

//       resetCart();
//     } catch (error: any) {
//       const errorMessage =
//         error instanceof Error ? error.message : "unknown error";
//       analytics()?.trackTransactionFailed({
//         chainId: String(exchange.chainId),
//         txnHash: "",
//         description: "amm - sell",
//         errorMessage,
//       });
//       showErrorToast(error);
//     }
//     setTransactionPendingState(false);
//   };

//   const depositAction = async () => {
//     if (!walletClient || !niftyswap || !orderData || !exchange) return;

//     setTransactionPendingState(true);
//     try {
//       const assetContractAddress = await niftyswap.getAssetContractAddress();

//       const txnHash = await niftyswap.addLiquidity({
//         signer: walletClient,
//         tokenIDsToAdd: orderData.tokenIds.map(BigInt),
//         tokenAmountsToAdd: orderData.tokenAmounts.map(BigInt),
//         currencyAmountsToAdd: orderData.subtotals.map((subtotal) =>
//           BigInt(subtotal),
//         ),
//         orderDeadline: getOrderDeadlineMinutes(transactionDeadlineMins),
//         userAddress: userAddress as string,
//         assetContractAddress: assetContractAddress,
//       });

//       postTransactionCacheClear();

//       await transactionNotification({
//         network: getNetworkConfigAndClients(exchange.chainId).networkConfig,
//         txHash: txnHash,
//       });

//       postTransactionCacheClear();

//       onTransactionFinish({
//         transactionId: txnHash,
//         cartItems: snapshot(cartState.cartItems),
//         cartType: cartType,
//       });

//       resetCart();
//     } catch (error: any) {
//       showErrorToast(error);
//     }
//     setTransactionPendingState(false);
//   };

//   const withdrawAction = async () => {
//     if (!walletClient || !niftyswap || !orderData || !exchange || !userAddress)
//       return;

//     setTransactionPendingState(true);
//     try {
//       const txData = await niftyswap.getWithdrawLiquidityTxnData(
//         userAddress,
//         exchange.collection.id,
//         exchange.lpFeePercentage,
//         cartItems.map((c) => ({
//           tokenId: c.collectibleMetadata.tokenId,
//           lpTokenAmount: c.quantity,
//         })),
//         slippageTolerancePercent,
//       );

//       const txnHash = await niftyswap.withdrawLiquidity({
//         signer: walletClient,
//         tokenIDsToRemove: txData.tokenIds,
//         tokenAmountsToRemove: txData.tokenAmounts,
//         currencyAmountsToRemove: txData.currencyAmounts,
//         poolTokenAmountsToRemove: txData.lpTokenAmounts,
//         orderDeadline: getOrderDeadlineMinutes(transactionDeadlineMins),
//         userAddress: userAddress as string,
//       });

//       if (!txnHash) {
//         throw new Error("Unable to create a transaction!");
//       }

//       postTransactionCacheClear();

//       await transactionNotification({
//         network: getNetworkConfigAndClients(exchange.chainId).networkConfig,
//         txHash: txnHash,
//       });

//       postTransactionCacheClear();

//       onTransactionFinish({
//         transactionId: txnHash,
//         cartItems: snapshot(cartState.cartItems),
//         cartType: cartType,
//       });

//       resetCart();
//     } catch (error: any) {
//       showErrorToast(error);
//     }
//     setTransactionPendingState(false);
//   };

//   const transferAction = async (
//     targetAddress: string,
//     collectionMetadata?: GetCollectionMetadataResponse,
//   ) => {
//     if (!walletClient || !orderData || !userAddress) return;

//     setTransactionPendingState(true);
//     try {
//       if (!collectionMetadata) {
//         throw new Error("Missing collection metadata");
//       }

//       const transferItem = cartItems[0];
//       const collectionAddress =
//         transferItem.collectibleMetadata.collectionAddress;
//       const chainId = transferItem.collectibleMetadata.chainId;

//       const contractType = collectionMetadata?.data?.contractInfo.type;

//       let txnHash: string;

//       if (contractType === "ERC721") {
//         if (orderData.tokenIds.length !== 1) {
//           throw new Error(
//             "Can not transfer more than 1 ERC721 token at a time",
//           );
//         }

//         txnHash = await walletClient.writeContract({
//           address: collectionAddress as Hex,
//           abi: ERC721_ABI,
//           functionName: "safeTransferFrom",
//           args: [
//             userAddress,
//             targetAddress as Hex,
//             BigInt(orderData.tokenIds[0]),
//           ],
//         });
//       } else if (contractType === "ERC1155") {
//         txnHash = await walletClient.writeContract({
//           address: collectionAddress as Hex,
//           abi: ERC1155_ABI,
//           functionName: "safeBatchTransferFrom",
//           args: [
//             userAddress,
//             targetAddress as Hex,
//             orderData.tokenIds.map(BigInt),
//             orderData.tokenAmounts.map(BigInt),
//             "0x0",
//           ],
//         });
//       } else {
//         throw new Error("Unsupported collectible type");
//       }

//       onTransactionFinish({
//         transactionId: txnHash,
//         cartItems: snapshot(cartState.cartItems),
//         cartType: cartType,
//       });

//       resetCart();

//       postTransactionCacheClear();

//       await transactionNotification({
//         network: getNetworkConfigAndClients(chainId).networkConfig,
//         txHash: txnHash,
//       });
//       postTransactionCacheClear();
//     } catch (error: any) {
//       showErrorToast(error);
//     }
//     setTransactionPendingState(false);
//   };

//   const TranferButton = () => {
//     const { data: collectionMetadata, isLoading } = useCollectionMetadata({
//       chainID: String(chainId),
//       contractAddress: String(collectionAddress),
//     });

//     const [address, setAddress] = useState("");

//     const isDisabled = !isAddress(address);

//     return (
//       <>
//         <Text className="text-sm">Wallet Address</Text>
//         <Input.Base
//           id="transfer-address-input"
//           value={address}
//           placeholder="0x..."
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//             setAddress(e.target.value)
//           }
//           className="w-full"
//         />
//         <Button
//           className="w-full"
//           loading={isLoading}
//           onClick={() => transferAction(address, collectionMetadata)}
//           disabled={isDisabled}
//           variant="pink"
//         >
//           <TransferIcon />
//           {cartType}
//         </Button>
//       </>
//     );
//   };

//   const renderOrderButton = () => {
//     const requiresApproval = erc20Checks
//       ? erc20Checks.isRequiresAllowanceApproval
//       : false;

//     const buyOnClick = sendToAnotherAddress
//       ? () => {
//           setIsNftCheckout(false);
//           setIsSendModalOpen(true);
//         }
//       : () => {
//           buyAction(userAddress as string);
//         };

//     switch (cartType) {
//       case OrderItemType.BUY_AMM:
//         return (
//           <Button
//             className="w-full"
//             label={`BUY ${sendToAnotherAddress ? "& Send" : ""}`}
//             onClick={buyOnClick}
//             disabled={requiresApproval}
//           />
//         );
//       case OrderItemType.SELL_AMM:
//         return <Button className="w-full" label="SELL" onClick={sellAction} />;
//       case OrderItemType.DEPOSIT:
//         return (
//           <Button
//             className="w-full"
//             label={cartType}
//             onClick={depositAction}
//             disabled={requiresApproval}
//           />
//         );
//       case OrderItemType.WITHDRAW:
//         return (
//           <Button
//             className="w-full"
//             label={cartType}
//             onClick={withdrawAction}
//             disabled={requiresApproval}
//           />
//         );
//       case OrderItemType.TRANSFER:
//         return <TranferButton />;
//       default:
//         break;
//     }
//   };

//   const renderSendToggle = () => {
//     if (cartType !== OrderItemType.BUY_AMM) return null;

//     return (
//       <Flex className="items-center gap-2">
//         <Switch.Base
//           id="send-to-another-address"
//           checked={sendToAnotherAddress}
//           onCheckedChange={setSendToAnotherAddress}
//         />

//         <Label
//           htmlFor="send-to-another-address"
//           className="flex items-center gap-2"
//         >
//           Send to another address
//           <SendPlaneIcon />
//         </Label>
//       </Flex>
//     );
//   };

//   const renderSendModal = () => {
//     const callBackAction = (address: string) => {
//       if (isNftCheckout) {
//         redirectToNFTCheckout(address);
//       } else {
//         buyAction(address);
//       }
//       setIsSendModalOpen(false);
//     };

//     return (
//       <SendModal
//         isOpen={isSendModalOpen}
//         setIsOpen={setIsSendModalOpen}
//         callBackAction={callBackAction}
//       />
//     );
//   };

//   if (networkMismatch) {
//     return <NetworkSwitchButton targetChainId={targetChainId} />;
//   }

//   return (
//     <>
//       {renderApprovalButton()}
//       {renderOrderButton()}
//       {renderSendToggle()}
//       {renderSendModal()}
//     </>
//   );
// };

// const showErrorToast = (error: any) => {
//   // https://github.com/MetaMask/rpc-errors/blob/main/src/error-constants.ts
//   console.log("TRANSACTION ERROR CODE:", error?.code, error);

//   switch (error?.code) {
//     case "ACTION_REJECTED":
//     case 4001: {
//       toast.error("User has rejected the Transaction!");
//       break;
//     }
//     case -32003: {
//       toast.error("User has rejected the transaction!");
//       break;
//     }
//     default: {
//       toast.error(error?.message?.substring(0, 100));
//     }
//   }
// };
