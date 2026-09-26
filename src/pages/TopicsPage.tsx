import React, { useState } from 'react'
import { PracticeTopic } from '@/types'
import { TopicCard } from '@/features/practice/TopicCard'
import { MOCK_TOPICS } from '@/config/site'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopicsPageProps {
  onSelectTopic: (topic: PracticeTopic) => void
  currentTopicId?: string
}

export const TopicsPage: React.FC<TopicsPageProps> = ({
  onSelectTopic,
  currentTopicId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Casual', 'Professional', 'Travel', 'Academic']

  const filteredTopics =
    selectedCategory === 'All'
      ? MOCK_TOPICS
      : MOCK_TOPICS.filter((t) => t.category === selectedCategory)

  return (
    <div className="space-y-4 pt-2">
      <div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-World Scenarios</span>
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Choose a Conversation</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Pick a situation you want to practice for work, travel, or everyday life.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 select-none focus:outline-none',
              selectedCategory === cat
                ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topics list */}
      <div className="space-y-2.5">
        {filteredTopics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            isActive={currentTopicId === topic.id}
            onSelect={onSelectTopic}
          />
        ))}
      </div>
    </div>
  )
}
