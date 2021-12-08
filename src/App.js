import { React, useState } from 'react';
import {
  ChakraProvider,
  useColorModeValue,
} from '@chakra-ui/react';
import theme from './theme';
import HeaderBar from './components/HeaderBar';
import Footer from './components/Footer';
import HomeViewContainer from './containers/HomeViewContainer';
import CourseResultViewContainer from './containers/CourseResultViewContainer';


function App() {
  const [view, setView] = useState(1);
  return (
    <ChakraProvider theme={theme}>
      <HeaderBar useColorModeValue={useColorModeValue} view={view} setView={setView}/>
      {view === 1 ? <HomeViewContainer/>:<CourseResultViewContainer/>}
      <Footer />
    </ChakraProvider>
  );
}

export default App;
