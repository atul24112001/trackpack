import useNetwork from "@/hooks/use-network";
import React from "react";

const formatDate = (timestamp: any) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

export default function Transaction({ transactionData }: Props) {
  const { blockTime, meta, transaction } = transactionData;
  const { fee, preBalances, postBalances } = meta;
  const { accountKeys } = transaction.message;
  const { wallet } = useNetwork();

  console.log({ transactionData });

  const send = accountKeys[0].toBase58() === wallet?.publicKey;
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <p>
        <strong>Block Time:</strong> {formatDate(blockTime)}
      </p>

      <p>
        <strong>Transaction Fee:</strong> {fee} lamports
      </p>

      <h3>Balances</h3>
      <p>
        <strong>Before:</strong> {preBalances.join(", ")}
      </p>
      <p>
        <strong>After:</strong> {postBalances.join(", ")}
      </p>

      <p>{send ? "Sent" : "Rec"}</p>

      {/* <p>
        <strong>Recent Blockhash:</strong> {recentBlockhash}
      </p>

      <h3>Log Messages</h3>
      <ul>
        {logMessages.map((msg: any, index: number) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

      <h3>Signature</h3>
      <p>{transaction.signatures[0]}</p> */}
    </div>
  );
}

type Props = {
  transactionData: any;
};
