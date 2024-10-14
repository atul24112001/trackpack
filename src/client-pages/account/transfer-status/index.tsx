import React from "react";
import Processing from "./Processing";
import Failed from "./Failed";
import Success from "./Success";

export default function TransferStatusComponent({
  status,
  failedMessage,
  processingMessage,
  successMessage,
}: Props) {
  return (
    <div>
      {status === "processing" && <Processing message={processingMessage} />}
      {status === "failed" && <Failed message={failedMessage} />}
      {status === "success" && <Success message={successMessage} />}
    </div>
  );
}

type Props = {
  status: TransferStatus;
  processingMessage?: string;
  failedMessage?: string;
  successMessage?: string;
};
