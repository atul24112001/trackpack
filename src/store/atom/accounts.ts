import { atom, selector } from "recoil";

type State = {
  accounts: null | { [key: string]: Account };
  activeAccountId: string | null;
  activeBlockchain: null | string;
  activeWallet: string | null;
};

export const state = atom<State>({
  key: "account-state",
  default: {
    accounts: null,
    activeAccountId: null,
    activeBlockchain: null,
    activeWallet: null,
  },
});

export const accountState = selector({
  key: "accounts-selector",
  get: ({ get }) => {
    const accounts = get(state).accounts;
    return accounts;
  },
  set: ({ set, get }, value) => {
    const currentState = get(state);
    set(state, {
      ...currentState,
      accounts: value as null | { [key: string]: Account },
    });
  },
});

export const activeAccountState = selector({
  key: "active-account-selector",
  get: ({ get }) => {
    const { activeAccountId } = get(state);
    return activeAccountId;
  },
  set: ({ set, get }, value) => {
    const currentState = get(state);
    set(state, {
      ...currentState,
      activeAccountId: value as string | null,
    });
  },
});

export const activeBlockchainState = selector({
  key: "active-blockchain-selector",
  get: ({ get }) => {
    const { activeBlockchain } = get(state);
    return activeBlockchain;
  },
  set: ({ set, get }, value) => {
    const currentState = get(state);
    set(state, {
      ...currentState,
      activeBlockchain: value as null | string,
    });
  },
});

export const activeWalletState = selector({
  key: "active-wallet-selector",
  get: ({ get }) => {
    const { activeWallet } = get(state);
    return activeWallet;
  },
  set: ({ set, get }, value) => {
    const currentState = get(state);
    set(state, {
      ...currentState,
      activeWallet: value as null | string,
    });
  },
});
