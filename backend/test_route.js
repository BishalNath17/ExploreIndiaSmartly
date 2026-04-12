const express = require('express');
const app = express();
const router = express.Router();

router.get('/', (req, res) => {
  res.send('ROOT MATCH');
});

router.get(/^\/?$/, (req, res) => {
  res.send('REGEX MATCH');
});

app.use('/api/v1', router);

app.use((req, res) => {
  res.status(404).send('Not Found Fallback');
});

const request = require('http').request;
app.listen(9999, () => {
  const req = request('http://localhost:9999/api/v1', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('GET /api/v1 ->', data);
      
      const req2 = request('http://localhost:9999/api/v1/', (res2) => {
        let data2 = '';
        res2.on('data', chunk => data2 += chunk);
        res2.on('end', () => {
          console.log('GET /api/v1/ ->', data2);
          process.exit(0);
        });
      });
      req2.end();
    });
  });
  req.end();
});
