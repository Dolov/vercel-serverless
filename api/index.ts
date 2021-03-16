const https = require('https') 
import { VercelRequest, VercelResponse } from '@vercel/node'

const fetchUrlContent = (url, headers?) => {
  return new Promise((resolve) => {
    https.get(url, {
      headers,
    }, (res) => {
      let html = ''
  
      res.on('data', (data) => {
        html += data
      })
  
      res.on('end', () => {
        resolve(html)
      })
    })
  })
}

export default async (request: VercelRequest, response: VercelResponse) => {
  const { q } = request.query
	if (!q) {
		response.status(200).send('nothing')
	}
	response.setHeader('Access-Control-Allow-Origin', '*')
	response.setHeader('Access-Control-Allow-Credentials', 'true')
	const html = await fetchUrlContent(`https://www.npmjs.com/search/suggestions?q=${q}`)

  response.status(200).send(html)
}