# MSME Directory Integration with thepeakai.com

## Option 1: Subdomain Integration (Recommended)
Set up `msme.thepeakai.com` to point to your MSME directory.

### DNS Setup:
1. Add CNAME record in your DNS provider:
   ```
   msme.thepeakai.com → cname.vercel-dns.com
   ```

2. In Vercel dashboard:
   - Go to msme-directory project → Settings → Domains
   - Add custom domain: `msme.thepeakai.com`
   - Update environment variables to use new domain

### Benefits:
- SEO: Inherits domain authority from thepeakai.com
- Branding: Appears as part of your main website
- SSL: Automatic HTTPS certificate

## Option 2: Main Website Integration
Embed MSME directory as a section in thepeakai.com

### Implementation:
1. **API Endpoints**: Create API routes in MSME directory
2. **Widget Integration**: Build searchable widget for main site
3. **Deep Linking**: Link from main site to full directory

## Option 3: Reverse Proxy (Advanced)
Set up thepeakai.com/msme/ to proxy to msme-directory.vercel.app

### SEO Updates Needed:
1. Update sitemap.ts to use new domain
2. Update metadata in layout.tsx
3. Update structured data URLs
4. Submit new sitemap to Google Search Console

## Recommended Next Steps:
1. Choose Option 1 (subdomain) for fastest implementation
2. Update all URLs in the code to use msme.thepeakai.com
3. Set up Google Analytics tracking
4. Submit to search engines

Would you like me to implement any of these options?