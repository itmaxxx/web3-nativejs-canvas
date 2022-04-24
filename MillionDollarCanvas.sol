// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.7;

contract MillionPixelsCanvas {
  uint16 canvasSize;
  uint256 minimalPixelPrice;
  address owner;

  event OwnerChanged(address _oldOwner, address _newOwner);
  event PixelBought(address _buyer, Position _position, uint8 _color, string _message, uint256 _price);
  event MinimalPixelPriceChanged(uint256 _oldPrice, uint256 _newPrice);

  struct Position {
    uint16 x;
    uint16 y;
  }

  struct Pixel {
    address owner;
    uint8 color;
    Position position;
    string message;

    uint256 lastSellPrice;
  }

  modifier onlyOwner {
    require(msg.sender == owner, "Only owner can access this method");
    _;
  }

  mapping(uint16 => mapping(uint16 => Pixel)) public grid;

  constructor(uint16 _canvasSize, uint256 _minimalPixelPrice) {
    canvasSize = _canvasSize;
    minimalPixelPrice = _minimalPixelPrice;
    owner = msg.sender;
  }

  function getPixelPrice(Position memory _position) public view returns(uint256) {
    uint256 pixelPrice = minimalPixelPrice;
    
    if (grid[_position.x][_position.y].lastSellPrice > 0) {
      pixelPrice = grid[_position.x][_position.y].lastSellPrice * 2;
    }

    return pixelPrice;
  }

  function buyPixel(Position memory _position, uint8 _color, string memory _message) external payable {
    require(_position.x <= canvasSize, "X coord should be lower or equal to canvas size");
    require(_position.y <= canvasSize, "Y coord should be lower or equal to canvas size");

    uint256 pixelPrice = getPixelPrice(_position);
    require(msg.value >= pixelPrice, "This pixel costs more eth than you transfered");

    Pixel storage pixel = grid[_position.x][_position.y];

    pixel.owner = msg.sender;
    pixel.color = _color;
    pixel.message = _message;
    pixel.lastSellPrice = msg.value;

    emit PixelBought(msg.sender, _position, _color, _message, pixelPrice);
  }

  function getBalance() public view onlyOwner returns(uint256) {
    return payable(address(this)).balance;
  }

  function withdraw() external onlyOwner {
    payable(owner).transfer(getBalance());
  }

  function transferOwnership(address _newOwner) external onlyOwner {
    emit OwnerChanged(owner, _newOwner);
    owner = _newOwner;
  }

  function setMinimalPixelPrice(uint256 _newPrice) external onlyOwner {
    emit MinimalPixelPriceChanged(minimalPixelPrice, _newPrice);
    minimalPixelPrice = _newPrice;
  }
}