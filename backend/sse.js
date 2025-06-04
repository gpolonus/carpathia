
import 'dotenv/config';
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { generate } from 'random-words';
import multer from 'multer'
import app from './app-logic.js'

// IDEA: Write some kind of composable wrapping piece around Express that
// allows for this functionality and SSE to exist side by side.
const upload = multer()

const server = express();
const serverRouter = express.Router()

// if (process.env === 'development') {
  server.use(cors());
// }

const serverBasePath = process.env.SERVER_BASE_PATH || '/server'
console.log({ serverBasePath })
server.use(serverBasePath, serverRouter)

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

async function resetState() {
  app.resetState();
}

// Initially set the state
await resetState()

//*******
//* ENDPOINTS
//*******

serverRouter.get('/test', (req, res) => console.log('test hit') || res.send('Success!'))

serverRouter.get('/connect', cors(), (req, res) => {
  console.log('hit')
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    // 'Access-Control-Allow-Origin': '*',
    'access-control-allow-origin': '*',
    // 'X-Accel-Buffering': 'no',
  };
  res.writeHead(200, headers);

  const clientId = Date.now().toString();

  const client = {
    id: clientId,
    name: generate(2).join(' '), // For logging purposes
    res,
    send(type, data) {
      console.log(`sent '${client.name}' a ${type} message with data:`, data)
      this.res.write(`data: ${JSON.stringify({ type, data })}\n\n`)
    },
  };

  app.clientOpened(client, { ...req.query });

  client.send('clientId', { clientId })

  req.on('close', () => {
    app.clientClosed(client);
  });
});

serverRouter.get('/message', (req, res) => {
  // TODO: get angry without id and action query params
  const args = { ...req.query }
  const clientId = args.id
  const action = args.action
  const responseInstruction = app.clientMessage(clientId, action, args)

  if (typeof responseInstruction === 'array') {
    const [errorCode, message] = responseInstruction
    res.status(errorCode).send(message)
  } else if (typeof responseInstruction === 'function') {
    responseInstruction(res)
  } else {
    res.send()
  }
})

//*******
//* APP INITIALIZATION
//*******

const PORT = process.env.SERVER_PORT || 3003;
const s = server.listen(PORT, '0.0.0.0', (error) => {
  if (error) {
    throw error
  }
  console.log(`Listening on ${JSON.stringify(s.address())}`)
});

