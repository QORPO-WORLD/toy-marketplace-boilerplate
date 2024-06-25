import { getIndexerClient, getMetadataClient } from './clients';
import type { GetTokenBalancesArgs } from '@0xsequence/indexer';
import {
  type TokenCollectionFiltersArgs,
  type GetTokenMetadataArgs,
} from '@0xsequence/metadata';
import { group } from 'radash';

export type CollectionArgs = {
  collectionId: string;
  chainID: string;
};

export type BatchCollectionArgs = CollectionArgs[];

export const fetchCollectionsMetadata = (args: BatchCollectionArgs) => {
  // Group the arguments by chainID for batch processing
  const groupedArgs = group(args, (arg) => arg.chainID);
  const entries = Object.entries(groupedArgs);

  return Promise.all(
    entries
      .map(([chainID, collections]) => {
        const metadata = getMetadataClient(chainID);
        const contractAddresses = collections!.map((c) => c.collectionId);

        return metadata.getContractInfoBatch({
          chainID,
          contractAddresses,
        });
      })
      .map(async (resp) => {
        const result = await resp;
        return result.contractInfoMap;
      }),
  );
};

export const fetchCollectionMetadata = (args: CollectionArgs) => {
  const metadata = getMetadataClient(args.chainID);

  return metadata
    .getContractInfo({
      chainID: args.chainID,
      contractAddress: args.collectionId,
    })
    .then((resp) => resp.contractInfo);
};

export const fetchTokenMetadata = (args: GetTokenMetadataArgs) => {
  const metadata = getMetadataClient(args.chainID);

  return metadata.getTokenMetadata(args).then((resp) => resp.tokenMetadata[0]);
};

export const fetchCollectionFilters = (args: TokenCollectionFiltersArgs) => {
  const metadata = getMetadataClient(args.chainID);

  return metadata.tokenCollectionFilters(args).then((resp) => resp.filters);
};

export type TokenBalancesArgs = {
  chainId: number;
  accountAddress: string;
  contractAddress?: string;
  includeMetadata?: boolean;
  page?: GetTokenBalancesArgs['page'];
};

export const fetchTokenBalances = ({
  chainId,
  accountAddress,
  contractAddress,
  includeMetadata = true,
  page,
}: TokenBalancesArgs) => {
  const indexer = getIndexerClient(chainId);
  const includeContracts = [];
  if (contractAddress) {
    includeContracts.push(contractAddress);
  }

  return indexer.getTokenBalances({
    accountAddress,
    contractAddress,
    includeMetadata,
    metadataOptions: {
      verifiedOnly: true,
      includeContracts,
    },
    page,
  });
};
