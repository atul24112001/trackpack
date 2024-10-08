import Account from "@/client-pages/account";
import React from "react";

export default function ServerAccountPage({ params }: Props) {
  return <Account activeAccountId={params.accountId} />;
}

type Props = {
  params: { [key: string]: string };
};
