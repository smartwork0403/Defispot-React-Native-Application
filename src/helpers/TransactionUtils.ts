import {ActionTypeEnum} from '../SDKs/midgard-sdk';

export const parseTxTypeToFriendly = (type: ActionTypeEnum) => {
  switch (type) {
    case ActionTypeEnum.AddLiquidity:
      return 'Deposit';
    case ActionTypeEnum.Donate:
      return 'Donate';
    case ActionTypeEnum.Refund:
      return 'Refund';
    case ActionTypeEnum.Swap:
      return 'Swap';
    case ActionTypeEnum.Switch:
      return 'Switch';
    case ActionTypeEnum.Withdraw:
      return 'Withdraw';
    default:
      return '';
  }
};

export const shrink = (value: string) => {
  const first = value.substring(0, 6);
  const second = value.substring(value.length - 4, value.length);
  return `${first}...${second}`;
};
