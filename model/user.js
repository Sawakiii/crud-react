// マングースのインポート
const mongoose = require('mongoose')

// スキーマ(データ型)の定義
const UserSchema = new mongoose.Schema ({
    name: String,
    age: Number
})

// モデルを作成(検索などの処理ができる形にする)
const User = mongoose.model("User", UserSchema) // => 第一引数はモデルの単数形

// Userモデルのエクスポート
module.exports = User