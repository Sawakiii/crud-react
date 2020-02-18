// expressのインポート(nodeのインポートはrequireを使う)
const express = require('express')
//mongooseのインポート
const mongoose = require('mongoose')
// Userモデルのインポート
const User = require('./model/user')

// ミドルウェアのインポート
const bodyParser = require('body-parser')

// サーバを作成
const app = express()
const port = 3001 // ポート番号を指定

// urlとDB名を記述する
const url = "mongodb://localhost/appDb"

// ミドルウェアのセットアップ
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// mongodbとの接続
mongoose.connect(url, err=>{
    if (err) {console.error(new Error(err))}
    console.log(`サーバはデータベースに接続しました`)

    // ここにHTTPメソッドをapp.post(url, (request, response)=>{})等の形で書いていく。
    app.post("/api/user", (req, res)=>{
        console.log("postが送られました")
        console.log(req.body) // 送ったデータはreq.bodyで取り出せる
        // モデルのインスタンス.save()でデータを保存できる
        new User({
            name: req.body.name,
            age: req.body.age
        }).save(err=>{ 
            if (err) res.status(500).send() //サーバサイドでエラーが出た場合は、status(500)にして送る。
            res.status(200).send(`${req.body.name}のデータを作成`)
        })
    })

    // 接続している時にサーバを立てる。
    app.listen(port, err => {
        if (err) {
            throw new Error(err)
        }
        console.log(`listening on port ${port}`)
    })
})


