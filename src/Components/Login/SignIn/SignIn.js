import React, { Component } from 'react';

class SignIn extends Component {
  componentDidMount(props) {
    console.log('property_id', this.props.location.state);
  }

  render() {
    return (
      <div className='text-center Signin'>
        <div>hi</div>
      </div>
    );
  }
}

export default SignIn;
