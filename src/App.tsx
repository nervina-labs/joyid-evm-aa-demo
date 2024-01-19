import { useState } from "react";
import { connect } from "@joyid/evm";
import "./App.css";
import { useCurrentAddress, useUpdateAaAddress, useUpdateAddress } from "./hooks/useAccount";
import { EvmAA } from "./components/EvmAA";

export default function App() {
  const updateAddress = useUpdateAddress();
  const updateAaAddress = useUpdateAaAddress()
  const address = useCurrentAddress();

  const [connectLoading, setConnectLoading] = useState(false);

  const onConnect = async () => {
    setConnectLoading(true)
    try {
      const res = await connect();
      updateAddress(res);
    } catch (error) {
      console.log(error);
    } finally {
      setConnectLoading(false);
    }
  };

  const disconnect = () => {
    updateAaAddress(undefined);
    updateAddress(undefined);
  }

  return (
    <div id="app">
      <div className="text-2xl sticky font-bold text-center">JoyID EVM AA demo</div>
      {address ? (
        <div className="mb-[10px]">
          <h1 className="text-xl mb-4">Connected: </h1>
          <div>{address}</div>
          <div className="divider" />
          <EvmAA />

          <div className="divider" />
          <button className="btn btn-primary capitalize w-[120px]" onClick={disconnect}>
            Disconnect
          </button>
          <div className="divider" />
        </div>
      ) : (
        <div className="text-center">
          <button className="btn btn-primary capitalize w-[200px] mt-[30px]" disabled={connectLoading} onClick={onConnect}>
            {connectLoading ? <span className="loading loading-spinner loading-md" /> : "JoyID Passkey connect"}
          </button>
        </div>
      )}
    </div>
  );
}
