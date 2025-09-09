'use client'

import { useState, useEffect } from 'react'
import { supabase, type Enterprise } from '@/lib/supabase'
import Link from 'next/link'

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  // Get total count on page load
  useEffect(() => {
    getTotalCount()
  }, [])

  const getTotalCount = async () => {
    try {
      const { count, error } = await supabase
        .from('enterprises')
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.error('Error getting count:', error)
        return
      }
      
      setTotalCount(count || 0)
    } catch (err) {
      console.error('Error in getTotalCount:', err)
    }
  }

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setEnterprises([])
      return
    }

    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('enterprises')
        .select('*')
        .or(`enterprise_name.ilike.%${term}%,state_name.ilike.%${term}%,district_name.ilike.%${term}%`)
        .limit(20)
      
      if (error) {
        console.error('Search error:', error)
        return
      }
      
      if (data) {
        setEnterprises(data)
      }
    } catch (err) {
      console.error('Error in handleSearch:', err)
    }
    
    setLoading(false)
  }

  const createSlug = (enterprise: Enterprise) => {
    const stateName = enterprise.state_name.toLowerCase().replace(/\s+/g, '-')
    const companySlug = enterprise.enterprise_name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
    const pincode = enterprise.pincode || '000000'
    
    return `/${stateName}/${companySlug}-${pincode}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MSME Directory</h1>
              <p className="text-gray-600 mt-2">
                Search through {totalCount.toLocaleString()} MSME enterprises across India
              </p>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-blue-600 font-medium">Home</Link>
              <Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search enterprises by name, state, or district..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                handleSearch(e.target.value)
              }}
            />
            <button
              onClick={() => handleSearch(searchTerm)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        )}

        {enterprises.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Found {enterprises.length} enterprises
            </h2>
            <div className="grid gap-4">
              {enterprises.map((enterprise) => (
                <Link
                  key={enterprise.id}
                  href={createSlug(enterprise)}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <h3 className="font-semibold text-lg text-blue-600 hover:text-blue-800">
                    {enterprise.enterprise_name}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {enterprise.district_name}, {enterprise.state_name}
                    {enterprise.pincode && ` - ${enterprise.pincode}`}
                  </p>
                  {enterprise.registration_date && (
                    <p className="text-sm text-gray-500 mt-2">
                      Registered: {new Date(enterprise.registration_date).toLocaleDateString()}
                    </p>
                  )}
                  {enterprise.communication_address && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {enterprise.communication_address}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Directory Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalCount.toLocaleString()}</div>
              <div className="text-gray-600">Total Enterprises</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">36</div>
              <div className="text-gray-600">States & UTs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">700+</div>
              <div className="text-gray-600">Districts</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <details className="bg-white rounded-lg p-4 mb-3">
                <summary className="font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                  What is MSME registration?
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  MSME registration is a government recognition system that provides various benefits including easier loans, subsidies, and government scheme access.
                </p>
              </details>
              
              <details className="bg-white rounded-lg p-4 mb-3">
                <summary className="font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                  How to search in this directory?
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  Use the search box above to search by company name, state, district, or pincode. Results will show matching enterprises with their details.
                </p>
              </details>
            </div>
            
            <div>
              <details className="bg-white rounded-lg p-4 mb-3">
                <summary className="font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                  What are the benefits of MSME?
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  Benefits include priority lending, lower interest rates, collateral-free loans, protection against delayed payments, and various government subsidies.
                </p>
              </details>
              
              <details className="bg-white rounded-lg p-4 mb-3">
                <summary className="font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                  Is this directory free to use?
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  Yes, searching and viewing enterprise information is completely free. We provide easy access to MSME information for everyone.
                </p>
              </details>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/faq" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
              View all FAQs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
