# JoyID EVM AA (Account Abstraction) Demo

This Demo is designed for developers, showcasing how to integrate the [JoyID Passkey Wallet](https://joy.id/) into your EVM AA (Account Abstraction)
applications with [ZeroDev](https://docs.zerodev.app/) SDK. 

### Quick Start

1. Installation

```
pnpm install
```

2. Update `ZERO_DEV_PROJECT_ID` and `TEST_SESSION_KEY` in `env/index.ts`

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