import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | MSME Directory',
  description: 'Find answers to common questions about MSME registration, benefits, search functionality, and how to use our comprehensive MSME directory.',
  keywords: [
    'MSME FAQ',
    'MSME registration',
    'micro small medium enterprises',
    'MSME benefits',
    'business directory',
    'enterprise search'
  ]
}

const faqData = [
  {
    category: "MSME Registration",
    questions: [
      {
        question: "What is MSME registration?",
        answer: "MSME (Micro, Small and Medium Enterprises) registration is a government recognition system that classifies businesses based on their investment and turnover. It provides various benefits including easier loans, subsidies, and government scheme access."
      },
      {
        question: "Who can register for MSME?",
        answer: "Any individual, proprietorship, partnership, company, cooperative society, or any other legal entity engaged in manufacturing or service activities can register for MSME. There are specific investment and turnover criteria for micro, small, and medium categories."
      },
      {
        question: "What are the benefits of MSME registration?",
        answer: "Benefits include: Priority lending from banks, Lower interest rates, Collateral-free loans up to ₹1 crore, Protection against delayed payments, Various government subsidies and schemes, Preference in government tenders, and Tax benefits."
      },
      {
        question: "How long does MSME registration take?",
        answer: "Online MSME registration typically takes 7-15 working days. The process involves document verification and approval by the concerned authorities."
      }
    ]
  },
  {
    category: "Using This Directory",
    questions: [
      {
        question: "How to search for enterprises in this directory?",
        answer: "Use the search box on the homepage to search by company name, state, district, or location. The search will show relevant enterprises matching your query with their basic details."
      },
      {
        question: "How accurate is the information in this directory?",
        answer: "Our directory contains officially registered MSME data from government sources. However, we recommend verifying current details directly with the enterprises as information may change over time."
      },
      {
        question: "Can I add my enterprise to this directory?",
        answer: "This directory contains enterprises from official MSME registration data. If your enterprise is registered with MSME authorities, it should appear in our listings during our regular data updates."
      },
      {
        question: "Is this directory free to use?",
        answer: "Yes, searching and viewing enterprise information in our directory is completely free. We aim to provide easy access to MSME information for everyone."
      }
    ]
  },
  {
    category: "MSME Categories",
    questions: [
      {
        question: "What is the difference between Micro, Small, and Medium enterprises?",
        answer: "Classification is based on investment and turnover: Micro - Investment ≤ ₹1 crore, Turnover ≤ ₹5 crore. Small - Investment ≤ ₹10 crore, Turnover ≤ ₹50 crore. Medium - Investment ≤ ₹50 crore, Turnover ≤ ₹250 crore."
      },
      {
        question: "Can I change my MSME category?",
        answer: "Yes, if your investment or turnover increases and you qualify for a higher category, you can apply for reclassification during your annual filing or renewal process."
      },
      {
        question: "What documents are required for MSME registration?",
        answer: "Required documents include: Aadhaar card of owner/authorized signatory, PAN card of business, Bank account details, Business address proof, Partnership deed (if applicable), and Details of business activity."
      }
    ]
  },
  {
    category: "Government Schemes",
    questions: [
      {
        question: "What government schemes are available for MSMEs?",
        answer: "Major schemes include: Prime Minister's Employment Generation Programme (PMEGP), Credit Guarantee Trust Fund (CGTMSE), Technology Upgradation Fund Scheme (TUFS), and various state-specific subsidy schemes."
      },
      {
        question: "How to apply for government subsidies?",
        answer: "Apply through official portals like udyamregistration.gov.in or visit your local DIC (District Industries Centre). Most applications are now online with document upload facility."
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900">FAQ</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-100">
            Everything you need to know about MSME registration and our directory
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-3 border-b">
                {category.category}
              </h2>
              <div className="space-y-6">
                {category.questions.map((faq, questionIndex) => (
                  <div key={questionIndex} className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find what you&apos;re looking for? Visit the official MSME portal for more information.
          </p>
          <div className="space-y-4">
            <a
              href="https://udyamregistration.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              Official MSME Portal
            </a>
            <Link
              href="/"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Directory
            </Link>
          </div>
        </div>
      </div>

      {/* Schema.org JSON-LD for FAQ SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.flatMap(category =>
              category.questions.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            )
          })
        }}
      />
    </div>
  )
}