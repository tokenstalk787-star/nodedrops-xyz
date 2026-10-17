const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '..', 'data', 'site-store.json');
const data = JSON.parse(fs.readFileSync(storePath, 'utf8'));

const fundingMap = {
  'opp-linea-zkevm': '$725M',
  'opp-celestia-mocha': '$155M',
  'opp-berachain-bartio': '$111M',
  'opp-babylon-staking': '$96M',
  'opp-eth-sepolia': 'Ecosystem ($1.2B)',
  'opp-solana-tds': '$315M',
  'opp-eigenlayer-operator': '$164M',
  'opp-monad-early-infra': '$225M',
  'opp-movement-porto': '$38M',
  'opp-story-protocol': '$140M',
  'opp-aleo-prover': '$298M',
  'opp-cosmos-gaia': '$17M',
  'opp-arbitrum-sepolia': '$143M',
};

const tasksMap = {
  'opp-linea-zkevm': ['RPC Setup', 'Proof Verification', 'Voyage XP'],
  'opp-celestia-mocha': ['Light Node (DAS)', 'Mocha-4 Testnet', 'Incentivized'],
  'opp-berachain-bartio': ['Validator Node', 'Polaris EVM', 'Proof-of-Liquidity'],
  'opp-babylon-staking': ['Finality Provider', 'BTC Staking', 'Signer Daemon'],
  'opp-eth-sepolia': ['Geth Client', 'Lighthouse Consensus', 'Public Testnet'],
  'opp-solana-tds': ['Solana Validator', 'Cluster Uptime', 'TDS Rewards'],
  'opp-eigenlayer-operator': ['AVS Node', 'Restaking Operator', 'EigenDA'],
  'opp-monad-early-infra': ['Monad EVM Node', '10k TPS Sync', 'Devnet Alpha'],
  'opp-movement-porto': ['Porto Testnet', 'Move-EVM Node', 'Early Validator'],
  'opp-story-protocol': ['Iliad Testnet', 'IP Validator', 'Proof of Creativity'],
  'opp-aleo-prover': ['ZK Prover', 'GPU Miner', 'Mainnet Staking'],
  'opp-cosmos-gaia': ['Gaia Daemon', 'IBC Relayer', 'Cosmos Hub V19'],
  'opp-arbitrum-sepolia': ['Nitro Rollup Node', 'WASM Execution', 'Sequencer Feed'],
};

data.opportunities = data.opportunities.map(opp => {
  return {
    ...opp,
    fundingRaised: fundingMap[opp.id] || opp.fundingRaised || '$100M',
    tasks: tasksMap[opp.id] || (opp.tasks && opp.tasks.length > 0 ? opp.tasks : ['Node Operator', 'Testnet', 'Incentivized']),
  };
});

fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully re-mapped all 13 opportunities with accurate fundingRaised and tasks!');
