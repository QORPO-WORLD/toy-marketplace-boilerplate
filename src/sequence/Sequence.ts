import { env } from '~/env';

import { SequenceWaaS } from '@0xsequence/waas';

const sequence = new SequenceWaaS({
  network: 'mainnet',
  projectAccessKey: env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY,
  waasConfigKey: env.NEXT_PUBLIC_WAAS_CONFIG_KEY || '',
});

export default sequence;
