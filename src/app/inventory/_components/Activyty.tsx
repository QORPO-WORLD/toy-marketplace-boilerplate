'use client';

import { useFetchActivity } from '../../../hooks/utils/useActivity';
import { TokenBalance, TokenMetadata } from '@0xsequence/indexer';
import { useTokenMetadata } from '@0xsequence/kit';
import { MarketplaceKind } from '@0xsequence/marketplace-sdk';
import {
  useCollection,
  useListBalances,
  useCancelOrder,
  useListListingsForCollectible,
} from '@0xsequence/marketplace-sdk/react';
import { useAccount } from 'wagmi';

interface ActivityWrapperProps {
  filteredCollecionBalances: TokenBalance[];
}

function ActivityWrapper({ filteredCollecionBalances }: ActivityWrapperProps) {
  if (!filteredCollecionBalances.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-white">No listing found</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-white">
        <thead>
          <tr className="">
            <th className="p-2 font-semibold font-DMSans text-base">Item</th>
            <th className=" p-2 font-semibold font-DMSans text-base">Price</th>
            <th className="p-2 font-semibold font-DMSans text-base">
              Quantity
            </th>
            <th className="p-2 font-semibold font-DMSans text-base">Expires</th>
            <th className=" p-2 font-semibold font-DMSans text-base">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredCollecionBalances.map((c: TokenBalance) => (
            <Activity key={c.contractAddress} {...c} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Activity({ chainId, accountAddress, contractAddress }: TokenBalance) {
  const { data: collectionBalances } = useListBalances({
    chainId,
    accountAddress,
    contractAddress,
  });

  const tokenIDs = collectionBalances
    ? collectionBalances.pages
        .map((page) => page.balances)
        .flatMap((balance) => balance.map((b) => b.tokenID))
        .filter((id) => id !== undefined)
    : [];

  const { data: activityData } = useFetchActivity({
    collectionAddress: contractAddress,
    currencyAddresses: [],
    orderbookContractAddress: '0xB537a160472183f2150d42EB1c3DD6684A55f74c',
    userAddress: accountAddress,
    tokenIDs,
  });

  const { data: tokensMetadata } = useTokenMetadata(
    chainId,
    contractAddress,
    tokenIDs,
  );

  function formatExpiry(timestamp: string): string {
    const now = new Date();
    const expiryDate = new Date(Number(timestamp) * 1000);
    const timeDiff = expiryDate.getTime() - now.getTime();
    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (daysLeft > 0) {
      return `in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
    } else if (hoursLeft > 0) {
      return `in ${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}`;
    } else {
      return 'Expired';
    }
  }

  return (
    <>
      {/* {activityData?.orders.length &&
        activityData.orders.map((order) => (
          <tr
            className="font-DMSans border-t border-[#FFFFFF3A]"
            key={order.tokenId}
          >
            <td className="p-6 flex items-center gap-4">
              <p>{order.isListing ? 'LISTING' : ''}</p>
              <AssetCard
                collectionName={collectionMetadata?.name}
                tokenMetadata={
                  tokensMetadata?.find(
                    (token) => token.tokenId === order.tokenId,
                  ) as TokenMetadata
                }
              />
            </td>
            <td className=" p-6 text-center font-DMSans">
              {order.pricePerToken}
            </td>
            <td className="p-6 text-center">{order.quantity}</td>
            <td className=" p-6 text-center">{formatExpiry(order.expiry)}</td>
            <td className=" p-6 text-center">{order.orderStatus}</td>
            <td className=" p-6 text-center">
              <CancelListing
                orderId={order.orderId}
                chainId={chainId}
                collectionAddress={contractAddress}
                tokenId={order.tokenId}
              />
            </td>
          </tr>
        ))} */}
      {tokensMetadata?.length &&
        tokensMetadata.map((asset) => (
          <AssetList
            key={asset.name}
            tokenId={asset.tokenId}
            chainId={chainId}
            contractAddress={contractAddress}
          />
        ))}
    </>
  );
}

export default ActivityWrapper;

function AssetList({
  tokenId,
  chainId,
  contractAddress,
}: {
  tokenId: string;
  chainId: number;
  contractAddress: string;
}) {
  const { address } = useAccount();
  const { data: listings } = useListListingsForCollectible({
    chainId: chainId + '',
    collectionAddress: contractAddress,
    collectibleId: tokenId,
    filter: {
      createdBy: [address + ''],
    },
  });
  const { data: collectionMetadata } = useCollection({
    chainId,
    collectionAddress: `0x${contractAddress.replace(/^0x/, '')}`,
  });

  const { data: tokensMetadata } = useTokenMetadata(chainId, contractAddress, [
    tokenId,
  ]);

  console.log(listings);
  return (
    <>
      {listings?.listings.map((order) => (
        <tr
          className="font-DMSans border-t border-[#FFFFFF3A]"
          key={order.tokenId}
        >
          <td className="p-6 flex items-center gap-4">
            <p>{order.status}</p>
            <AssetCard
              collectionName={collectionMetadata?.name}
              tokenMetadata={
                tokensMetadata?.find(
                  (token) => token.tokenId === order.tokenId,
                ) as TokenMetadata
              }
            />
          </td>
          <td className=" p-6 text-center font-DMSans">
            {order.priceAmountNetFormatted}
          </td>
          <td className="p-6 text-center">{order.quantityAvailable}</td>
          <td className=" p-6 text-center">{order.validUntil}</td>
          <td className=" p-6 text-center">{order.status}</td>
          <td className=" p-6 text-center">
            <CancelListing
              orderId={order.orderId}
              chainId={chainId}
              collectionAddress={contractAddress}
              tokenId={order.tokenId}
              marketPlace={order.marketplace}
            />
          </td>
        </tr>
      ))}
    </>
  );
}

function AssetCard({
  tokenMetadata,
  collectionName,
}: {
  tokenMetadata: TokenMetadata;
  collectionName: string | undefined;
}) {
  return (
    <div className="flex items-center gap-4 mx-auto w-72">
      {tokenMetadata?.image && (
        <div className="p-1 px-4 bg-[#FFFFFF1A] rounded-md border border-white shrink-0">
          <img
            className="w-20 h-20"
            src={tokenMetadata?.image}
            width={40}
            height={40}
            alt={tokenMetadata?.name}
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        {collectionName && (
          <p className="font-main text-lg">{collectionName}</p>
        )}
        {tokenMetadata?.name && <p>{tokenMetadata.name}</p>}
      </div>
    </div>
  );
}

const CancelListing = ({
  orderId,
  chainId,
  collectionAddress,
  marketPlace,
}: {
  orderId: string;
  chainId: number;
  collectionAddress: string;
  tokenId: string;
  marketPlace: MarketplaceKind;
}) => {
  const { cancelOrder, isExecuting } = useCancelOrder({
    collectionAddress,
    chainId: chainId + '',
  });

  // const marketplace = listings?.pages[0].listings[0].marketplace;

  return (
    <button
      className="py-2 px-4 rounded-[2.3rem] bg-main-gradient hover:opacity-80"
      onClick={() => cancelOrder({ orderId, marketplace: marketPlace })}
    >
      {isExecuting ? 'Pending' : 'Cancel'}
    </button>
  );
};
