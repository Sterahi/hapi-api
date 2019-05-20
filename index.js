const hapi = require('hapi')
const mongoose = require('mongoose')

/**
 * GraphQL shenanigans
 */
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi')
const schema = require('./graphql/schema')
/**
 * Swagger Section
 */
const Inert = require('inert')
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('./package')
/**
 * Models
 */
const Painting = require('./models/Painting')
mongoose.connect('mongodb://localhost:27017/modern-api', {useNewUrlParser: true})

mongoose.connection.once('open', () => {
    console.log('connected to db')
})

var port = 4000

const server = hapi.server({
    port: port,
    host: 'localhost'
})

const init = async () => {
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Painting API Documentation',
                    version: Pack.version
                }
            }
        }
    ])
	await server.register({
		plugin: graphiqlHapi,
		options: {
			path: '/graphiql',
			graphiqlOptions: {
				endpointURL: '/graphql'
			},
			route: {
				cors: true
			}
		}
	})

	await server.register({
		plugin: graphqlHapi,
		options: {
			path: '/graphql',
			graphqlOptions: {
				schema
			},
			route: {
				cors: true
			}
		}
	})

    server.route([
        {
            method: "GET",
            path: '/',
            handler: (request, reply) => {
                return `<h1>Modern API</h1>`
            }
        }, {
            method: "GET",
            path: '/api/v1/paintings',
            config: {
                description: 'Get all paintings',
                tags: ['api', 'v1', 'painting']
            },
            handler: (req, reply) => {
                return Painting.find()
            }
        }, {
            method: "POST",
            path: '/api/v1/paintings',
            config: {
                description: 'Create new painting',
                tags: ['api', 'v1', 'painting']
            },
            handler: (req, reply) => {
                const { name, url, techniques } = req.payload
                const painting = new Painting({
                    name,
                    url,
                    techniques
                })
                return painting.save()
            }
        }
    ])
    await server.start()
    console.log(`Server running at: ${port}`)
}

init()
