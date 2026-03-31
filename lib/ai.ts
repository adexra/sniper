import { createAzure } from '@ai-sdk/azure'

export const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_ENDPOINT!.replace('https://', '').replace('.openai.azure.com', '').replace('.openai.azure.com/', ''),
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
})

export const model = azure(process.env.AZURE_OPENAI_DEPLOYMENT!)
