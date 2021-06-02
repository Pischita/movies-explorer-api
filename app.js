const express = require('express');

const app = express();
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

// app.use('/users', userRouter);

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Work on port  ${PORT}`);
});
