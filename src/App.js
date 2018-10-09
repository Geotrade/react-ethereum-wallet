// modules
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
// import { spring, AnimatedSwitch } from 'react-router-transition';
import cn from 'classnames';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// actions
import * as Actions from './actions/actions.js';
import * as Utils from './utils/utils.js';
import * as WalletUtils from './utils/WalletUtils.js';

// views
import AccountView from './components/views/account.js';
import SingleAccountView from './components/views/SingleAccountView.jsx';
import ContractsView from './components/views/contracts.js';
import SendContractForm from './components/views/send.js';
import NewWalletContract from './components/views/NewWalletContract.jsx';
import NavBar from './components/navbar';

// components
import MistAlertBubble from './components/mistAlertBubble.js';

// Modals
// import NoConnection from './components/views/modals/NoConnection.jsx';
import WatchContract from './components/views/modals/WatchContract.jsx';
import WatchToken from './components/views/modals/WatchToken.jsx';
import DeleteToken from './components/views/modals/DeleteToken.jsx';
import SendTransaction from './components/views/modals/SendTransaction.jsx';
import MaterialModal from './components/views/modals/MaterialModal.jsx';
import TransactionInfo from './components/views/modals/TransactionInfo.jsx';
// import QRCode from './components/views/modals/QRCode.jsx';
// import JsonInterface from './components/views/modals/JsonInterface.jsx';

// stylesheets
import './stylesheets/mergedstyles.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.getCCP = this.getCCP.bind(this);
    this.getCCP();
    this.CCInterval = setInterval(() => this.getCCP(), 15000);

    this.props.fetchEthGasStationStats();
    this.GasInterval = setInterval(
      () => this.props.fetchEthGasStationStats(),
      15000
    );
    console.log(this.props);
    console.log(this.state);
    let web3Returned = setInterval(() => {
      if (this.props.web3 != null) {
        clearInterval(web3Returned);
        let web3 = this.props.web3.web3Instance;
        Utils.checkNetwork(web3, this.props.updateConnectedNetwork);
        this.props.updateProvider(Utils.nameProvider(web3.currentProvider));
        Utils.getAccounts(
          web3,
          this.props.setWallets,
          this.props.updateTotalBalance
        );
        Utils.getNewBlockHeaders(
          web3,
          this.props.updateBlockHeader,
          this.props.updatePeerCount
        );
        this.props.createInitWalletContract(
          WalletUtils.initWalletContact(web3)
        );
      }
    }, 1000);
  }

  getCCP() {
    Utils.getCryptoComparePrices().then(exchangeRates => {
      this.props.updateEtherPrices(exchangeRates);
    });
  }

  componentDidMount() {
    window.addEventListener('blur', e =>
      document.body.classList.add('app-blur')
    );
    window.addEventListener('focus', e =>
      document.body.classList.remove('app-blur')
    );
  }

  componentWillUnmount() {
    clearInterval(this.CCInterval);
    clearInterval(this.GasInterval);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.reducers.totalBalance !== prevProps.reducers.totalBalance ||
      this.props.reducers.currency !== prevProps.reducers.currency ||
      !Object.is(
        this.props.reducers.exchangeRates,
        prevProps.reducers.exchangeRates
      )
    ) {
      // this.props.updateDisplayValue(Utils.displayPriceFormatter(this.props));
    }

    if (
      this.props.reducers.globalNotification !==
        prevProps.reducers.globalNotification.display &&
      this.props.reducers.globalNotification.display === true
    ) {
      let notification = this.props.reducers.globalNotification;
      let toastConfig = {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      };
      switch (notification.type) {
        case 'error':
          toast.error(notification.msg, toastConfig);
          break;
        case 'warning':
          toast.warning(notification.msg, toastConfig);
          break;
        case 'success':
          toast.success(notification.msg, toastConfig);
          break;
        case 'info':
          toast.info(notification.msg, toastConfig);
          break;
        case 'default':
          toast(notification.msg, toastConfig);
          break;
        default:
          toast('a notification type was not set', toastConfig);
          break;
      }
      this.props.displayGlobalNotification({ display: false });
    }

    Object.values(this.props.reducers.modals).includes(true)
      ? document.body.classList.add('disable-scroll', 'blur', 'app-blur')
      : document.body.classList.remove('disable-scroll', 'blur', 'app-blur');
  }

  render() {
    // we need to map the `scale` prop we define below
    // to the transform style property
    // function mapStyles(styles) {
    //   return { opacity: styles.opacity, transform: `scale(${styles.scale})` };
    // }
    // wrap the `spring` helper to use a bouncy config
    // function bounce(val) {
    //   return spring(val, { stiffness: 330, damping: 22 });
    // }
    // child matches will...
    // const bounceTransition = {
    //   // start in a transparent, upscaled state
    //   atEnter: { opacity: 0, scale: 1.2 },
    //   // leave in a transparent, downscaled state
    //   atLeave: { opacity: bounce(0), scale: bounce(0.8) },
    //   // and rest at an opaque, normally-scaled state
    //   atActive: { opacity: bounce(1), scale: bounce(1) },
    // };

    let modals = this.props.reducers.modals;
    let watchContract = cn({
      'dapp-modal-overlay': modals.displayWatchContract || false,
    });
    let watchToken = cn({
      'dapp-modal-overlay': modals.displayWatchToken || false,
    });
    let deleteToken = cn({
      'dapp-modal-overlay': modals.displayDeleteToken || false,
    });
    let sendTransaction = cn({
      'dapp-modal-overlay': modals.displaySendTransaction || false,
    });
    let viewTransaction = cn({
      'dapp-modal-overlay': modals.displayTransaction || false,
    });

    //  let JsonInterface = cn({
    //   'dapp-modal-overlay': modals.displayJSONInterface || false,
    // });
    // let QRCode = cn({
    //   'dapp-modal-overlay': modals.displayQRCode || false,
    // });

    return (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <div className="dapp-flex-content">
            <main className="dapp-content">
              {/*
              <AnimatedSwitch
                atEnter={bounceTransition.atEnter}
                atLeave={bounceTransition.atLeave}
                atActive={bounceTransition.atActive}
                mapStyles={mapStyles}
              > */}
              <Route exact path="/account/new" component={NewWalletContract} />

              <Route path="/account/*" component={SingleAccountView} />
              <Route exact path="/" component={AccountView} />
              <Route exact path="/send-from" component={SendContractForm} />
              <Route exact path="/contracts" component={ContractsView} />
              <Route exact path="/contracts" component={ContractsView} />
              {/*
              </AnimatedSwitch>
              */}
              <MistAlertBubble />
            </main>
          </div>

          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />

          <MaterialModal />
          <DeleteToken
            token={this.props.reducers.TokenToDelete}
            display={deleteToken}
          />
          <TransactionInfo
            display={viewTransaction}
            transaction={this.props.reducers.SelectedTransaction}
          />
          <WatchToken display={watchToken} />
          <WatchContract display={watchContract} />
          <SendTransaction display={sendTransaction} />
          {/*<QRCode display={QRCode} /> */}
          {/*} <JsonInterface display={JsonInterface} />*/}

          {/*<NoConnection connection={this.props.web3} />*/}
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

export default connect(
  mapStateToProps,
  { ...Actions }
)(App);
