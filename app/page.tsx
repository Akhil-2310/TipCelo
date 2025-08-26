"use client"

import { useState, useEffect } from "react"
import PostCard from "@/components/PostCard"
import Navigation from "@/components/Navigation"
import { useAppKitAccount } from '@reown/appkit/react'
import { useVerification } from '@/lib/useVerification'
import { Contract, JsonRpcProvider } from 'ethers'
import Link from "next/link"

interface Post {
  id: string
  author: string
  authorAddress: string
  achievement: string
  description: string
  timestamp: string
  tips: number
  tipAmount: number
}

interface BlockchainPost {
  id: bigint
  author: string
  achievement: string
  description: string
  timestamp: bigint
  tips: bigint
  tipAmount: bigint
}

// ABI for reading all posts
const READ_ALL_POSTS_ABI = [
  {
    "inputs": [],
    "name": "getAllPosts",
    "outputs": [{
      "components": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "address", "name": "author", "type": "address"},
        {"internalType": "string", "name": "achievement", "type": "string"},
        {"internalType": "string", "name": "description", "type": "string"},
        {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
        {"internalType": "uint256", "name": "tips", "type": "uint256"},
        {"internalType": "uint256", "name": "tipAmount", "type": "uint256"}
      ],
      "internalType": "struct TipCit.Post[]",
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  }
]

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0178d9E3c16179b015e21FB58A3A6Bcc843da5Ca"

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  
  // const { walletProvider } = useAppKitProvider('eip155')
  const { address } = useAppKitAccount()
  const { isVerified, isLoading: verificationLoading } = useVerification()

  const fetchAllPosts = async () => {
    setLoading(true)
    try {
      // Use read-only provider to avoid ENS issues
      const provider = new JsonRpcProvider('https://celo-mainnet.g.alchemy.com/v2/CAhzwSg8fVeW8QVeqjgOz', {
        chainId: 42220,
        name: 'celo-mainnet',
      })
      const contract = new Contract(CONTRACT_ADDRESS, READ_ALL_POSTS_ABI, provider)
          
      const blockchainPosts = await contract.getAllPosts()
      
      const formattedPosts: Post[] = blockchainPosts.map((post: BlockchainPost) => ({
        id: post.id.toString(),
        author: `${post.author.slice(0, 6)}...${post.author.slice(-4)}`, // Shortened address as author name
        authorAddress: post.author,
        achievement: post.achievement,
        description: post.description,
        timestamp: new Date(Number(post.timestamp) * 1000).toISOString(),
        tips: Number(post.tips),
        tipAmount: Number(post.tipAmount) / 1e18 // Convert from wei to cBTC
      }))
      
      // Sort by timestamp, newest first
      formattedPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
      setPosts(formattedPosts)
    } catch (error) {
      console.error("Failed to fetch posts from blockchain:", error)
      // Fallback to mock data on error
      const mockPosts: Post[] = [
      ]
      setPosts(mockPosts)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllPosts()
  }, [address]) // Refresh when address changes

  // Add a refresh function for manual refresh
  const handleRefresh = () => {
    fetchAllPosts()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Verification Status Banner */}
        {!verificationLoading && !isVerified && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-yellow-600">🔒</span>
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Verification Required
                  </p>
                  <p className="text-sm text-yellow-700">
                    Verify your identity to create posts and interact with the community
                  </p>
                </div>
              </div>
              <Link
                href="/verify"
                className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Verify Now
              </Link>
            </div>
          </div>
        )}

        {!verificationLoading && isVerified && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-green-600">✅</span>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Identity Verified
                </p>
                <p className="text-sm text-green-700">
                  You can create posts and interact with the community
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievement Feed</h1>
            <p className="text-gray-600">Celebrate and support others&apos; accomplishments</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading posts...</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No posts yet. Be the first to share an achievement!</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
