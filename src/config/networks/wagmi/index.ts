import { DEFAULT_NETWORK } from '~/config/consts';
import { type MarketConfig } from '~/config/marketplace';
import { env } from '~/env';

import { cookieStorage } from './wagmiCookieStorage';
import {
  type Wallet,
  getKitConnectWallets,
  sequence as sequenceWallet,
  coinbaseWallet,
  walletConnect,
  email,
  google,
  facebook,
  apple,
  twitch,
  type SequenceOptions,
  emailWaas,
  appleWaas,
  googleWaas,
  getDefaultChains,
} from '@0xsequence/kit';
import { findNetworkConfig, allNetworks } from '@0xsequence/network';
import type { Chain, Transport } from 'viem';
import { createConfig, type CreateConnectorFn, http } from 'wagmi';

const projectAccessKey = env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY;
const walletConnectProjectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const waasConfigKey = env.NEXT_PUBLIC_WAAS_CONFIG_KEY;
const walletType = waasConfigKey ? 'waas' : 'universal';

const defaultNetwork = DEFAULT_NETWORK;

export const createWagmiConfig = (marketConfig: MarketConfig) => {
  const chains = getChainConfigs(marketConfig);
  const transports = getTransportConfigs(chains);
  let connectors;
  if (walletType === 'universal') {
    const sequenceWalletOptions = {
      defaultNetwork,
      connect: {
        projectAccessKey,
        app: marketConfig.title,
        settings: {
          bannerUrl: marketConfig.ogImage,
        },
      },
    };

    const wallets = getWalletConfigs(marketConfig, sequenceWalletOptions);
    const socialWallets = getSocialWalletConfigs(sequenceWalletOptions);
    connectors = getKitConnectWallets(projectAccessKey, [
      ...socialWallets,
      ...wallets,
    ]);
  } else if (walletType === 'waas' && waasConfigKey) {
    connectors = getWaasConnectors({
      appName: marketConfig.title,
      waasConfigKey,
    });
  }

  return createConfig({
    connectors,
    chains,
    ssr: true,
    storage: cookieStorage,
    transports,
    multiInjectedProviderDiscovery:
      marketConfig?.walletOptions?.includes('metamask') ?? false,
  });
};

function getChainConfigs(marketConfig: MarketConfig): [Chain, ...Chain[]] {
  const supportedChainIds = new Set(
    marketConfig.collections.map((c) => c.chainId),
  );
  return getDefaultChains([...supportedChainIds]);
}

function getTransportConfigs(
  chains: [Chain, ...Chain[]],
): Record<number, Transport> {
  return chains.reduce(
    (acc, chain) => {
      const network = findNetworkConfig(allNetworks, chain.id);
      if (network) acc[chain.id] = http(network.rpcUrl);
      return acc;
    },
    {} as Record<number, Transport>,
  );
}

function getWalletConfigs(
  marketConfig: MarketConfig,
  sequenceWalletOptions: SequenceOptions,
): Wallet[] {
  const walletObject = {
    sequence: sequenceWallet(sequenceWalletOptions),
    ...(walletConnectProjectId
      ? { walletconnect: walletConnect({ projectId: walletConnectProjectId }) }
      : {}),
    coinbase: coinbaseWallet({ appName: marketConfig.title }),
  } as const;

  const supportedWallets = marketConfig.walletOptions || [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return supportedWallets.length
    ? // @ts-expect-error -- Missing support for Ledger
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      supportedWallets.map((key) => walletObject[key]).filter(Boolean)
    : Object.values(walletObject);
}

function getSocialWalletConfigs(
  sequenceWalletOptions: SequenceOptions,
): Wallet[] {
  return [
    email(sequenceWalletOptions),
    facebook(sequenceWalletOptions),
    google(sequenceWalletOptions),
    apple(sequenceWalletOptions),
    twitch(sequenceWalletOptions),
  ] as const;
}

interface GetWaasConnectors {
  appName: string;
  waasConfigKey: string;
}

const googleClientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const appleClientId = env.NEXT_PUBLIC_APPLE_CLIENT_ID;

function getWaasConnectors({
  appName,
  waasConfigKey,
}: GetWaasConnectors): CreateConnectorFn[] {
  const wallets: Wallet[] = [
    emailWaas({
      projectAccessKey,
      waasConfigKey,
      network: defaultNetwork,
    }),

    coinbaseWallet({
      appName,
    }),
  ];

  if (walletConnectProjectId) {
    walletConnect({
      projectId: walletConnectProjectId,
    });
  }

  if (googleClientId) {
    wallets.push(
      googleWaas({
        projectAccessKey,
        googleClientId,
        waasConfigKey,
        network: defaultNetwork,
      }),
    );
  }

  // if (appleClientId) {
  //   wallets.push(
  //     appleWaas({
  //       projectAccessKey,
  //       appleClientId,
  //       appleRedirectURI: 'https://sequence.app', // TODO: Update this
  //       waasConfigKey,
  //       network: defaultNetwork,
  //     })
  // )
  // }

  return getKitConnectWallets(projectAccessKey, wallets);
}
