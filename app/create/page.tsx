"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/Navigation"
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, Contract } from 'ethers'

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

// ABI for creating posts
const CREATE_POST_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_achievement", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"}
    ],
    "name": "createPost",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const CONTRACT_ADDRESS = "0x0178d9E3c16179b015e21FB58A3A6Bcc843da5Ca"

export default function CreatePostPage() {
  const [achievement, setAchievement] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  const { open } = useAppKit()
  const { isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      open()
      return
    }

    if (!walletProvider) {
      alert("Wallet provider not available")
      return
    }

    setIsSubmitting(true)

    try {
      const ethersProvider = new BrowserProvider(walletProvider as unknown as EthereumProvider)
      const signer = await ethersProvider.getSigner()
      
      const contract = new Contract(CONTRACT_ADDRESS, CREATE_POST_ABI, signer)
      
      // Create the post on the blockchain
      const tx = await contract.createPost(achievement, description)
      const receipt = await tx.wait()
      
      console.log("Post created on blockchain:", receipt)
      
      // Navigate to main feed to see the new post
      router.push("/")
    } catch (error) {
      console.error("Failed to create post:", error)
      alert(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Achievement</h1>
          <p className="text-gray-600">Tell the community about your accomplishment</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6">
            <label htmlFor="achievement" className="block text-sm font-medium text-gray-700 mb-2">
              What did you achieve?
            </label>
            <input
              type="text"
              id="achievement"
              value={achievement}
              onChange={(e) => setAchievement(e.target.value)}
              placeholder="e.g., Completed my first marathon, Launched my app, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Tell us more about it
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share the details of your journey, challenges you overcame, or what this achievement means to you..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !achievement.trim() || !description.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Creating on blockchain..." : isConnected ? "Share Achievement" : "Connect Wallet to Share"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
