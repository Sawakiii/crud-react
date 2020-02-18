
この資料では、React学習者がexpressとmongoとnode.jsを用いて、MERN環境でサーバとの通信とCRUDの基本をマスターできるまでを記述する。
基本的なサーバとクライアントの通信は以下の手順になる。

1. クライアント側からHTTPメソッドを用いてサーバ側にデータを送る
1. サーバ側がそのデータを元にデータベースと接続し、処理を行う
1. サーバがデータベースの処理の結果を返す


# 事前に必要なもの
mongodb, node, yarnのインストール。
Reactの知識。

mongodbのインストール。↓を参照
https://kageura.hatenadiary.jp/entry/2018/01/09/Windows%E7%89%88MongoDB%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%83%BBMongoShell%E3%82%92%E9%80%9A%E3%81%97%E3%81%A6CRUD%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%82%92%E6%89%93


# 参考ドキュメント

https://qiita.com/muijp/items/573247b12ff0bc4e5d3c

mdn公式ドキュメント↓
https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/mongoose


# 環境構築
サーバと通信する簡単なReactアプリを作成する。
今回の内容は、appディレクトリという名前で作成する。

まず、appディレクトリを作成し、ターミナルから以下を入力する。

```
yarn init -y
yarn add express
yarn add mongoose
yarn add body-parser
```

サーバ側のパッケージはこれで十分である。

次に、クライアントサイドの準備をする。
appディレクトリ内のターミナルで、

```
yarn create react-app client
```

を実行する。

ここまでで、もしappディレクトリをgitにプッシュすると、client内が閲覧できなくなった場合は、以下のサイトを参照しよう。
https://teratail.com/questions/202145

```
cd client
yarn start
```

で動作するか確認する。サーバが立ち上がれば動作している。

# クライアント側アプリの作成

今回作成するアプリは、名前と年齢を入力して、それらの組み合わせをデータとしてデータベースに保存するものとする。
以下の機能をつける。

- データベース上のデータの一覧を見れる機能
- データベース上に新しいデータを追加する機能
- データベース上のデータを消す機能
- データベース上のデータを更新する機能

それでは、そのためのコードをクライアント側から書いていこう。
まず、フロント用のサーバとサーバ側のサーバ2つが通信するため、サーバ側のサーバをlocalhostの3001番に立てるのを認識させるため、
client/package.jsonに以下を記入しよう。

```
"proxy" : "http://localhost:3001/",
```

client/src/App.jsに以下を記入する。

```App.js
import React from 'react';
import Form from "./Form"
import List from "./List"

const App = () => {
  const [users, setUsers] = React.useState([
    {
      name: "sawaki",
      age: 100
    }
  ])
  // データを取得する機能
  const handleFetchData = () =>{
  }

  return (
    <>
    <Form setUsers={setUsers}></Form>
    <button onClick={handleFetchData}>一覧取得</button>
    <List users={users} setUsers={setUsers}></List>
    </>
  )

}

export default App;

```

src内に追加用のForm.jsを作成し、以下を記入する。

```Form.js
import React from "react"

const Form = () => {
    // データを追加する機能
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <form onSubmit={(e)=>{handleSubmit(e)}}>
            <input type="text" name="name" />
            <input type="number" name="age" />
            <button type="submit">submit</button>
        </form>
    )
}

export default Form
```

src内にList.jsを作成し、以下を記入する。

```
import React from "react"

const List = (props) => {
    // データを削除する機能
    const handleDelete = () => {

    }

    const users = props.users.map((user)=>{
        return (
        <li>
            <h3>名前 : {user.name}</h3>
            <h3>メール : {user.age}</h3>
            <button onClick={handleDelete}>delete</button>
        </li>
        )
    })
    return (
       <ul>
           {users}
       </ul>
    )
}

export default List
```

あとは、サーバとデータの通信を行う処理を書いていくだけである。

# サーバ側の準備

まず、サーバの処理を書くために、appディレクトリ内にserver.jsを作成する。
基本的に、これからサーバ側のサーバを起動する際はターミナルで以下を入力する。

```
node server.js
```

expressはサーバ関係を担当してくれる。
サーバは、expressを使うことで立てることができる。
以下を、server.jsに記述しよう。

```server.js
// expressのインポート(nodeのインポートはrequireを使う)
const express = require('express')
// ミドルウェアのインポート
const bodyParser = require('body-parser')

// サーバを作成
const app = express()
const port = 3001 // ポート番号を指定

// ミドルウェアのセットアップ
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// サーバを立てる。
app.listen(port, err => {
    if (err) {
        throw new Error(err)
    }
    console.log(`listening on port ${port}`)
})
```

これでnode server.jsをターミナルで実行すると、listening on port 3001が表示されるはずだ。
ただ、まだサーバを立てることしかできていないのでサーバを停止しよう。(ctrl + c)

データベース関連は、mongodb, mongooseを使う。
次に、データベースのデータの型を規定するためのモデル(スキーマ)を作成する。
appディレクトリ内に、model/user.jsを作成する。
user.js内に以下を記述しよう。

```user.js
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
```

ここで作成したデータモデルはサーバ作動してデータベースに接続する時に使うので、server.jsにインポートする。

```diff
// expressのインポート(nodeのインポートはrequireを使う)
const express = require('express')

+ // Userモデルのインポート
+ const User = require('./model/user')


// ミドルウェアのインポート
：
```

次に、mongodbのデータベースに接続する必要がある。
mongodbとサーバの接続は、

```
mongoose.connect(url, err=>{})
```

を使うことで可能になる。
第一引数のurlは、"mongodb://localhost/DB名"となる。
第二引数の関数の間だけmongodbと接続できるので、その関数内にデータベースをいじる処理は全て書いていく。
まずは、接続を確認する内容をコンソールに表示する。
server.jsは以下のようになる。

```diff
// expressのインポート(nodeのインポートはrequireを使う)
const express = require('express')
+ //mongooseのインポート
+ const mongoose = require('mongoose')
// Userモデルのインポート
const User = require('./model/user')

// ミドルウェアのインポート
const bodyParser = require('body-parser')

// サーバを作成
const app = express()
const port = 3001 // ポート番号を指定

// ミドルウェアのセットアップ
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

+ // urlとDB名を記述する
+ const url = "mongodb://localhost/appDb"

+ // mongodbとの接続
+ mongoose.connect(url, err=>{
+     if (err) console.error(new Error(err))
+     console.log(`サーバはデータベースに接続しました`)
+
+     // ここにHTTPメソッドをapp.post等の形で書いていく。
+ 
+     // 接続している時にサーバを立てる。
+     app.listen(port, err => {
+         if (err) {
+             throw new Error(err)
+         }
+         console.log(`listening on port ${port}`)
+     })
+ })



- // サーバを立てる。
- app.listen(port, err => {
-     if (err) {
-         throw new Error(err)
-     }
-     console.log(`listening on port ${port}`)
- })
```

ここで、データベースに接続できる状態か、node server.jsで確認してみよう。
```
サーバはデータベースに接続しました
listening on port 3001
```
と表示されるはずだ。


# 追加機能
追加機能を実装するには、

1. クライアント側からHTTPメソッドを用いてサーバ側に入力されたデータを送る
1. サーバ側がそのデータを元にデータベースと接続し、データベースにデータを追加する。

の手順になる。

## クライアント側からデータを送る。
HTTPメソッドを用いるには、fetchもしくはaxiosがあるが、今回はaxiosを使っていく。

```diff
import React from "react"

+ // HTTPメソッドでサーバと通信するためにaxiosをインポート
+ import axios from "axios"

const Form = () => {
    // データを追加する機能
    const handleSubmit = (e) => {
        e.preventDefault()

+         // axios.HTTPメソッド(url, データ)でデータを送れる。
+         axios.post("/api/user", {
+             name: e.target.name.value,
+             age : e.target.age.value
+         }).then(res => { // データの送信に成功するとこちらにresponse(返事)が返ってくる
+             console.log(res)
+         }).catch(err => {  // データの送信に失敗するとerrが返ってくる
+             console.error(new Error(err))
+         })
+     }

    return (
        <form onSubmit={(e)=>{handleSubmit(e)}}>
            <input type="text" name="name" />
            <input type="number" name="age" />
            <button type="submit">submit</button>
        </form>
    )
}

export default Form
```

## サーバ側がデータベースにデータを追加する。

サーバでpostされたデータを受け取る。
データの保存は、データベースに接続している状態で、モデルのインスタンス.save()で可能だ。
したがってこの場合は、`new User(新しいUserのプロパティ).save()`になる。

よってserver.jsは下記のようになる。

```diff
mongoose.connect(url, err=>{
    if (err) {console.error(new Error(err))}
    console.log(`サーバはデータベースに接続しました`)

    // ここにHTTPメソッドをapp.post(url, (request, response)=>{})等の形で書いていく。
+     app.post("/api/user", (req, res)=>{
+         console.log("postが送られました")
+         console.log(req.body) // 送ったデータはreq.bodyで取り出せる
+         // モデルのインスタンス.save()でデータを保存できる
+         new User({
+             name: req.body.name,
+             age: req.body.age
+         }).save(err=>{ 
+             if (err) res.status(500).send() //サーバサイドでエラーが出た場合は、status(500)にして送る。
+             res.status(200).send(`${req.body.name}のデータを作成`)
+         })
+     })

    // 接続している時にサーバを立てる。
    app.listen(port, err => {
        if (err) {
            throw new Error(err)
        }
        console.log(`listening on port ${port}`)
    })
})
```
ここまでできたら、ターミナルを2つ作成し、片方でappディレクトリ内でnode server.js、もう一方でclientディレクトリ内でyarn startを行い、データを追加してみよう。ブラウザのコンソール、node server.jsの方のターミナルにそれぞれ結果が表示されるはずだ。

# データ一覧を見る機能
次に、データ一覧を見る機能を作成しよう。
以下の処理が必要である。

1. クライアント側からデータ一覧をリクエストする
1. サーバがリクエストを受け取り、データベースに接続してデータ一覧を取得し、クライアント側に送信する
1. クライアント側がデータ一覧を受け取り表示する。

## クライアント側からデータ一覧をリクエストする

App.jsに、データ一覧を取得するボタンが押された時の処理を記述しよう。サーバとの通信になるので、またaxiosを使う。

```diff
import React from 'react';
import Form from "./Form"
import List from "./List"
+ import axios from "axios"
const App = () => {
  const [users, setUsers] = React.useState([
-    {
-      name: "sawaki",
-      age: 100
-    }
  ])
  // データを取得する機能
  const handleFetchData = () =>{
+     axios.get("/api/user")
+     .then(res=>{
+       console.log(res)
+       
+     }).catch(err=>{
+       console.error(new Error(err))
+     })
+   }
```

ここまでは、まだresをコンソールにのみ表示する機能である。

## サーバがリクエストを受け取り、データベースに接続してデータ一覧を取得し、クライアント側に送信する

サーバにget時の処理を書いていく。

```
app.get("/api/user", (req, res)=>{
        // モデルから全てのデータを取得する
        User.find({}, (err, userArray)=>{ // find(条件, コールバック(エラー、ドキュメント))
            if (err) res.status(500).send(`データ取得に失敗`)
            res.status(200).send(userArray)
        })
    })
```

## クライアント側がデータ一覧を受け取り表示する。
この状態で、片方でappディレクトリ内でnode server.js、もう一方でclientディレクトリ内でyarn startを行って、データを取得しよう。
ブラウザのコンソールを見ると色々書かれているが、よく見るとほしかったデータはオブジェクト内のdataというところにある。
なので、App.jsでこのdataを用いてステートを設定しよう。

```diff
const [users, setUsers] = React.useState([])
  // データを取得する機能
  const handleFetchData = () =>{
    axios.get("/api/user")
    .then(res=>{
+      console.log(res.data)
+      setUsers(res.data)
    }).catch(err=>{
      console.error(new Error(err))
    })
  }
```

# 削除機能

削除の機能は、

1. 一意でデータを特定する。
1. 該当するデータを削除する。
1. 新しいデータ一覧を取得する。
1. 新しいデータをsetUsersする。

になる。

サーバとクライアントの処理を考えると、

1. クライアント側でidでデータを特定し、サーバ側に送る
1. サーバ側がデータベースからidで検索し、該当するデータを削除する。
1. サーバ側で新しいデータ一覧を取得し、クライアント側に送る
1. クライアント側で新しいデータをsetUsersする。

になる。

## クライアント側でidでデータを特定し、サーバ側に送る

先ほどの一覧機能の時にstateを変更し、その時に一意のidもわたっているので、それを用いて処理を行う。
List.jsでは、props.user._idで取り出せる。
ただ、axios.deleteを使うと引数でidを渡せないので、List.jsではaxios({設定})の書き方を使う。

```diff
import React from "react"
+ import axios from "axios"

const List = (props) => {
    // データを削除する機能
    const handleDelete = () => {
+        axios({
+            method: "delete",
+            url: "/api/user",
+            data: {
+                id: props.user._id
+            }
+        }).then(res=>{
+            
+        }).catch(err=>{
+            console.error(new Error(err))
+        })
    }
```

## サーバ側がデータベースからidで検索し、該当するデータを削除する。

server.jsに、app.deleteの処理を加えるだけである。id検索からデータの削除は、モデルのプロパティのfindByIdAndRemoveを用いる。

```diff
app.delete("/api/user", (req, res)=>{
        console.log(req.body)
        User.findByIdAndRemove(req.body.id, err=>{
            // コールバック処理
        })
    })
```

## サーバ側で新しいデータ一覧を取得し、クライアント側に送る

server.jsのUser.findByIdAndRemove処理が終わった後に、データ一覧を取得して送ればよいので、コールバック処理にその内容を記述する。

```diff
app.delete("/api/user", (req, res)=>{
        console.log(req.body)
        User.findByIdAndRemove(req.body.id, err=>{
+            // データ一覧を取得する。
+            User.find({}, err, userArray=>{
+                if (err) res.status(500).send(`データ取得に失敗`)
+                res.status(200).send(userArray)
+            })
        })
    })
```

## クライアント側で新しいデータをsetUsersする。

あとは、resで送られた内容を取り出してList.jsでsetUsersする。

```
const handleDelete = (id) => {
        axios({
            method: "delete",
            url: "/api/user",
            data: {
                id: id
            }
        }).then(res=>{
            console.log(res)
            props.setUsers(res.data)
        }).catch(err=>{
            console.error(new Error(err))
        })
    }
```



