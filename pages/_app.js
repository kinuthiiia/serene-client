import "../styles/globals.css";

import { MantineProvider, createEmotionCache } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import { withUrqlClient } from "next-urql";

function MyApp({ Component, pageProps }) {
  const myCache = createEmotionCache({
    key: "mantine",
    prepend: false,
  });

  return (
    <MantineProvider
      emotionCache={myCache}
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light",
        fontFamily: "Prompt",
      }}
    >
      <NotificationsProvider>
        <Component {...pageProps} />
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default withUrqlClient(() => ({
  // url: "http://localhost:8080/graphql",
  url: "https://serene-backend.vercel.app/graphql",
}))(MyApp);
