'use client';

import { Accordion } from '~/components/ui';

import { CollectibleAccordionItem } from '../_components/AccordionItem';
import CollectibleAddresses from '../_components/Addresses';
import { CollectibleDescription } from '../_components/Description';
import { useCollectableData } from '../_hooks/useCollectableData';
import { CollectibleImage } from './_components/Image';
import { CollectibleProperties } from './_components/Properties';

export default function Page() {
  const { collectibleMetadata, collectionId, chainId } = useCollectableData();
  return (
    <>
      {/* <CollectibleImage
        id={collectibleMetadata.data?.tokenId}
        src={collectibleMetadata.data?.image}
        loading={collectibleMetadata.isLoading}
        animationSrc={collectibleMetadata.data?.animation_url}
      />

      <Accordion.Root
        type="multiple"
        defaultValue={[
          'description',
          'properties',
          'details',
          'market-data',
          'transaction-history',
          'actions',
        ]}
      >
        <CollectibleAccordionItem id="description" label="Description">
          {collectibleMetadata.data?.description ? (
            <CollectibleDescription
              description={collectibleMetadata.data?.description}
              loading={collectibleMetadata.isLoading}
            />
          ) : null}
          <CollectibleProperties
            properties={collectibleMetadata.data?.properties}
            attributes={collectibleMetadata.data?.attributes}
          />
        </CollectibleAccordionItem>

        <CollectibleAccordionItem id="details" label="Details">
          <CollectibleAddresses
            contractAddress={collectionId}
            chainId={chainId}
          />
        </CollectibleAccordionItem>
      </Accordion.Root> */}
      <div className="pt-[11.0625rem] px-4 flex items-center justify-center">
        <div className="flex flex-col gap-[1.625rem] shrink-55">
          <CollectibleImage
            id={collectibleMetadata.data?.tokenId}
            src={collectibleMetadata.data?.image}
            loading={collectibleMetadata.isLoading}
            animationSrc={collectibleMetadata.data?.animation_url}
          />
          <p className="text-white font-DMSans text-[16px] font-semibold leading-[207%]">
            {collectibleMetadata.data?.description}
          </p>
        </div>
        <div className="shrink-0 ">
          <div></div>
        </div>
      </div>
    </>
  );
}

export const runtime = 'edge';
