import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const colors = {
  primary: "#4A8CCE",
  secondary: "#1A548E",
};

const theme = extendTheme({
  colors: colors,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </GoogleOAuthProvider>
  );
}
