import React, { Component } from 'react';
import SimpleStorageContract from './contracts/StarNotary.json';
import getWeb3 from './getWeb3';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      starName: '',
      starOwner: '',
      id: '',
      lookid: '',
      isFind: false,
      lookName: '',
    };
    this.claimStarFunc = this.claimStarFunc.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.lookUp = this.lookUp.bind(this);
  }

  // state = { storageValue: 0, web3: null, accounts: null, contract: null };
  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  claimStarFunc = async () => {
    const { accounts, contract } = this.state;
    const { createStar } = contract.methods;
    await createStar(this.state.starName, this.state.id).send({
      from: accounts[0],
    });
    this.setState({ starOwner: accounts[0] });
  };
  lookUp = async () => {
    const { contract } = this.state;
    const { lookUptokenIdToStarInfo } = contract.methods;
    try {
      let response = await lookUptokenIdToStarInfo(this.state.lookid).call();
      this.setState({ isFind: true });
      this.setState({ lookName: response });
    } catch (err) {
      this.setState({ lookName: 'No Star found for this id' });
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className='App'>
        <h1>StarNotary Token DAPP</h1>
        <hr />

        <br />
        <h1>Create a Star</h1>
        <br />
        <label htmlFor='starName'>Star Name:</label>
        <input
          type='text'
          id='starName'
          name='starName'
          onChange={this.handleChange}
        ></input>
        <br />
        <label htmlFor='starId'>Star ID:</label>
        <input
          type='text'
          id='starId'
          name='id'
          onChange={this.handleChange}
        ></input>
        <br />
        <br />
        <button id='createStar' onClick={this.claimStarFunc}>
          Create Star
        </button>
        <br />
        <hr />
        <br />
        <h1>Look up a Star</h1>
        <br />
        <label htmlFor='name'>Star ID:</label>
        <input
          type='text'
          id='lookid'
          name='lookid'
          onChange={this.handleChange}
        ></input>
        <br />
        <br />
        <button onClick={this.lookUp}>Look Up a Star</button>
        <br />
        {this.state.lookName}
        <hr />
        <br />
        <span id='status'>{this.state.starOwner}</span>
        <br />
      </div>
    );
  }
}

export default App;
