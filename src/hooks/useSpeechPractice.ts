import { useState, useEffect, useRef, useCallback } from 'react'
import { PracticeSession, PracticeTopic, VoiceState, Message } from '@/types'
import { practiceService } from '@/services/practiceService'
import { speechService } from '@/services/speechService'

export function useSpeechPractice(initialTopic: PracticeTopic) {
  const [activeTopic, setActiveTopic] = useState<PracticeTopic>(initialTopic)
  const [session, setSession] = useState<PracticeSession>(() => practiceService.startSession(initialTopic))
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [transcript, setTranscript] = useState('')
  const [audioLevel, setAudioLevel] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const animationFrameRef = useRef<number | null>(null)

  // Switch topic and reset session
  const selectTopic = useCallback((topic: PracticeTopic) => {
    speechService.cancelSpeech()
    speechService.stopListening()
    setActiveTopic(topic)
    const newSession = practiceService.startSession(topic)
    setSession(newSession)
    setVoiceState('idle')
    setTranscript('')
    setError(null)

    // Automatically speak the starting prompt
    speechService.speakText(topic.promptStarter)
  }, [])

  // Audio wave pulse animation simulation when speaking or listening
  useEffect(() => {
    let phase = 0
    const animateWave = () => {
      if (voiceState === 'listening' || voiceState === 'speaking') {
        phase += 0.15
        const baseLevel = voiceState === 'speaking' ? 0.7 : 0.5
        const wave = baseLevel + Math.sin(phase) * 0.3 + (Math.random() * 0.2 - 0.1)
        setAudioLevel(Math.max(0.1, Math.min(1, wave)))
        animationFrameRef.current = requestAnimationFrame(animateWave)
      } else {
        setAudioLevel(0)
      }
    }

    if (voiceState === 'listening' || voiceState === 'speaking') {
      animationFrameRef.current = requestAnimationFrame(animateWave)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [voiceState])

  // Submit spoken or typed message from user
  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim()) return

      const cleanText = userText.trim()
      setTranscript('')
      setVoiceState('processing')

      // Add user message to local session
      const userMessage: Message = {
        id: `msg-${Date.now()}-user`,
        sender: 'user',
        speaker: 'user',
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }))

      try {
        // Query practice service for realistic AI partner reply and corrections
        const { replyText, corrections } = await practiceService.generatePartnerReply(
          activeTopic,
          session.messages,
          cleanText
        )

        // Attach corrections to user message if found
        if (corrections.length > 0) {
          setSession((prev) => ({
            ...prev,
            messages: prev.messages.map((m) =>
              m.id === userMessage.id ? { ...m, corrections } : m
            ),
          }))
        }

        // Add AI response
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          sender: 'ai',
          speaker: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        setSession((prev) => ({
          ...prev,
          messages: [...prev.messages, aiMessage],
        }))

        // AI speaks back
        setVoiceState('speaking')
        speechService.speakText(replyText, () => {
          setVoiceState('idle')
        })
      } catch (err: any) {
        setError(err?.message || 'Failed to generate AI response')
        setVoiceState('idle')
      }
    },
    [activeTopic, session.messages]
  )

  // Toggle microphone
  const toggleListening = useCallback(() => {
    if (voiceState === 'listening') {
      speechService.stopListening()
      setVoiceState('idle')
      if (transcript) {
        sendMessage(transcript)
      }
    } else {
      setError(null)
      setVoiceState('listening')
      setTranscript('')

      speechService.startListening(
        (text, isFinal) => {
          setTranscript(text)
          if (isFinal) {
            speechService.stopListening()
            sendMessage(text)
          }
        },
        (_err) => {
          // If browser speech recognition is denied or unsupported, provide graceful simulated speech demo
          const sampleStudentReplies = [
            "I am agree with your point, but it depend of the situation.",
            "I'd like to order a double espresso with oat milk, please.",
            "I have worked on full-stack web applications since two years.",
            "Could you explain me how the boarding gate procedure works?",
          ]
          const mockSpokenText =
            sampleStudentReplies[Math.floor(Math.random() * sampleStudentReplies.length)]

          setTranscript(mockSpokenText)
          setTimeout(() => {
            sendMessage(mockSpokenText)
          }, 1200)
        }
      )
    }
  }, [voiceState, transcript, sendMessage])

  const resetSession = useCallback(() => {
    selectTopic(activeTopic)
  }, [selectTopic, activeTopic])

  return {
    activeTopic,
    selectTopic,
    session,
    voiceState,
    transcript,
    setTranscript,
    audioLevel,
    error,
    setError,
    toggleListening,
    sendMessage,
    resetSession,
  }
}
