// Site configuration
export const siteConfig = {
  name: 'MSME Directory',
  description: 'Comprehensive directory of MSME enterprises across India',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://thepeakai.com/msme',
  basePath: '/msme',
  ogImage: '/msme/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/thepeakai',
    github: 'https://github.com/Priyeshvg/msme-directory',
    website: 'https://thepeakai.com'
  }
}