import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'

// 1. Get projectId from https://cloud.reown.com
const projectId = "6bf0fb8b46e12e88e7664004567b8ab7"

// 2. Set up the Ethereum Adapter
const ethersAdapter = new EthersAdapter()

// 3. Configure the metadata
const metadata = {
  name: 'TipCit',
  description: 'A platform to share achievements and receive tips',
  url: 'https://tipcit.app', // origin must match your domain & subdomain
  icons: ['https://tipcit.app/favicon.ico']
}

// 4. Define Citrea Testnet
const citreaTestnet = {
  id: 5115,
  name: 'Citrea Testnet',
  nativeCurrency: {
    name: 'Citrea Bitcoin',
    symbol: 'cBTC',
    decimals: 18
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.citrea.xyz'] }
  },
  blockExplorers: {
    default: { name: 'Citrea Explorer', url: 'https://explorer.testnet.citrea.xyz' }
  }
}

// 5. Create the modal
createAppKit({
  adapters: [ethersAdapter],
  projectId,
  networks: [citreaTestnet],
  defaultNetwork: citreaTestnet,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export { citreaTestnet }