import { SignTypedDataParams, SmartAccountSigner } from "@alchemy/aa-core";
import { type Hex, TypedDataDefinition } from "viem";
import {signMessage as signEvmMsg, signTypedData as signEvmTypedData} from "@joyid/evm";

export class JoySigner implements SmartAccountSigner {
  address: Hex;

  signerType = "local";
  inner = 'useless';

  constructor(address: Hex) {
    this.address = address;
  }

  readonly getAddress: () => Promise<Hex> = async () => {
    return new Promise((resolve) => {
      resolve(this.address as Hex);
    })
  };

  readonly signMessage: (msg: string | Uint8Array) => Promise<Hex> = (msg) => {
    return signEvmMsg(msg, this.address);
  };

  readonly signTypedData = (params: SignTypedDataParams) => {
    const typedData = params as TypedDataDefinition;
    return signEvmTypedData(typedData, this.address);
  };
}
