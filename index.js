const { Pool } = require('pg')
const express = require('express')
const app = express()
const port = 3000

query = `
        select 
            date_trunc('minute', to_timestamp(block_timestamp/1000/1000/1000)) as time,
            signer_account_id as signer,
            receiver_account_id as receiver
        from 
            transactions t
        where
            receiver_account_id = 'coin-flip.woothugg.near'
        `

app.get('/', (req, result) => {

    const pool = new Pool({
        user: 'public_readonly',
        host: 'mainnet.db.explorer.indexer.near.dev',
        database: 'mainnet_explorer',
        password: 'nearprotocol',
    })

    pool.query(query, (err, res) => {
        let arr = res.rows.filter((val)=>val.receiver === 'coin-flip.woothugg.near').map((val)=>val.signer).filter((val)=>val !== 'coin-flip.woothugg.near')
        const counts = {};
    
        for (const num of arr) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        console.log(counts)
    
        let items = Object.keys(counts).map(function(key) {
            return [key, counts[key]];
        });
        
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
    
        console.log(items);
        
        pool.end() 
        result.json(items);
    })
})

app.listen(process.env.PORT | port, () => {
  console.log(`Example app listening on port ${port}`)
})