import * as React from "react";
import ReactDOM from "react-dom/client";
import {ChakraProvider} from "@chakra-ui/react";
import {QueryClient, QueryClientProvider} from "react-query";
import App from "./App";
import { initConfig } from "@joyid/evm";
import { JOYID_APP_URL } from "./env";

const cacheTime = 1000 * 60 * 60 * 24;

initConfig({
  name: "JoyID EVM AA Demo",
  logo: "https://fav.farm/🆔",
  joyidAppURL: JOYID_APP_URL,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
