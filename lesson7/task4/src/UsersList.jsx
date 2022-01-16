import React from 'react';
import Pagination from './Pagination';
import User from './User';

class UsersList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
    };
  }

  goPrev = () => {
    this.setState({
      currentPage: this.state.currentPage - 1,
    });
  };

  goNext = () => {
    this.setState({
      currentPage: this.state.currentPage + 1,
    });
  };

  render() {
    const ITEMS_PER_PAGE = 3;
    const lastItemIndex = this.state.currentPage * ITEMS_PER_PAGE;
    const firstItemIndex = lastItemIndex - ITEMS_PER_PAGE;
    const currentItems = this.props.users.slice(firstItemIndex, lastItemIndex);

    return (
      <div>
        <Pagination
          goNext={this.goNext}
          goPrev={this.goPrev}
          currentPage={this.state.currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={this.props.users.length}
        />
        <ul className="users">
          {currentItems.map((user) => (
            <User key={user.id} name={user.name} age={user.age} />
          ))}
        </ul>
      </div>
    );
  }
}

export default UsersList;
