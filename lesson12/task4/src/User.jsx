import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const User = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${userId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error('Not found user');
        }
      })
      .then((userData) => setUser(userData));
  }, [userId]);

  return (
    <div className="user">
      {user && (
        <>
          <img
            alt="User Avatar"
            src={user.avatar_url}
            className="user__avatar"
          />
          <div className="user__info">
            <span className="user__name">{user.name}</span>
            <span className="user__location">{user.location}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default User;
