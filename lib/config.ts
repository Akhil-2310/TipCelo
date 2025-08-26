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


const celo = {
  id: 42220,
  name: 'Celo',
  nativeCurrency: {
    name: 'Celo',
    symbol: 'CELO',
    decimals: 18
  },
  rpcUrls: {
    default: { http: ['https://celo-mainnet.g.alchemy.com/v2/CAhzwSg8fVeW8QVeqjgOz'] }
  },
  blockExplorers: {
    default: { name: 'Celo Explorer', url: 'https://explorer.celo.org' }
  }
}

// 5. Create the modal
createAppKit({
  adapters: [ethersAdapter],
  projectId,
  networks: [celo],
  defaultNetwork: celo,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export { celo }