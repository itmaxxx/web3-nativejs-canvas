const abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint16',
            name: 'x',
            type: 'uint16'
          },
          {
            internalType: 'uint16',
            name: 'y',
            type: 'uint16'
          }
        ],
        internalType: 'struct MillionPixelsCanvas.Position',
        name: '_position',
        type: 'tuple'
      },
      {
        internalType: 'uint8',
        name: '_color',
        type: 'uint8'
      },
      {
        internalType: 'string',
        name: '_message',
        type: 'string'
      }
    ],
    name: 'buyPixel',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_canvasSize',
        type: 'uint16'
      },
      {
        internalType: 'uint256',
        name: '_minimalPixelPrice',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_oldPrice',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_newPrice',
        type: 'uint256'
      }
    ],
    name: 'MinimalPixelPriceChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_oldOwner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_newOwner',
        type: 'address'
      }
    ],
    name: 'OwnerChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_buyer',
        type: 'address'
      },
      {
        components: [
          {
            internalType: 'uint16',
            name: 'x',
            type: 'uint16'
          },
          {
            internalType: 'uint16',
            name: 'y',
            type: 'uint16'
          }
        ],
        indexed: false,
        internalType: 'struct MillionPixelsCanvas.Position',
        name: '_position',
        type: 'tuple'
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: '_color',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_message',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_price',
        type: 'uint256'
      }
    ],
    name: 'PixelBought',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newPrice',
        type: 'uint256'
      }
    ],
    name: 'setMinimalPixelPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint16',
            name: 'x',
            type: 'uint16'
          },
          {
            internalType: 'uint16',
            name: 'y',
            type: 'uint16'
          }
        ],
        internalType: 'struct MillionPixelsCanvas.Position',
        name: '_position',
        type: 'tuple'
      }
    ],
    name: 'getPixelPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      },
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      }
    ],
    name: 'grid',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        internalType: 'uint8',
        name: 'color',
        type: 'uint8'
      },
      {
        components: [
          {
            internalType: 'uint16',
            name: 'x',
            type: 'uint16'
          },
          {
            internalType: 'uint16',
            name: 'y',
            type: 'uint16'
          }
        ],
        internalType: 'struct MillionPixelsCanvas.Position',
        name: 'position',
        type: 'tuple'
      },
      {
        internalType: 'string',
        name: 'message',
        type: 'string'
      },
      {
        internalType: 'uint256',
        name: 'lastSellPrice',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];
