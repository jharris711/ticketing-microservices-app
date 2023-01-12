import express, { json } from 'express';

const port = process.env.PORT || 3000;

const app = express();
app.use(json());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
