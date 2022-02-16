import React, { useState } from 'react';
import './App.css';
import { ethers } from "ethers";
import FunToken from "./contracts/FunToken.json";
import { Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const contractAddress ='0x7f850531e88E0841197ca1351eB7CDB54bD66900';

let provider;
let signer;
let funToken;
let noProviderAbort = true;

// Ensures metamask or similar installed
if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
	try{
		// Ethers.js set up, gets data from MetaMask and blockchain
		window.ethereum.enable().then(
			provider = new ethers.providers.Web3Provider(window.ethereum)
		);
		signer = provider.getSigner();
		funToken = new ethers.Contract(contractAddress, FunToken.abi, signer);
		console.log(funToken);
		noProviderAbort = false;
	} catch(e) {
		noProviderAbort = true;
	}
}

function App() {
	const [walletAddress, setWalletAddress] = useState('0x00');
	const [funTokenBalance, setFunTokenBalance] = useState(0);
	const [ethBalance, setEthBalance] = useState(0);
	const [mintAmount, setMintAmount] = useState('0');
	const [burnAmount, setBurnAmount] = useState('0');
	const [transferAmount, setTransferAmount] = useState('0');
	const [transferAddress, setTransferAddress] = useState('0x00');
	const [pendingFrom, setPendingFrom] = useState('0x00');
	const [pendingTo, setPendingTo] = useState('0x00');
	const [pendingAmount, setPendingAmount] = useState('0');
	const [isPending, setIsPending] = useState(false);
	const [errMsg, setErrMsg] = useState("Transaction failed!");
	const [isError, setIsError] = useState(false);

	// Aborts app if metamask etc not present
	if (noProviderAbort) {
		return (
			<div>
				<h1>Error</h1>
				<p><a href="https://metamask.io">Metamask</a> or equivalent required to access this page.</p>
			</div>
		);
	}

	// Notification to user that transaction sent to blockchain
	const PendingAlert = () => {
		if (!isPending) return null;
		return (
			<Alert key="pending" variant="info" dismissible
			onClose={() => setIsPending(false)}
			style={{position: 'absolute', top: 0}}>
				Blockchain event notification: transaction of {pendingAmount} 
				&#x39e; from <br />
				{pendingFrom} <br /> to <br /> {pendingTo}
			</Alert>
		);
	};

	// Notification to user of blockchain error
	const ErrorAlert = () => {
		if (!isError) return null;
		return (
			<Alert key="error" variant="danger" dismissible
			onClose={() => setIsError(false)}
			style={{position: 'absolute', top: 0}}>
				{errMsg}
			</Alert>
		);
	};

	// Sets current balance of FUN for user
	signer.getAddress().then(response => {
		setWalletAddress(response);
		return funToken.balanceOf(response);
	}).then(balance => {
		setFunTokenBalance(balance.toString())
	});

	// Sets current balance of Eth for user
	signer.getAddress().then(response => {
		return provider.getBalance(response);
	}).then(balance => {
		let formattedBalance = ethers.utils.formatUnits(balance, 18);
		setEthBalance(formattedBalance.toString())
	});

	async function mintFUN() {
		try {
			await funToken.mint(walletAddress, mintAmount);
			await funToken.on("Transfer", (from, to, amount) => {
				setPendingFrom(from.toString());
				setPendingTo(to.toString());
				setPendingAmount(amount.toString());
				setIsPending(true);
			})
		} catch(err) {
			setIsError(true);
			setErrMsg(err)
		} 	
	}

	async function burnFUN() {
		try {
			await funToken.burn(burnAmount);
			await funToken.on("Transfer", (from, to, amount) => {
				setPendingFrom(from.toString());
				setPendingTo(to.toString());
				setPendingAmount(amount.toString());
				setIsPending(true);
			})
		} catch(err) {
			setIsError(true);
			setErrMsg(err)
		} 
	}

	async function transferFUN() {
		try {
			await funToken.transfer(transferAddress, transferAmount);
			await funToken.on("Transfer", (from, to, amount) => {
				setPendingFrom(from.toString());
				setPendingTo(to.toString());
				setPendingAmount(amount.toString());
				setIsPending(true);
			})
		} catch(err) {
			setIsError(true);
			setErrMsg(err)
		} 
	}

	const handleMintSubmit = (e) => {
		e.preventDefault();
		mintFUN();
	};

	const handleBurnSubmit = (e) => {
		e.preventDefault();
		burnFUN();
	};

	const handleTransferSubmit = (e) => {
		e.preventDefault();
		transferFUN();
	};

	return (
		<div className="App">
			<header className="App-header">
				<ErrorAlert />
				<PendingAlert />
				<img src="https://s2.coinmarketcap.com/static/img/coins/200x200/1757.png" className="App-logo" alt="FUN logo" />

				<p>
					User Wallet address: {walletAddress}<br/>
					Eth balance: {ethBalance}<br />
					FUN balance: {funTokenBalance}<br />
				</p>

				<form onSubmit={handleMintSubmit}>
					<p>
						<input type="number" step="1" min="0" id="mintfun" 
						name="mintfun" onChange={e => setMintAmount(e.target.value)} required 
						style={{margin:'12px'}}/>	
						<Button type="submit" >Mint FUN</Button>
					</p>
				</form>

				<form onSubmit={handleBurnSubmit}>
					<p>
						<input type="number" step="1" min="0" id="burnfun" 
						name="burnfun" onChange={e => setBurnAmount(e.target.value)} required 
						style={{margin:'12px'}}/>	
						<Button type="submit" >Burn FUN</Button>
					</p>
				</form>
				<form onSubmit={handleTransferSubmit}>
					<p>
						<input type="text" step="1" min="0" id="transferaddress" placeholder='address'
						name="transferaddress" onChange={e => setTransferAddress(e.target.value)} required 
						style={{margin:'12px'}}/>

						<input type="number" step="1" min="0" id="transferamount" placeholder='amount'
						name="transferamount" onChange={e => setTransferAmount(e.target.value)} required 
						style={{margin:'12px'}}/>
						<Button type="submit" >Transfer FUN</Button>
					</p>
				</form>
			</header>
		</div>
	);
}

export default App;