import {
  type BaseError,
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt
} from 'wagmi'
import { Button } from "~/components/ui/Button/button";
import { useMutation } from '@tanstack/react-query';
import { getMarketplaceClient } from '~/lib/queries/clients';
import { type BuyCollectibleOrder, type MarketplaceKind } from '~/lib/queries/marketplace/marketplace.gen';
import { type Hex } from 'viem';

interface BuyWithCryptoProps {
  marketplace: MarketplaceKind
  collectionAddress: string
  collectibles: Array<BuyCollectibleOrder>
}

export function BuyWithCrypto({ marketplace, collectionAddress, collectibles }: BuyWithCryptoProps) {
  const {
    data: hash,
    error,
    isPending,
    sendTransaction
  } = useSendTransaction()

  const { chainId, address } = useAccount()

  const mutation = useMutation({
    mutationFn: () => {
      const marketplaceClient = getMarketplaceClient(chainId!)
      return marketplaceClient.buyCollectibles({
        contractAddress: collectionAddress,
        buyer: address!,
        marketplace,
        collectibles,
        fees: []
      })
    }
  })

  async function submit() {
    const data = await mutation.mutateAsync()
    const txHash = data.checkout.txHash as Hex
    const marketplace = data.checkout.marketplaceContract as Hex
    sendTransaction({ to: marketplace, data: txHash })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  return (
    <>
      <Button
        onClick={submit}
      >
        {isPending ? 'Confirming...' : 'Send'}
      </Button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </>
  )
}

