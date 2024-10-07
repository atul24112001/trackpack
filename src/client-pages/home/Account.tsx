import { accountState, activeAccountState } from "@/store/atom/accounts";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";

export default function Account() {
  const accounts = useRecoilValue(accountState);
  const activeAccountId = useRecoilValue(activeAccountState);

  const activeAccount = useMemo(() => {
    return accounts?.[activeAccountId || ""] || null;
  }, [accounts, activeAccountId]);

  if (!activeAccount) {
    return <p>No Active account</p>;
  }

  return <div className="w-[90%] mt-5 mx-auto"></div>;
}
