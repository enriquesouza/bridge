// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

import "./IToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BridgeBase is ReentrancyGuard {
    using SafeMath for uint;

    address public admin;
    IToken public token;
    mapping(address => mapping(uint => bool)) public processedNonces;

    enum Step {
        Burn,
        Mint
    }
    event Transfer(
        address from,
        address to,
        uint amount,
        uint date,
        uint nonce,
        bytes signature,
        Step indexed step
    );

    constructor(address _token) {
        admin = msg.sender;
        token = IToken(_token);
    }

    fallback() external payable {}

    receive() external payable {}

    function internalUpdateAdmin() internal {
        token.updateAdmin();
    }

    function updateAdmin() external {
        require(msg.sender == admin, "Only admin can update admin");
        internalUpdateAdmin();
    }

    function burn(
        address to,
        uint amount,
        uint nonce,
        bytes calldata signature
    ) external nonReentrant {
        require(
            processedNonces[msg.sender][nonce] == false,
            "transfer already processed"
        );
        processedNonces[msg.sender][nonce] = true;

        address burnAddress = 0x000000000000000000000000000000000000dEaD;

        // Ensure the contract has the necessary allowance
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Insufficient allowance"
        );

        // Transfer tokens from the user to the burn address
        token.transferFrom(msg.sender, burnAddress, amount);

        emit Transfer(
            msg.sender,
            to,
            amount,
            block.timestamp,
            nonce,
            signature,
            Step.Burn
        );
    }

    function internalMint(
        address from,
        address to,
        uint amount,
        uint nonce,
        bytes calldata signature
    ) internal {
        // TODO: use the signature for testnet and mainnet. Locally it will only work if you use the same private keys.
        // bytes32 message = keccak256(abi.encodePacked(from, to, amount, nonce));
        // require(recoverSigner(message, signature) == from, "wrong signature");
        // require(
        //     processedNonces[from][nonce] == false,
        //     "transfer already processed"
        // );
        // processedNonces[from][nonce] = true;
        token.mint(amount);
        // internalTransferReplayToken(to, amount);
        // emit Transfer(
        //     from,
        //     to,
        //     amount,
        //     block.timestamp,
        //     nonce,
        //     signature,
        //     Step.Mint
        // );
    }

    function mint(
        address from,
        address to,
        uint amount,
        uint nonce,
        bytes calldata signature
    ) external {
        //require(msg.sender == admin, "Only admin can mint coins");
        internalMint(from, to, amount, nonce, signature);
    }

    function internalTransferReplayToken(address recipient, uint256 amount) internal  {
        token.transfer(recipient, amount);
    }

    function transferReplayToken(address recipient, uint256 amount) external {
        internalTransferReplayToken(recipient, amount);
    }

    function recoverSigner(
        bytes32 message,
        bytes memory sig
    ) internal pure returns (address) {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) internal pure returns (uint8, bytes32, bytes32) {
        require(sig.length == 68, "Invalid signature length");

        uint8 v;
        bytes32 r;
        bytes32 s;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }
}
