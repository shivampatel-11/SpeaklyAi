export interface ISpeechService {
  startListening(onResult: (transcript: string, isFinal: boolean) => void, onError: (err: string) => void): void
  stopListening(): void
  speakText(text: string, onEnd?: () => void): void
  cancelSpeech(): void
  isSupported(): boolean
}

class BrowserSpeechService implements ISpeechService {
  private activeRecognition: any = null
  private synthesis: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null
  private isListeningActive = false

  isSupported(): boolean {
    if (typeof window === 'undefined') return false
    return Boolean(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      window.speechSynthesis
    )
  }

  async startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: string) => void
  ): Promise<void> {
    if (typeof window === 'undefined') return

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    // Explicitly request microphone stream permission from browser
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        // Release stream track after permission check so recognition can access it
        stream.getTracks().forEach((track) => track.stop())
      } catch (err: any) {
        console.warn('Microphone permission not granted:', err)
        onError('Microphone permission denied. Please allow microphone access in your browser.')
        return
      }
    }

    try {
      // Always create a fresh instance per session to avoid Chromium InvalidStateError
      if (this.activeRecognition) {
        try {
          this.activeRecognition.abort()
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      this.isListeningActive = true
      this.activeRecognition = recognition

      recognition.onresult = (event: any) => {
        let interim = ''
        let final = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i]
          if (item.isFinal) {
            final += item[0].transcript
          } else {
            interim += item[0].transcript
          }
        }

        const combined = (final || interim).trim()
        if (combined) {
          onResult(combined, Boolean(final))
        }
      }

      recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          // Normal silence, don't abort
          return
        }
        console.warn('Speech recognition event error:', event.error)
        onError(event.error)
      }

      recognition.onend = () => {
        this.isListeningActive = false
      }

      recognition.start()
    } catch (e: any) {
      this.isListeningActive = false
      onError(e.message || 'Error starting speech recognition')
    }
  }

  stopListening(): void {
    if (this.activeRecognition && this.isListeningActive) {
      try {
        this.activeRecognition.stop()
      } catch {
        // ignore
      }
      this.isListeningActive = false
    }
  }

  speakText(text: string, onEnd?: () => void): void {
    if (!this.synthesis) {
      onEnd?.()
      return
    }

    this.synthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.95
    utterance.pitch = 1.0

    const voices = this.synthesis.getVoices()
    const englishVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Alex'))
    )
    if (englishVoice) {
      utterance.voice = englishVoice
    }

    utterance.onend = () => {
      onEnd?.()
    }
    utterance.onerror = () => {
      onEnd?.()
    }

    this.synthesis.speak(utterance)
  }

  cancelSpeech(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }
}

export const speechService = new BrowserSpeechService()
