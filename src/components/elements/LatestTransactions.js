import React, { Component } from 'react';
import { connect } from 'react-redux';
import SecurityIcon from './SecurityIcon.js';
import * as Actions from '../../actions/actions.js';
import * as Utils from '../../utils/utils.js';
import LinearProgress from '@material-ui/core/LinearProgress';

class LatestTransactions extends Component {
  renderProgressBar(tx) {
    this.state = {
      completed:
        tx.confirmationNumber !== 'Pending' ? tx.confirmationNumber : 0,
    };
    return (
      <React.Fragment>
        {tx.confirmationNumber === 'Pending' ? (
          <LinearProgress />
        ) : (
          <LinearProgress
            variant="determinate"
            value={(100 / 12) * this.state.completed}
          />
        )}
      </React.Fragment>
    );
  }

  renderDateInfo(tx) {
    return (
      <td
        className="time simptip-position-right simptip-movable"
        data-tool-tip={tx.dateSent}
      >
        <h2>{Utils.getMonthName(tx.dateSent)}</h2>
        <p>{Utils.getDate(tx.dateSent)}</p>
      </td>
    );
  }

  renderTransactionType(tx) {
    return (
      <td className="account-name">
        <h2>Transaction Type</h2>
        <p>
          <span className="address dapp-shorten-text not-ens-name">
            <SecurityIcon
              type="transactionHref"
              classes="dapp-identicon dapp-tiny"
              hash={tx.from}
            />
          </span>
          <span className="arrow">→</span>
          <span className="address dapp-shorten-text not-ens-name">
            <SecurityIcon
              type="transactionHref"
              classes="dapp-identicon dapp-tiny"
              hash={tx.to}
            />
          </span>
        </p>
      </td>
    );
  }

  renderTransactionInfo(tx) {
    return (
      <td className="info">
        {tx.confirmationNumber === 'Pending'
          ? 'Pending...'
          : tx.confirmationNumber + ' of 12 Confirmations'}
      </td>
    );
  }

  renderTransactionAmount(tx) {
    return (
      <td className="transaction-amount minus">
        -
        {this.props.web3 && this.props.web3.web3Instance
          ? Utils.displayPriceFormatter(this.props, tx.value, 'ETHER') +
            ' ETHER'
          : tx.value}
      </td>
    );
  }

  renderIcon() {
    return (
      <td>
        <i className="icon-arrow-right minus" />
      </td>
    );
  }

  renderTableRow(tx) {
    return (
      <tr
        className={tx.confirmationNumber === 'Pending' ? 'unconfirmed' : ''}
        key={tx.transactionHash}
        data-transaction-hash={tx.transactionHash}
        data-block-hash={tx.blockHash}
        onClick={e => {
          if (e.target.tagName !== 'A') {
            this.props.updateSelectedTransaction(tx);
            this.props.displayModal('displayTransaction');
          }
        }}
      >
        {this.renderDateInfo(tx)}
        {this.renderTransactionType(tx)}
        {this.renderTransactionInfo(tx)}
        {this.renderTransactionAmount(tx)}
        {this.renderIcon()}
      </tr>
    );
  }

  render() {
    let transactions = this.props.reducers.Transactions;
    return (
      <React.Fragment>
        <h2>Latest transactions</h2>
        <br />
        <input
          type="text"
          className="filter-transactions"
          placeholder="Filter transactions"
        />
        <table className="dapp-zebra transactions">
          <tbody>
            {Object.keys(transactions).map(txHash => (
              <React.Fragment>
                {this.renderTableRow(txHash)}
                {this.renderProgressBar(txHash)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  ...state,
});

export default connect(
  mapStateToProps,
  { ...Actions }
)(LatestTransactions);
