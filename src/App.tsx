import { useState } from "react";
import {VStack, Text, Button} from "@chakra-ui/react";
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
    <VStack padding="25px">
      <Text fontSize="32px" mt="20px">
        JoyID EVM AA Demo
      </Text>
      {address ? (
        <VStack mt="30px !important">
          <Text fontSize="14px" fontWeight="600" padding="0 30px">
            {`Ethereum Address: ${address}`}
          </Text>

          <EvmAA />

          <Button mt="60px !important" onClick={disconnect}>
            Disconnect
          </Button>
        </VStack>
      ) : (
        <Button mt="30px !important" disabled={connectLoading} onClick={onConnect} isLoading={connectLoading}>
          JoyID Passkey connect
        </Button>
      )}
    </VStack>
  );
}
