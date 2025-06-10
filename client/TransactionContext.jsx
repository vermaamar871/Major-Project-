import React, { useEffect, useState } from "react";
//import { ethers } from "ethers";
const { parseEther } = ethers;
//import { BrowserProvider } from "ethers";
//import { Contract } from "ethers";
import { ethers, BrowserProvider, Contract } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract =async () => {
  if (!window.ethereum) {
    throw new Error("No ethereum object");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;

}
export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [isloading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
 

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  

  const checkIfWalletIsConnect = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask.");

      const accounts = await window.ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
       // getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask.");

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      console.log("Ethereum object:", window.ethereum);
      if (!window.ethereum) return alert("please install metamask");
      
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = await createEthereumContract();
        const amountAsFloat = parseFloat(amount);
           if (isNaN(amountAsFloat) || amountAsFloat <= 0) {
          return alert("Please enter a valid ETH amount greater than 0");
         }
         const parsedAmount = ethers.parseEther(amountAsFloat.toString());
          await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value:  parsedAmount.toString(),
          }],
        });
        const gasLimit = await transactionsContract.addToBlockchain.estimateGas(
          addressTo, amountAsBigInt, message, keyword, { value: amountAsBigInt }
        );
        
        const transactionHash = await transactionsContract.addToBlockchain(
            addressTo, amountAsBigInt, message, keyword, { value: amountAsBigInt }
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();

        
        setIsLoading(false);
        console.log(`Success - ${transactionHash.hash}`);

        const transactionsCount = await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());


    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  }
  

  useEffect(() => {//use effect are created to call the function
    checkIfWalletIsConnect();
   // checkIfTransactionsExists();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setformData,
        handleChange,
        sendTransaction
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
