import express from 'express'
import cors from 'cors'
import http from 'http'
import { attachWebSocketServer } from './ws/wsServer.js'
import IndexPageRouter from './routes/IndexPageRouter.js'
import CreateAccRouter from './routes/CreateAccRouter.js'
import LogInRouter from './routes/LogInRouter.js'
import RefreshRouter from './routes/RefreshRouter.js'
import LogoUploadRouter from './routes/LogoUploadRouter.js'
import AlbumUploadRouter from './routes/AlbumUploadRouter.js'
import InfoUploadRouter from './routes/InfoUploadRouter.js'
import TableUploadRouter from './routes/TableUploadRouter.js'
import AuctionUploadRouter from './routes/AuctionUploadRouter.js'
import BalanceUpdateRouter from './routes/BalanceUpdateRouter.js'
import BiddersUpdateRouter from './routes/BiddersUpdateRouter.js'
import TransformTableRouter from './routes/TransformTableRouter.js'
import FetchProfileDataRouter from './routes/FetchProfileDataRouter.js'
import SwitchLikeRouter from './routes/SwitchLikeRouter.js'
import FetchAvatarRouter from './routes/FetchAvatarRouter.js'
import FetchVenuesRouter from './routes/FetchVenuesRouter.js'
import FetchCustomersRouter from './routes/FetchCustomersRouter.js'
import NewDateRouter from './routes/NewDateRouter.js'
import ArchiveDateRouter from './routes/ArchiveDateRouter.js'
import InfoEditRouter from './routes/InfoEditRouter.js'
import { FetchAuctions } from './db/queries.js'
import LogOutRouter from './routes/LogOutRouter.js'
import verifyJWT from './middleware/verifyJWT.js'
import cookieParser from 'cookie-parser'

const app = express();

app.locals.test='TEST';

const PORT = 3000;
const HOST = '0.0.0.0'

const server = http.createServer(app);

const { broadcastAuctionsUpdated } = attachWebSocketServer(server);
app.locals.broadcastAuctionsUpdated = broadcastAuctionsUpdated;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // encodes req.body into obj
app.use(cookieParser()); // middleware for cookies

const corsOptions = {origin: ['http://localhost:5173'], credentials: true};
app.use(cors(corsOptions));

// app.use('/', IndexPageRouter);
app.use('/create_account', CreateAccRouter);
app.use('/login', LogInRouter);
app.use('/refresh', RefreshRouter);
app.use('/logout', LogOutRouter);

app.use(verifyJWT);

app.use('/logo_upload', LogoUploadRouter);
app.use('/album_upload', AlbumUploadRouter);
app.use('/info_upload', InfoUploadRouter);
app.use('/table_upload', TableUploadRouter);
app.use('/auction_upload', AuctionUploadRouter);
app.post('/auctions_update', async (req, res) => {
  try {
    const email = req.email;
    const result = await FetchAuctions(email);
    if (req.app.locals.broadcastAuctionsUpdated) {
      req.app.locals.broadcastAuctionsUpdated(result);
    };

    res.status(200).send(result);
    
  } catch (err) {
    console.log(err);
    res.status(500).send('AUCTIONS UPDATE CONTROLLER ERROR');
  }
});
app.use('/balance_update', BalanceUpdateRouter);
app.use('/bidders_update', BiddersUpdateRouter);
app.use('/transform_table', TransformTableRouter);
app.use('/fetch_profile_data', FetchProfileDataRouter);
app.use('/switch_like', SwitchLikeRouter);
app.use('/fetch_avatar', FetchAvatarRouter);
app.use('/fetch_venues', FetchVenuesRouter);
app.use('/fetch_customers', FetchCustomersRouter);
app.use('/new_date', NewDateRouter);
app.use('/archive_date', ArchiveDateRouter);
app.use('/info_edit', InfoEditRouter);

server.listen(PORT, HOST, (error) => {  
  if (error) {console.error(error)}
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;  
  console.log(`Server is running on ${baseUrl}`);
  console.log(`WebSocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`);
});