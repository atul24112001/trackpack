import React from "react";
import Processing from "./Processing";
import Failed from "./Failed";
import Success from "./Success";

export default function TransferStatusComponent({ status }: Props) {
  return (
    <div>
      {status === "processing" && <Processing />}
      {status === "failed" && <Failed />}
      {status === "success" && <Success />}
    </div>
  );
}

type Props = {
  status: TransferStatus;
};
