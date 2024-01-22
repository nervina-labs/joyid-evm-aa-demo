import {useState} from "react";
import {Hex, stringToBytes, parseAbi, encodeFunctionData} from "viem";
import {LocalAccountSigner} from "@alchemy/aa-core"
import {VStack, Text, Button} from "@chakra-ui/react";
import {SessionKeyProvider, getPermissionFromABI, ParamOperator, constants} from "@zerodev/sdk";
import { useAaAddress, useCurrentAddress, useUpdateAaAddress } from "../hooks/useAccount";
import { JoySigner } from "../evm-aa/signer";
import { getAAProvider } from "../evm-aa/provider";
import { ECDSAProvider } from "@zerodev/sdk";
import { useEffect } from "react";
import { TEST_SESSION_KEY, ZERO_DEV_PROJECT_ID } from "../env";

// The NFT contract we will be interacting with
const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863'
const contractABI = parseAbi([
  'function mint(address _to) public',
  'function balanceOf(address owner) external view returns (uint256 balance)'
])

export const EvmAA = () => {
  const address = useCurrentAddress();
  const aaAddress = useAaAddress()
  const updateAaAddress = useUpdateAaAddress();
  const [provider, setProvider] = useState<ECDSAProvider>();
  const [signature, setSignature] = useState<Hex>();
  const [txHash, setTxHash] = useState<Hex>();
  const [sessionKeyProvider, setSessionKeyProvider] = useState<SessionKeyProvider>();
  const [sessionAddress, setSessionAddress] = useState<Hex>();

  const [createLoading, setCreateLoading] = useState(false);
  const [signLoading, setSignLoading] = useState(false);
  const [createSessionLoading, setCreateSessionLoading] = useState(false);
  const [sessionMintLoading, setSessionMintLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const signer = new JoySigner(address as Hex);
      setProvider(await getAAProvider(signer));
    };
    init();
  }, [address]); 

  const onCreate = async () => {
    setCreateLoading(true);
    const aaAddr = await provider?.getAddress();
    updateAaAddress(aaAddr);
    setCreateLoading(false);
  };

  const onSignMessage = async () => {
    const message = stringToBytes("Hello JoyID");
    setSignLoading(true)
    const sig = await provider?.signMessage(message);
    setSignature(sig);
    setSignLoading(false)
  };

  const onCreateSessionKey = async () => {
    setCreateSessionLoading(true);
    const sessionKey = LocalAccountSigner.privateKeyToAccountSigner(TEST_SESSION_KEY);
    const sessionProvider = await SessionKeyProvider.init({
      projectId: ZERO_DEV_PROJECT_ID,
      defaultProvider: provider,
      sessionKey: sessionKey!,
      sessionKeyData: {
        validAfter: 0,
        validUntil: 0,
        permissions: [
          getPermissionFromABI({
            target: contractAddress,
            valueLimit: BigInt(0),
            abi: contractABI,
            functionName: "mint",
            args: [
              {
                operator: ParamOperator.EQUAL,
                value: aaAddress!,
              },
            ],
          }),
        ],
        paymaster: constants.oneAddress,
      },
    });
    setSessionKeyProvider(sessionProvider)
    const addr = await sessionKey.getAddress();
    setSessionAddress(addr);
    setCreateSessionLoading(false);
  };

  const mintWithSessionKey = async () => {
    setSessionMintLoading(true)
    const {hash} = await sessionKeyProvider!.sendUserOperation({
      target: contractAddress,
      data: encodeFunctionData({
        abi: contractABI,
        functionName: "mint",
        args: [aaAddress!],
      }),
    });
    await sessionKeyProvider!.waitForUserOperationTransaction(hash as Hex);
    setTxHash(hash as Hex);
    setSessionMintLoading(false);
  }

  return (
    <VStack mt="30px !important">
      <Button onClick={onCreate} isLoading={createLoading}>
        Create AA Account
      </Button>
      {aaAddress && (
        <VStack mt="20px !important">
          <Text fontWeight="600" padding="0 30px">{`AA Address: ${aaAddress}`}</Text>
          <Text mt="30px !important" fontSize="14px" fontWeight="500">
            The unsigned message is: "Hello JoyID"
          </Text>
          <Button isLoading={signLoading} onClick={onSignMessage}>
            Sign Message with AA account
          </Button>
          {signature && <Text mt="20px !important" padding="0 30px" wordBreak="break-word">{`The signature is: ${signature}`}</Text>}

          <Button mt="30px !important" isLoading={createSessionLoading} onClick={onCreateSessionKey}>
            Create Session Key with AA account
          </Button>
          {sessionAddress && (
            <>
              <Text mt="20px !important" padding="0 30px" wordBreak="break-word">
                {`The address of session key is: ${sessionAddress}`}
              </Text>
              <Button mt="30px !important" isLoading={sessionMintLoading} onClick={mintWithSessionKey}>
                Mint NFT with Session Key
              </Button>

              {txHash && <Text mt="20px !important" padding="0 30px" wordBreak="break-word">{`The mint tx hash is: ${txHash}`}</Text>}
            </>
          )}
        </VStack>
      )}
    </VStack>
  );
}
