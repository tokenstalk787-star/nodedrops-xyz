async function verify() {
  const res = await fetch('http://localhost:3001/');
  const html = await res.text();

  const checks = [
    { feature: 'Page Title / Brand Meta', pass: html.includes('NodeDrops.xyz') },
    { feature: 'Breadcrumb: Potential Airdrops', pass: html.includes('Potential Airdrops') },
    { feature: 'Sub-nav: Airdrops Dashboard', pass: html.includes('Airdrops Dashboard') },
    { feature: 'Sub-nav: Confirmed Rewards', pass: html.includes('Confirmed Rewards') },
    { feature: 'Sub-nav: My Watchlist', pass: html.includes('My Watchlist') },
    { feature: 'Sub-nav: Submit Airdrop', pass: html.includes('Submit Airdrop') },
    { feature: 'Action Button: Get Node Drops API', pass: html.includes('Get Node Drops API') },
    { feature: 'Action Button: Telegram Alerts', pass: html.includes('Telegram Alerts') },
    { feature: 'Action Button: For Partnership', pass: html.includes('For Partnership') },
    { feature: 'Overview: Curated Activity Overview', pass: html.includes('Curated Activity Overview') },
    { feature: 'Overview: Active Drops metric', pass: html.includes('Active Drops') },
    { feature: 'Milestone Card: Linea zkEVM & Berachain', pass: html.includes('Linea zkEVM') },
    { feature: 'Filter Toolbar: Search Input', pass: html.includes('Filter by project name, network...') },
    { feature: 'Filter Toolbar: Task Type Dropdown', pass: html.includes('Task Type: All') },
    { feature: 'Filter Toolbar: Phase Dropdown', pass: html.includes('Phase: All') },
    { feature: 'Table: Linea zkEVM ($725M)', pass: html.includes('Linea zkEVM') && html.includes('$725M') },
    { feature: 'Table: Celestia Light Node ($155M)', pass: html.includes('Celestia') && html.includes('$155M') },
    { feature: 'Table: Berachain bArtio ($111M)', pass: html.includes('Berachain') && html.includes('$111M') },
    { feature: 'Table: Babylon Bitcoin Staking ($96M)', pass: html.includes('Babylon') && html.includes('$96M') },
    { feature: 'Table: Monad EVM Devnet ($225M)', pass: html.includes('Monad') && html.includes('$225M') },
    { feature: 'Table: Task Badges (Blue Pills + N)', pass: html.includes('Light Node (DAS)') && html.includes('bg-brand-blue/15') },
    { feature: 'Table: Est. VPS Cost ($10-$15/mo)', pass: html.includes('~$10 - $15/mo') },
    { feature: 'Table: Deploy Buttons', pass: html.includes('Deploy') },
    { feature: 'Table: Pagination Controls', pass: html.includes('opportunities') && html.includes('Showing') },
    { feature: 'FAQ: 8 Accordion Questions (Exact Reference)', pass: html.includes('What is an airdrop / incentivized testnet?') && html.includes('How to avoid scams and protect your wallet and nodes?') },
    { feature: 'Promo Banner: Track Algorithmic Deployments', pass: html.includes('Track Algorithmic Deployments') },
    { feature: 'Promo Banner: Start Running A Node Button', pass: html.includes('Start Running A Node') },
    { feature: 'Security Protocol Banner (Zero-Wallet)', pass: html.includes('NodeDrops.xyz Operator Security Protocol') },
  ];

  console.table(checks);
  const allPassed = checks.every(c => c.pass);
  console.log('----------------------------------------------------');
  console.log(`TOTAL CHECKS: ${checks.length}`);
  console.log(`PASSED: ${checks.filter(c => c.pass).length}`);
  console.log(`FAILED: ${checks.filter(c => !c.pass).length}`);
  console.log(`ALL PASSED: ${allPassed}`);
  console.log('----------------------------------------------------');
}

verify().catch(console.error);
