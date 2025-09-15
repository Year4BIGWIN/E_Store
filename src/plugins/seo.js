// SEO Plugin for Vue
import { useSEO } from '../composable/useSEO'
import { useStructuredData } from '../composable/useStructuredData'

export default {
  install(app) {
    // Make SEO composables globally available
    app.config.globalProperties.$seo = useSEO()
    app.config.globalProperties.$structuredData = useStructuredData()
    
    // Provide for composition API
    app.provide('seo', useSEO())
    app.provide('structuredData', useStructuredData())
  }
}
