import { atom, selector } from "recoil";

type State = {
  accounts: null | { [key: string]: Account };
  activeAccountId: string | null;
};

export const state = atom<State>({
  key: "account-state",
  default: {
    accounts: null,
    activeAccountId: null,
  },
});

export const accountState = selector({
  key: "accounts-selector",
  get: ({ get }) => {
    const accounts = get(state).accounts;
    return accounts;
  },
  set: ({ set, get }, value) => {
    const activeAccountId = get(state).activeAccountId;
    set(state, {
      activeAccountId,
      accounts: value as null | { [key: string]: Account },
    });
  },
});

export const activeAccountState = selector({
  key: "active-account-selector",
  get: ({ get }) => {
    const {  activeAccountId } = get(state);
    return activeAccountId;
  },
  set: ({ set, get }, value) => {
    const { accounts } = get(state);
    set(state, {
      activeAccountId: value as string | null,
      accounts,
    });
  },
});
