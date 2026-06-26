import { WalletManager } from './WalletManager.js';
import { FreighterProvider } from './FreighterProvider.js';
import { XBullProvider } from './XBullProvider.js';
import { RabetProvider } from './RabetProvider.js';
import { LobstrProvider } from './LobstrProvider.js';
import { WalletConnectProvider } from './WalletConnectProvider.js';

const walletManager = new WalletManager();

walletManager.registerProvider(new FreighterProvider());
walletManager.registerProvider(new XBullProvider());
walletManager.registerProvider(new RabetProvider());
walletManager.registerProvider(new LobstrProvider());
walletManager.registerProvider(new WalletConnectProvider());

export {
  walletManager,
  WalletManager,
  FreighterProvider,
  XBullProvider,
  RabetProvider,
  LobstrProvider,
  WalletConnectProvider,
};
export { WalletProvider } from './WalletProvider.js';
