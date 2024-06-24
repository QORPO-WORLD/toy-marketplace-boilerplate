'use client';

import { InfoGrid } from '~/components/InfoGrid';
import { formatAttributes, formatProperties } from '~/utils/utils';

import { Box } from '$ui';
import type { TokenMetadata } from '@0xsequence/metadata';

interface CollectiblePropertiesProps {
  properties?: TokenMetadata['properties'];
  attributes?: TokenMetadata['attributes'];
}

export const CollectibleProperties = ({
  properties,
  attributes,
}: CollectiblePropertiesProps) => {
  const collectibleProperties = formatProperties(properties);
  const collectibleAttributes = formatAttributes(attributes);

  return (
    <Box className="@container/collectibleProperties">
      <InfoGrid
        className="grid-cols-2 @xl/collectibleProperties:grid-cols-3"
        values={[...collectibleProperties, ...collectibleAttributes].map(
          (cp) => ({
            label: cp.name,
            value: cp.value,
          }),
        )}
      />
    </Box>
  );
};
