# JoyID EVM AA (Account Abstraction) Demo

This Demo is designed for developers, showcasing how to integrate the [JoyID Passkey Wallet](https://joy.id/) into your EVM AA (Account Abstraction)
applications with [ZeroDev](https://docs.zerodev.app/) SDK. 

### Quick Start

1. Installation

```
pnpm install
```

2. Update `JOYID_APP_URL`, `ZERO_DEV_PROJECT_ID` and `TEST_SESSION_KEY` in `src/env.ts`

> The `JOYID_APP_URL` is the joyid wallet app url, please set to https://testnet.joyid.dev for staging env, or https://app.joy.id for product env.
>
> The `ZERO_DEV_PROJECT_ID` is your own ZeroDev Project ID which you can get from [ZeroDev dashboard](https://docs.zerodev.app/getting-started#create-a-project)
>
> The `TEST_SESSION_KEY` is a test session private key which you can bind it to your EVM AA (Account Abstraction) account


3. Build and Test

```
pnpm build
pnpm test
```

### Create AA account with JoyID Wallet

```
import { ECDSAProvider } from "@zerodev/sdk";
import { connect } from "@joyid/evm";
import { JoyIDSigner } from "@joyid/evm/aa";

// connect JoyID wallet to get ethereum address
const ethAddress = await connect();

// The ZeroDev provider
const ecdsaProvider = await ECDSAProvider.init({
  // ZeroDev projectId
  projectId,
  // The signer
  owner: new JoyIDSigner(ethAddress),
});
```