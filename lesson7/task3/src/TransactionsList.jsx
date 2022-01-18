import React from 'react'
import Transaction from './Transaction'

class TransactionsList extends React.Component {
  render() {
    const { transactions } = this.props
    return (
      <ul className="transactions">
        {transactions.map((transaction) => (
          <Transaction key={transaction.id} {...transaction} />
        ))}
      </ul>
    )
  }
}

export default TransactionsList
