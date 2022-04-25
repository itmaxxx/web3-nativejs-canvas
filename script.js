// TODO:
// + get contract balance
// + send all contract money to me
// + create get grid method in contract
// + deploy new contract
// + inject new contract
// + display grid
// + show pixel info on hover
// + current x:y position
// + listen for buy event
// - update user account balance
// + fix get grid coords
// - last buys
// - add bought pixel to grid, so the message is available immediately
// - show selected color

const root = document.getElementById('root');

const web3 = new Web3('wss://rinkeby.infura.io/ws/v3/94945f550e5c495ba9710ba0d0cffc7e');
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
}

window.ethereum.on('accountsChanged', function (accounts) {
  console.log('accountChanged');
  loadUser(accounts);
});

window.onload = async function () {
  console.log('onload');

  if (window.ethereum) {
    try {
      contract = new web3.eth.Contract(abi, cAddr);

      // console.log(contract);

      // console.log(contract.methods);

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      loadUser(accounts);

      setupUI();
      listenToEvents();
    } catch (error) {
      console.error(error);
    }
  }
};

async function listenToEvents() {
  contract.events
    .PixelBought()
    .on('data', (event) => {
      console.log('event', event);

      const { _buyer, _color, _message, _position, _price } = event.returnValues;

      // console.log({ _buyer, _color, _message, _position, _price });

      addPixelToGrid(
        _buyer,
        parseInt(_position.x),
        parseInt(_position.y),
        _color,
        _message,
        _price
      );
    })
    .on('changed', (changed) => console.log('changed', changed))
    .on('error', (err) => console.warn('error', err))
    .on('connected', (str) => console.log('connected', str));
}

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
  setupGrid();

  pixelInfo = document.getElementById('pixelInfo');

  paletteDiv = document.getElementById('palette');
  displayPalette();
}

async function loadGrid() {
  const grid = await contract.methods.getGrid().call();
  return grid;
}

function renderGrid(grid) {
  root.innerHTML = null;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      const pixel = document.createElement('div');
      pixel.style = `background-color: ${palette[grid[x][y].color]};`;
      pixel.id = `x-${x}_y-${y}`;
      pixel.className = 'pixel';
      pixel.addEventListener('click', function () {
        buyPixel(x, y);
      });
      pixel.addEventListener('mouseover', function () {
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
      ? `(last sold for ${web3.utils.fromWei(grid[x][y].lastSellPrice, 'ether')})`
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

function addPixelToGrid(owner, x, y, color, message, price) {
  const newPixel = { owner, color, message, lastSellPrice: price, position: { x, y } };

  console.log({ newPixel });

  // let _grid = JSON.parse(JSON.stringify(grid));
  // _grid[x][y] = newPixel;
  grid[x][y] = newPixel;

  // console.log(grid[x][y]);

  // renderGrid(grid);

  const pixel = document.getElementById(`x-${x}_y-${y}`);
  pixel.style = `background-color: ${palette[color]};`;
  // pixel.removeEventListener('click');
  // pixel.removeEventListener('mouseover');
  // pixel.addEventListener('click', function () {
  //   buyPixel(x, y);
  // });
  // pixel.addEventListener('mouseover', function () {
  //   showPixelInfo(x, y);
  // });
}
