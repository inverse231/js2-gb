const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('.'));
app.use(bodyParser.json());

app.get('/catalog', (req, res) => {
  fs.readFile('data/catalog.json', 'utf-8', (err, data) => {
    if (err) res.sendStatus(404);
    res.send(data);
  });
});

app.get('/cart', (req, res) => {
  fs.readFile('data/cart.json', 'utf-8', (err, data) => {
    if (err) res.sendStatus(404);
    res.send(data);
  });
});

app.post('/cart', (req, res) => {
  const item = req.body;
  fs.readFile('data/cart.json', 'utf-8', (err, data) => {
    if (err) res.sendStatus(500);
    let cart = JSON.parse(data);
    let findProduct = cart.find(elem => elem.product_name === item.product_name);
    if (!findProduct) {
      cart.push(Object.assign({}, item, { count: 1 }));
      item.count = 1;
    } else {
      findProduct.count++;
    }
    fs.writeFile('data/cart.json', JSON.stringify(cart), (err) => {
      if (err) res.sendStatus(500);
      res.sendStatus(200);
    });
  });
});

app.post('/decCount', (req, res) => {
  const item = req.body;
  fs.readFile('data/cart.json', 'utf-8', (err, data) => {
    if (err) res.sendStatus(500);
    let cart = JSON.parse(data);
    if (item.count === 1) {
      cart.splice(cart.indexOf(item), 1);
    } else {
      item.count--;
    }
    fs.writeFile('data/cart.json', JSON.stringify(cart), (err) => {
      console.log(cart);
      if (err) res.sendStatus(500);
      res.sendStatus(200);
    });
  });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
