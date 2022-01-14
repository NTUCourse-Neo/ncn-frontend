import { ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import theme from './theme';
import { Provider } from "react-redux";
import store from "./store/index";
import 'focus-visible/dist/focus-visible';
import { BrowserRouter, Routes, Route } from "react-router-dom";


ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Routes>
          <Route path="/" element={<App route="home"/>} />
          <Route path="/course" element={<App route="course"/>} />
          <Route path="/user/info" element={<App route="user/info"/>} />
          <Route path="/user/my" element={<App route="user/my"/>} />
          <Route path="/error/:code" element={<App route="error"/>} />
          <Route path="/about" element={<App route="about"/>} />
          <Route path="*" element={<App route="home"/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
