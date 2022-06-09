const http = require("http");
const { Telegraf } = require("telegraf");
const Web3 = require("web3");
const Moralis = require("moralis/node");

var Contract = require("web3-eth-contract");

const hostname = "127.0.0.1";
const port = 3000;

const usdt_abi = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "_decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "burn",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "mint",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
var busd_contract_ad_bsc = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
var usdt_contract_ad_bsc = "0x55d398326f99059fF775485246999027B3197955";
var admin = require("firebase-admin");

var serviceAccount = require("./test.json");

const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();
async function getFirebase(nameFireStore) {
  const snapshot = await db.collection(nameFireStore).get();

  snapshot.forEach((doc) => {
    // console.log(doc.id, "=>", doc.data());
    return doc.data();
  });
  return snapshot.docs.map((doc) => doc.data());
}
async function getData(params) {
  let arrRun = await getFirebase("AddressRun");
  let arrRunBox = await getFirebase("AddressRunBox");
  let newarr = arrRun.concat(arrRunBox);
  // let newarr = await getFirebase();
  let filterArr = [];
  // showListBUSD(newarr);

  // let newarr = [...datanew];

  for (let index = 0; index < newarr.length; index++) {
    let address = newarr[index].Address;
    let valueUSDT = await showUSDT(address);

    let valueBUSD = await showBUSD(address);

    let value = parseInt(valueBUSD) + parseInt(valueUSDT);
    let amountBUSD_USDT = { valueBUSD_USDT: `${value}` };

    let obj = Object.assign(newarr[index], amountBUSD_USDT);
    delete obj.Time;
    delete obj.Address;
    delete obj.Contract;
    delete obj.Type;
    filterArr.push(obj);
  }

  var newArray = filterArr.filter(function (el) {
    return el.valueBUSD_USDT > 50;
  });

  return newArray;
}

async function showBUSD(address) {
  const serverUrl =
    "https://speedy-nodes-nyc.moralis.io/03a17818929988d11bd3f5cd/bsc/mainnet";
  const appId = "FJ21OtD53RTJ3yKormpVOHwsP5JVMR6RBfMnLVwI";
  const moralisSecret = "JjAbZblolwJd52r";
  let valueBUSD;

  let _web3 = new Web3(new Web3.providers.HttpProvider(serverUrl));
  const busd_contract_bsc = new _web3.eth.Contract(
    usdt_abi,
    busd_contract_ad_bsc
  );

  valueBUSD =
    (await busd_contract_bsc.methods.balanceOf(address).call()) / 1e18;

  return valueBUSD;
}
async function showUSDT(address) {
  const serverUrl =
    "https://speedy-nodes-nyc.moralis.io/03a17818929988d11bd3f5cd/bsc/mainnet";

  let valueUSDT;

  let _web3 = new Web3(new Web3.providers.HttpProvider(serverUrl));
  const usdt_contract_bsc = new _web3.eth.Contract(
    usdt_abi,
    usdt_contract_ad_bsc
  );

  valueUSDT =
    (await usdt_contract_bsc.methods.balanceOf(address).call()) / 1e18;

  return valueUSDT;
}
async function showListBUSD(data) {
  let listBUSD = [];
  const serverUrl =
    "https://speedy-nodes-nyc.moralis.io/03a17818929988d11bd3f5cd/bsc/mainnet";
  const appId = "FJ21OtD53RTJ3yKormpVOHwsP5JVMR6RBfMnLVwI";
  const moralisSecret = "JjAbZblolwJd52r";
  let _web3 = new Web3(new Web3.providers.HttpProvider(serverUrl));
  const busd_contract_bsc = new _web3.eth.Contract(
    usdt_abi,
    busd_contract_ad_bsc
  );
  for (let index = 0; index < data.length; index++) {
    const element = data[index].Address;
    let valueBUSD =
      (await busd_contract_bsc.methods.balanceOf(element).call()) / 1e18;
    listBUSD.push(valueBUSD);

    // let valueUSDT;
    // valueUSDT =
    //   (await busd_contract_bsc.methods.balanceOf(element).call()) / 1e18;

    // console.log(valueUSDT);
  }
  console.log(listBUSD);
}
async function get() {
  let value = await showUSDT("0x7564f0EC63638cCfa589ad4114f6764BcF74eCFF");
  console.log({ value });
}
// get();

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);

  // async function newFilter(params) {
  //   let data = await getData();
  //   console.log(data);
  // }
  // newFilter();

  const bot = new Telegraf("5116302131:AAEE3beyoMrRoj_CHR8uXFN6E_Eorz_1Ok0", {
    polling: true,
  });
  bot.launch();
  const sendMessage = async () => {
    // let arr = [];

    // for (let index = 0; index < 10; index++) {
    //   var value = Math.floor(Math.random() * 100);
    //   arr.push(value);
    // }
    // function checkNums(num) {
    //   return num > 20;
    // }
    // let amount = arr.filter(checkNums);
    let data = await getData();

    bot.telegram.sendMessage("1954760742", data);
  };

  sendMessage();

  setInterval(() => {
    sendMessage();
  }, 5 * 60 * 1000);
});
