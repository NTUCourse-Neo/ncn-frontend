import React from 'react';
import {
  ChakraProvider,
  useColorModeValue,
} from '@chakra-ui/react';
import theme from './theme';
import HeaderBar from './components/HeaderBar';
import Footer from './components/Footer';
import HomeViewContainer from './containers/HomeViewContainer';


function App() {
  return (
    <ChakraProvider theme={theme}>
      <HeaderBar useColorModeValue={useColorModeValue}/>
      <HomeViewContainer/>
      <Footer />
    </ChakraProvider>
  );
}

export default App;
