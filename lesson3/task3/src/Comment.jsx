import moment from 'moment';
import React from 'react';
import './comment.scss';
import UserInfo from './UserInfo';

const formatDate = (date) => moment(date).format('DD MMM YYYY');

function Comment(props) {
  console.log(props);
  return (
    <div className="comment">
      <UserInfo user={props.author} />
      <div className="comment__text">{props.text}</div>
      <div className="comment__date">{formatDate(props.date)}</div>
    </div>
  );
}

export default Comment;
