import { openai } from './lib/openai'

async function askGPT() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, who are you?' },
      ],
    })

    console.log('GPT-4 Says:', response.choices[0].message.content)
  } catch (error) {
    console.error('OpenAI Error:', error)
  }                                                                                                                           
}

askGPT()                                                                                                                                                                              