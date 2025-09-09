import { supabase, type Enterprise } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'

interface EnterprisePageProps {
  params: { slug: string }
}

// Generate metadata for SEO
export async function generateMetadata(
  { params }: EnterprisePageProps
): Promise<Metadata> {
  const resolvedParams = await params
  const enterprise = await getEnterpriseBySlug(resolvedParams.slug)
  
  if (!enterprise) {
    return {
      title: 'Enterprise Not Found | MSME Directory'
    }
  }

  return {
    title: `${enterprise.enterprise_name} | MSME Directory`,
    description: `${enterprise.enterprise_name} - MSME enterprise located in ${enterprise.district_name}, ${enterprise.state_name}. Registration details and business information.`,
    keywords: [
      enterprise.enterprise_name,
      enterprise.state_name,
      enterprise.district_name,
      'MSME',
      'enterprise',
      'business directory'
    ]
  }
}

async function getEnterpriseBySlug(slug: string): Promise<(Enterprise & { activities?: EnterpriseActivity[] }) | null> {
  // Extract ID from slug (format: company-name-123)
  const idMatch = slug.match(/-(\d+)$/)
  if (!idMatch) return null
  
  const id = parseInt(idMatch[1])
  
  const { data, error } = await supabase
    .from('enterprises')
    .select(`
      *,
      enterprise_activities (
        id,
        nic_5digit_id,
        description
      )
    `)
    .eq('id', id)
    .single()
  
  if (error || !data) return null
  
  // Map enterprise_activities to activities for the frontend
  const result = {
    ...data,
    activities: data.enterprise_activities || []
  }
  
  return result as Enterprise & { activities?: EnterpriseActivity[] }
}

export default async function EnterprisePage({ params }: EnterprisePageProps) {
  const resolvedParams = await params
  const enterprise = await getEnterpriseBySlug(resolvedParams.slug)
  
  if (!enterprise) {
    notFound()
  }


  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not available'
    
    // Handle DD/MM/YYYY format
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/')
      if (day && month && year) {
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })
        }
      }
    }
    
    // Handle other date formats
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long', 
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Enterprise Details</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="border-b pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {enterprise.enterprise_name}
            </h1>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {enterprise.district_name}, {enterprise.state_name}
              {enterprise.pincode && ` - ${enterprise.pincode}`}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Enterprise Name</label>
                  <p className="text-gray-900">{enterprise.enterprise_name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <p className="text-gray-900">{enterprise.state_name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">District</label>
                  <p className="text-gray-900">{enterprise.district_name}</p>
                </div>
                
                {enterprise.pincode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pincode</label>
                    <p className="text-gray-900">{enterprise.pincode}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                  <p className="text-gray-900">{formatDate(enterprise.registration_date)}</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Address</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                {enterprise.communication_address ? (
                  <p className="text-gray-700 leading-relaxed">
                    {enterprise.communication_address}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">Address not available</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Activities */}
          {enterprise.activities && enterprise.activities.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Business Activities & Commodities</h2>
              <div className="grid gap-4">
                {enterprise.activities.map((activity, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-mono">
                        {activity.nic_5digit_id}
                      </span>
                      <div>
                        <p className="text-gray-800 font-medium">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Additional Information</h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                This enterprise is registered under the Micro, Small and Medium Enterprises (MSME) category. 
                For more information about MSME benefits and registration, please contact the relevant authorities.
              </p>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 pt-6 border-t">
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Directory
            </Link>
          </div>
        </div>

        {/* Related Enterprises */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Other Enterprises in {enterprise.district_name}</h2>
          <p className="text-gray-600">
            Explore more MSME enterprises in {enterprise.district_name}, {enterprise.state_name}.
          </p>
          <Link 
            href={`/?search=${enterprise.district_name}`}
            className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium"
          >
            View all enterprises in {enterprise.district_name} →
          </Link>
        </div>
      </div>
    </div>
  )
}