require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); 

module.exports = {
    networks: {
      localhost: {
        url: "http://127.0.0.1:8545",
      },
    },
    solidity: "0.8.18",
};

