import React, { Component } from 'react';
import { connect } from 'react-redux';

// import InputItem from '../elements/InputItem.jsx';
import TestInputItem from '../elements/TestInputItem';

import ValidAddressDisplay from '../elements/ValidAddressDisplay';

import * as Actions from '../../actions/actions';
import {
  updateContractToWatch,
  cancelContractToWatch,
  closeModal,
  addObservedContract,
  displayGlobalNotification,
} from '../../actions/actions.js';

const jsonPlaceholder =
  '[{type: &quot;constructor&quot;, name: &quot;MyContract&quot;, &quot;inputs&quot;:[{"name&quot;:&quot;_param1&quot;, &quot;type&quot;:&quot;address&quot;}]}, {...}]';

class WatchItem extends Component {
  constructor(props) {
    super(props);
    this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
    this.cancelFunction = this.cancelFunction.bind(this);
    this.submitFunction = this.submitFunction.bind(this);
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (this.props.display !== prevProps.display) {
      return true;
    }
    return false;
  }

  handleOnKeyUp(e) {
    this.props.updateContractToWatch({
      name: e.target.getAttribute('name'),
      value: e.target.value,
    });
  }

  cancelFunction(e) {
    this.props.cancelContractToWatch(); // TODO: reset data values in inputs
    this.props.closeModal('displayWatchContract');
  }

  submitFunction(e) {
    let web3;
    const contract = this.props.ContractToWatch;
    if (this.props.web3.web3Instance) {
      web3 = this.props.web3.web3Instance;
      const con = {};
      try {
        web3.eth.getBalance(contract.address, (err, res) => {
          if (err) console.warn(err);
          contract.balance = res;
          contract.logs = [];
          contract.contractAddress = contract.address;
          con[contract.address] = contract;

          const { ContractsPendingConfirmations, WalletContracts } = this.props;
          const deployedWalletContracts = Object.assign(
            {},
            ContractsPendingConfirmations,
            WalletContracts
          );
          contract.deployedWalletContract = Object.keys(
            deployedWalletContracts
          ).includes(contract.address);

          this.props.addObservedContract(con);
          this.props.displayGlobalNotification({
            display: true,
            type: 'success',
            msg: 'Added custom contract',
          });
        });
      } catch (err) {
        console.warn(err);
        this.props.displayGlobalNotification({
          display: true,
          type: 'error',
          msg: 'Error retreiving balance for the added contract',
        });
      }
    }
    this.props.closeModal('displayWatchContract');
  }

  renderInputs() {
    return (
      <React.Fragment>
        <h1>Watch contract</h1>
        <h3>Contract Address</h3>
        <ValidAddressDisplay
          name="address"
          classes="dapp-address-input"
          autoComplete="off"
          onChange={this.handleOnKeyUp}
        />
        <h3>Contract name</h3>
        <input
          type="string"
          name="contract-name"
          placeholder="Name this contract"
          className="name"
          onKeyUp={this.handleOnKeyUp}
        />
        <h3>JSON Interface</h3>
        <div className="dapp-json-interface-input">
          <input
            type="text"
            name="jsonInterface"
            placeholder={jsonPlaceholder}
            className="jsonInterface"
            onKeyUp={this.handleOnKeyUp}
          />
        </div>
      </React.Fragment>
    );
  }

  renderButtons() {
    return (
      <div className="dapp-modal-buttons">
        <button className="cancel" onClick={this.cancelFunction}>
          Cancel
        </button>
        <button
          className="ok dapp-primary-button"
          onClick={this.submitFunction}
        >
          OK
        </button>
      </div>
    );
  }

  render() {
    let divStyle;
    if (!this.props.display) divStyle = { display: 'none' };
    return (
      <div className={this.props.display} style={divStyle}>
        <section className="dapp-modal-container modals-add-custom-contract">
          {this.renderInputs()}
          {this.renderButtons()}
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ContractToWatch: state.reducers.ContractToWatch,
  ContractsPendingConfirmations: state.reducers.ContractsPendingConfirmations,
  WalletContracts: state.reducers.WalletContracts,
  web3: state.web3,
});

export default connect(
  mapStateToProps,
  {
    updateContractToWatch,
    cancelContractToWatch,
    closeModal,
    addObservedContract,
    displayGlobalNotification,
  }
)(WatchItem);
