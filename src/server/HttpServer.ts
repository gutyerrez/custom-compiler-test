import express, { Response } from 'express'

const application = express()

application.get('/', async (_, response: Response) => {
  return response.json({ message: 'Hello =)' })
})

application.listen(3333, () => console.log('🚀 server is running!'))