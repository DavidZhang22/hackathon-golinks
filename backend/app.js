import express from 'express';
const app=express();
const port=3001;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import github from './github.js';


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'content-type,authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.headers.origin)
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

  next();
});

app.use('/github', github);

app.all('*', (_, res) => {
  res.status(404).send({
    success: false,
    error: 'not_found'
  });
});
