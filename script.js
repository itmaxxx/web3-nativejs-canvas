// TODO:
// + get contract balance
// + send all contract money to me
// + create get grid method in contract
// + deploy new contract
// + inject new contract
// + display grid
// + show pixel info on hover
// + current x:y position
// - listen for buy event
// - update user account balance
// + fix get grid coords

const root = document.getElementById('root');

const web3 = new Web3('https://rinkeby.infura.io/v3/94945f550e5c495ba9710ba0d0cffc7e');
const cAddr = '0x57fEd365970efa91eC8fA33DF2332b3A0C22a246';
let contract = null;
let account = null;
let grid = null;
let selectedColor = 0;

// Contants
const PIXEL_SIZE = 10;

// UI
let pixelInfo = null;
let paletteDiv = null;

async function loadUser(accounts) {
  account = accounts[0];
  console.log({ account });

  document.getElementById('account').innerHTML = `Account: ${account}`;
  const accountBalance = await web3.eth.getBalance(account);
  const balanceInEth = web3.utils.fromWei(accountBalance, 'ether');
  document.getElementById('balance').innerHTML = `Balance: ${balanceInEth} ETH`;

  contract = new web3.eth.Contract(abi, cAddr);

  //console.log(contract);

  console.log(contract.methods);

  //console.log(await contract.methods.grid(0, 0).call());
}

window.ethereum.on('accountsChanged', function (accounts) {
  console.log('accountChanged');
  loadUser(accounts);
});

window.onload = async function () {
  console.log('onload');

  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      loadUser(accounts);

      setupUI();
    } catch (error) {
      console.error(error);
    }
  }
};

async function buyPixel(x, y) {
  try {
    const message = prompt('Enter message you would like to share');
    const data = await contract.methods.buyPixel([x, y], selectedColor, message).encodeABI();
    console.log('buyPixel data', data);

    window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: cAddr,
            value: web3.utils.toWei('10000', 'gwei'),
            data
          }
        ]
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error);
  } catch (error) {
    console.log(error);
  }
}

async function getContractBalance() {
  const contractBalance = await contract.methods.getBalance().call({ from: account });
  const contractBalanceInEth = web3.utils.fromWei(contractBalance);
  alert(`Current contract balance is ${contractBalanceInEth} ETH`);
}

async function withdrawContractBalance() {
  await contract.methods.getBalance().send({ from: account });
}

function setupUI() {
  const getContractBalanceBtn = document.getElementById('getContractBalance');
  getContractBalanceBtn.addEventListener('click', getContractBalance);

  const withdrawContractBalanceBtn = document.getElementById('withdrawContractBalance');
  withdrawContractBalanceBtn.addEventListener('click', withdrawContractBalance);

  const displayGridBtn = document.getElementById('displayGrid');
  displayGridBtn.addEventListener('click', setupGrid);

  pixelInfo = document.getElementById('pixelInfo');

  paletteDiv = document.getElementById('palette');
  displayPalette();
}

async function loadGrid() {
  const grid = await contract.methods.getGrid().call();
  console.log(grid);
  return grid;
}

function renderGrid(grid) {
  root.innerHTML = null;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      const pixel = document.createElement('div');
      pixel.style = `background-color: ${palette[grid[x][y].color]};`;
      pixel.className = 'pixel';
      pixel.addEventListener('click', function () {
        buyPixel(x, y);
      });
      pixel.addEventListener('mouseover', () => {
        showPixelInfo(x, y);
      });
      root.appendChild(pixel);
    }
  }
}

async function setupGrid() {
  grid = await loadGrid();
  renderGrid(grid);
  root.style = `width: ${grid.length * PIXEL_SIZE}px`;
}

function showPixelInfo(x, y) {
  pixelInfo.innerHTML = `${x}:${y} color: ${grid[x][y].color} ${
    grid[x][y].message?.length ? `with message ${grid[x][y].message}` : ''
  } ${
    grid[x][y].lastSellPrice > 0
      ? `last sold for ${web3.utils.fromWei(grid[x][y].lastSellPrice, 'ether')}`
      : ''
  }`;
}

function displayPalette() {
  for (let i = 0; i < palette.length; i++) {
    const pixel = document.createElement('div');
    pixel.style = `background-color: ${palette[i]};`;
    pixel.className = 'palette_color';
    pixel.addEventListener('click', function () {
      console.log('Selected color', palette[i]);
      selectedColor = i;
    });
    paletteDiv.appendChild(pixel);
  }
}
