const https = require('https') 
import { VercelRequest, VercelResponse } from '@vercel/node'
import cheerio from 'cheerio'

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
	const html = await fetchUrlContent(`https://www.npmjs.com/package/${q}`)
	const $ = cheerio.load(html)

	console.log('开始解析')
	const responseJson: {
		Homepage?: string;
		Repository?: string;
		Github1s?: string;
	} = {

	}
	$('h3').each(function() {
		if ($(this).text() === 'Homepage') {
			const Homepage = $(this).parent().find('a').attr('href')
			responseJson.Homepage = Homepage
		}

		if ($(this).text() === 'Repository') {
			const Repository = $(this).parent().find('a').attr('href')
			responseJson.Repository = Repository
			responseJson.Github1s = Repository.replace('github', 'github1s')
		}
	})
  response.status(200).send(responseJson)
}