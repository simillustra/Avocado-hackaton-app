require('module-alias/register');
const CONFIG = require('@config/config');

// Mongoose
require('./db/mongoose');

// Routes
const authRouter = require('@routes/auth');
const commonRouter = require('@routes/common');
const usersRouter = require('@routes/users');
const accountsRouter = require('@routes/accounts');
const cardRouter = require('@routes/cards');
const messageRouter = require('@routes/messages');
const transferRouter = require('@routes/transfers');
const formsRouter = require('@routes/forms');
const statsRouter = require('@routes/stats');

// Others
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const chalk = require('chalk');

// Middlewares
const auth = require('@middleware/auth');
const errorHandler = require('@middleware/error-handler');
// const maintenance = require('@middleware/maintenance');

// Utilities
const createDummyData = require('@util/dummy-data');

// App
const app = express();

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());

// CORS
app.use(cors());

// Maintenance mode
// app.use(maintenance());

// Routes
// No auth required routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/common', commonRouter);

// Verify JWT and add user data to next requests
app.use(auth);

// Auth routes
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/accounts', accountsRouter);
app.use('/api/v1/cards', cardRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/transfers', transferRouter);
app.use('/api/v1/forms', formsRouter);
app.use('/api/v1/stats', statsRouter);

// Handle errors only in development
if (process.env.NODE_ENV === 'development') {
   app.use(errorHandler);
} else {
   app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).send('Server Error');
   });
}

// Start the app
app.listen(CONFIG.port, async () => {
   console.log(
      '%s App is running at http://localhost:%d in %s mode',
      chalk.green('✓'),
      process.env.PORT,
      process.env.NODE_ENV
   );

   console.log('  Press CTRL-C to stop\n');

   // await createDummyData();
});

module.exports = app;
