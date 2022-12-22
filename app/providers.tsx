// Neede because we use chakra ui
'use client';

import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './ui';


export function Providers({ children }: any) {
  return (
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
  );
}