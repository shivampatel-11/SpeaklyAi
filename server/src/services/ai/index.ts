import { AIService } from './aiService.interface.js'
import { GeminiAIProvider } from './geminiProvider.js'
import { FallbackAIProvider } from './fallbackProvider.js'
import { ENV } from '../../config/env.js'

/**
 * AI Provider Registry & Factory
 * Allows seamless hot-swapping between Gemini, OpenAI, Claude, or custom on-prem LLMs
 * without altering conversation controllers, routes, or frontend UI.
 */
class AIProviderRegistry {
  private providers: Map<string, AIService> = new Map()
  private activeProviderName: string = 'default'

  constructor() {
    // 1. Fallback linguistic provider always available
    const fallback = new FallbackAIProvider()
    this.register('fallback', fallback)

    // 2. Register Gemini provider if key is provided
    if (
      ENV.GEMINI_API_KEY &&
      ENV.GEMINI_API_KEY.trim() !== '' &&
      ENV.GEMINI_API_KEY !== 'your_gemini_api_key_here'
    ) {
      const gemini = new GeminiAIProvider(ENV.GEMINI_API_KEY, ENV.GEMINI_MODEL)
      this.register('gemini', gemini)
      this.activeProviderName = 'gemini'
    } else {
      this.activeProviderName = 'fallback'
    }
  }

  register(name: string, provider: AIService): void {
    this.providers.set(name.toLowerCase(), provider)
  }

  setActive(name: string): void {
    const key = name.toLowerCase()
    if (!this.providers.has(key)) {
      throw new Error(`AI Provider "${name}" is not registered. Available: ${Array.from(this.providers.keys()).join(', ')}`)
    }
    this.activeProviderName = key
  }

  getProvider(name?: string): AIService {
    const target = (name || this.activeProviderName).toLowerCase()
    const provider = this.providers.get(target)
    if (!provider) {
      console.warn(`[AI Registry] Provider "${target}" not found, falling back to linguistic engine`)
      return this.providers.get('fallback')!
    }
    return provider
  }

  listProviders(): string[] {
    return Array.from(this.providers.keys())
  }
}

export const aiRegistry = new AIProviderRegistry()

export function getAIService(): AIService {
  return aiRegistry.getProvider()
}

export * from './aiService.interface.js'
export * from './geminiProvider.js'
export * from './fallbackProvider.js'
