import React from 'react';
import { connect } from 'react-redux';

const User = props => (
  <div>
      <h1>User page</h1>
  </div>
);

export default connect()(User);