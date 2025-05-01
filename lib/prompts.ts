const journalPrompts = [
  "What made you smile today?",
  "What's something you learned recently that surprised you?",
  "Describe a challenge you're currently facing and one step you could take toward resolving it.",
  "What are three things you're grateful for today?",
  "If you could give advice to yourself from a year ago, what would you say?",
  "What's something you're looking forward to in the coming weeks?",
  "Describe a moment when you felt proud of yourself recently.",
  "What's a habit you'd like to develop or improve?",
  "Reflect on a conversation that impacted you recently. What made it meaningful?",
  "What's something that brought you peace today?",
  "If you could change one thing about your day, what would it be?",
  "What's a small win you experienced recently?",
  "Describe your ideal day. How close was today to that ideal?",
  "What's something you need to let go of?",
  "What's a boundary you need to set or maintain?",
  "Describe a place where you feel completely at peace.",
  "What's something you've been avoiding that you should address?",
  "What does self-care mean to you right now?",
  "Reflect on a mistake you made recently. What did you learn?",
  "What's a quality you appreciate about yourself?",
  "How have you grown in the past year?",
  "What's a fear you'd like to overcome?",
  "Describe a relationship that's important to you and why.",
  "What's something you're curious about right now?",
  "If you had an extra hour in your day, how would you spend it?",
]

export function generatePrompt(): string {
  const randomIndex = Math.floor(Math.random() * journalPrompts.length)
  return journalPrompts[randomIndex]
}
