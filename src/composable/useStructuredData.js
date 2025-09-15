import { ref } from 'vue'

export function useStructuredData() {
  
  // Generate product structured data
  const generateProductSchema = (product) => {
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.images || [product.image],
      "description": product.description,
      "sku": product.sku || product.id,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "SmartGear"
      },
      "category": product.category,
      "offers": {
        "@type": "Offer",
        "url": `https://smartgear.sunneng.site/productdetail/${product.id}`,
        "priceCurrency": "USD",
        "price": product.price,
        "priceValidUntil": "2025-12-31",
        "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "SmartGear"
        }
      },
      "aggregateRating": product.rating ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount || 1,
        "bestRating": 5,
        "worstRating": 1
      } : undefined
    }
  }

  // Generate breadcrumb structured data
  const generateBreadcrumbSchema = (breadcrumbs) => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    }
  }

  // Generate organization structured data
  const generateOrganizationSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SmartGear",
      "url": "https://smartgear.sunneng.site",
      "logo": "https://smartgear.sunneng.site/src/assets/image/Logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-SMARTGEAR",
        "contactType": "customer service",
        "availableLanguage": "en"
      },
      "sameAs": [
        "https://facebook.com/smartgear",
        "https://twitter.com/smartgear",
        "https://instagram.com/smartgear"
      ]
    }
  }

  // Generate website structured data
  const generateWebsiteSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SmartGear",
      "url": "https://smartgear.sunneng.site",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://smartgear.sunneng.site/products?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  }

  // Generate FAQ structured data
  const generateFAQSchema = (faqs) => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  }

  // Generate review structured data
  const generateReviewSchema = (reviews, product) => {
    return reviews.map(review => ({
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "Product",
        "name": product.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewBody": review.comment,
      "datePublished": review.date
    }))
  }

  // Inject structured data into the page
  const injectStructuredData = (schemaData, id = 'structured-data') => {
    // Remove existing structured data with the same id
    const existingScript = document.getElementById(id)
    if (existingScript) {
      existingScript.remove()
    }

    // Create new script tag
    const script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schemaData)
    
    // Append to head
    document.head.appendChild(script)
  }

  // Remove structured data
  const removeStructuredData = (id = 'structured-data') => {
    const script = document.getElementById(id)
    if (script) {
      script.remove()
    }
  }

  return {
    generateProductSchema,
    generateBreadcrumbSchema,
    generateOrganizationSchema,
    generateWebsiteSchema,
    generateFAQSchema,
    generateReviewSchema,
    injectStructuredData,
    removeStructuredData
  }
}
