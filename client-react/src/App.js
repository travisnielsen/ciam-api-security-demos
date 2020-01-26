import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';
import User from './components/User';

export default () => (
  <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/counter' component={Counter} />
    <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    <Route path='/user' component={User} />
    <Route path='/profile' component={() => {  window.location.href = 'https://nielskilab.b2clogin.com/nielskilab.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_ProfileEdit&client_id=48abf88d-b255-43f3-9e46-4f6342c65f3e&nonce=defaultNonce&redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=openid&response_type=code'; return null; }}/>

  </Layout>
);
