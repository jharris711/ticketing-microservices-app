import express, { json } from 'express';

const port = process.env.PORT || 3000;

const app = express();
app.use(json());

app.get(`/api/users/currentuser`, (req, res) => {
  res.send(`Hi there!`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
