import moment from 'moment';
import React from 'react';
import './profile.scss';

const formatDate = (date) => moment(date).format('DD MMM YY');

const Profile = (props) => {
  const fullName = `${props.userData.firstName} ${props.userData.lastName}`;
  const birthDate = `Was born ${formatDate(props.userData.birthDate)} in ${
    props.userData.birthPlace
  }`;

  return (
    <div className="profile">
      <div className="profile__name">{fullName}</div>
      <div className="profile__birth">{birthDate}</div>
    </div>
  );
};

export default Profile;
