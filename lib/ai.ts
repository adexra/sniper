import { createAzure } from '@ai-sdk/azure'

const resourceName = process.env.AZURE_OPENAI_ENDPOINT!
  .replace('https://', '')
  .replace('.openai.azure.com', '')
  .replace('.openai.azure.com/', '')

export const azure = createAzure({
  resourceName,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? '2025-01-01-preview',
})

// Default to mini for extraction (fast), full for pitch strategy (quality)
export const model = azure(process.env.AZURE_OPENAI_DEPLOYMENT_MINI ?? 'gpt-4o-mini')
export const modelFull = azure(process.env.AZURE_OPENAI_DEPLOYMENT_FULL ?? 'gpt-4o')
