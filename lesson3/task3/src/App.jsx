import React from 'react';
import Comment from './Comment';

const userInfo = {
  name: 'Tom',
  avatarUrl: 'https://avatars1.githubusercontent.com',
};

const App = () => {
  return (
    <Comment
      author={userInfo}
      text="Good job!"
      date={new Date('2019-01-01T11:32:19.566Z')}
    />
  );
};

export default App;
