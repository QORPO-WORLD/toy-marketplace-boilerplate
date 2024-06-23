import { classNames } from '~/config/classNames';
import { getCurrencyIconUrl, getPresentableChainName } from '~/config/networks';

import { Avatar, Button } from 'system';

/* ************* NETWORK LABEL ***************** */
type NetworkLabelStyleProps = {
  size?: 'sm' | 'base';
  rounded?: boolean;
  hideIcon?: boolean;
};

type NetworkLabelProps = NetworkLabelStyleProps & {
  chainId: number;
};

export const NetworkLabel = ({
  chainId,
  size = 'base',
  rounded = false,
  hideIcon = false,
}: NetworkLabelProps) => {
  const sizes = {
    sm: {
      button: 'sm',
      avatar: 'default',
    },
    base: {
      button: 'default',
      avatar: 'md',
    },
  } as const;

  return (
    <Button
      variant="ghost"
      className={`${classNames.networkLabel} w-fit border-none outline-none ${
        rounded ? 'rounded-full' : 'rounded-none'
      }`}
      size={sizes[size].button}
    >
      {!hideIcon ? (
        <NetworkIcon chainId={chainId} size={sizes[size].avatar} />
      ) : null}
      {getPresentableChainName(chainId)}
    </Button>
  );
};

/* ************* NETWORK ICON ***************** */
type NetworkIconProps = {
  chainId: number;
  size?: 'xs' | 'sm' | 'default' | 'md';
  loading?: boolean;
};

export const NetworkIcon = ({
  chainId,
  size = 'default',
  loading = false,
}: NetworkIconProps) => {
  return (
    <Avatar.Base size={size} className={loading ? 'loading' : ''}>
      <Avatar.Image alt="" src={getCurrencyIconUrl(chainId)} />
      <Avatar.Fallback>{chainId}</Avatar.Fallback>
    </Avatar.Base>
  );
};
