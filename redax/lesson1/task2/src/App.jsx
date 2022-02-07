import React from 'react';
import Header from './Header';
import { UserContect } from './user-context';

export class App extends React.Component {
  state = {
    userData: {
      name: 'dNikola Tesla',
      avatar_url: 'https://avatars3.githubusercontent.com/u10001',
    },
  };

  render() {
    return (
      <div className="page">
        <UserContect.Provider value={this.state.userData}>
          <Header />
        </UserContect.Provider>
      </div>
    );
  }
}

export default App;
