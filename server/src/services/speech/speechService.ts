export interface ISpeechBackendService {
  sanitizeTranscript(transcript: string): string
  getAudioConfig(): { rate: number; lang: string }
}

export class SpeechBackendService implements ISpeechBackendService {
  sanitizeTranscript(transcript: string): string {
    return transcript.trim().replace(/\s+/g, ' ')
  }

  getAudioConfig(): { rate: number; lang: string } {
    return {
      rate: 0.95,
      lang: 'en-US',
    }
  }
}

export const speechBackendService = new SpeechBackendService()
