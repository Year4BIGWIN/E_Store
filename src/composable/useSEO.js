import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useSEO() {
  const route = useRoute()

  // Default SEO values
  const defaultSEO = {
    title: 'SmartGear - Premium Electronics & Tech Store | Best Deals Online',
    description: 'Shop premium electronics, smartphones, gadgets, and tech accessories at SmartGear. Get the best deals on top brands with fast shipping and excellent customer service.',
    keywords: 'electronics store, smartphones, gadgets, tech accessories, online electronics, mobile phones, tablets, headphones, smart devices',
    image: '/src/assets/image/Logo.png',
    url: 'https://smartgear.sunneng.site'
  }

  const seo = ref({ ...defaultSEO })

  // Update document title and meta tags
  const updateSEO = (newSEO) => {
    seo.value = { ...defaultSEO, ...newSEO }

    // Update title
    document.title = seo.value.title

    // Update meta description
    updateMetaTag('name', 'description', seo.value.description)
    updateMetaTag('name', 'keywords', seo.value.keywords)

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', seo.value.title)
    updateMetaTag('property', 'og:description', seo.value.description)
    updateMetaTag('property', 'og:image', seo.value.image)
    updateMetaTag('property', 'og:url', seo.value.url)

    // Update Twitter tags
    updateMetaTag('property', 'twitter:title', seo.value.title)
    updateMetaTag('property', 'twitter:description', seo.value.description)
    updateMetaTag('property', 'twitter:image', seo.value.image)
    updateMetaTag('property', 'twitter:url', seo.value.url)

    // Update canonical URL
    updateCanonical(seo.value.url)
  }

  const updateMetaTag = (attribute, attributeValue, content) => {
    let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`)
    
    if (element) {
      element.setAttribute('content', content)
    } else {
      element = document.createElement('meta')
      element.setAttribute(attribute, attributeValue)
      element.setAttribute('content', content)
      document.getElementsByTagName('head')[0].appendChild(element)
    }
  }

  const updateCanonical = (url) => {
    let canonical = document.querySelector('link[rel="canonical"]')
    
    if (canonical) {
      canonical.setAttribute('href', url)
    } else {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      canonical.setAttribute('href', url)
      document.getElementsByTagName('head')[0].appendChild(canonical)
    }
  }

  // Page-specific SEO configurations
  const pageSEOConfig = {
    '/': {
      title: 'SmartGear - Premium Electronics & Tech Store | Best Deals Online',
      description: 'Shop premium electronics, smartphones, gadgets, and tech accessories at SmartGear. Get the best deals on top brands with fast shipping and excellent customer service.',
      keywords: 'electronics store, smartphones, gadgets, tech accessories, online electronics, mobile phones, tablets, headphones, smart devices',
      url: 'https://smartgear.sunneng.site/'
    },
    '/products': {
      title: 'All Products - SmartGear Electronics Store',
      description: 'Browse our complete collection of electronics, smartphones, tablets, headphones, and tech accessories. Find the perfect gadget at SmartGear.',
      keywords: 'all electronics, product catalog, smartphones, tablets, headphones, tech accessories, gadgets',
      url: 'https://smartgear.sunneng.site/products'
    },
    '/about': {
      title: 'About SmartGear - Your Trusted Electronics Partner',
      description: 'Learn about SmartGear\'s mission to provide premium electronics and exceptional customer service. Discover our story and commitment to quality.',
      keywords: 'about smartgear, electronics company, tech store, customer service',
      url: 'https://smartgear.sunneng.site/about'
    }
  }

  // Watch for route changes and update SEO
  watch(() => route?.path, (newPath) => {
    if (newPath) {
      const pageConfig = pageSEOConfig[newPath] || {}
      updateSEO(pageConfig)
    }
  }, { immediate: true })

  // Method to set SEO for dynamic pages (like product details)
  const setSEO = (customSEO) => {
    updateSEO(customSEO)
  }

  // Method to generate product detail SEO
  const setProductSEO = (product) => {
    if (!product) return

    const productSEO = {
      title: `${product.name} - SmartGear Electronics`,
      description: `Buy ${product.name} at SmartGear. ${product.description || 'Premium quality electronics with fast shipping and excellent customer service.'}`,
      keywords: `${product.name}, ${product.brand || 'electronics'}, ${product.category || 'gadgets'}, buy online`,
      image: product.image || '/src/assets/image/Logo.png',
      url: `https://smartgear.sunneng.site/productdetail/${product.id}`
    }
    
    updateSEO(productSEO)
  }

  return {
    seo: seo.value,
    setSEO,
    setProductSEO,
    updateSEO
  }
}
