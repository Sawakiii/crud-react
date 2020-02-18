
この資料では、React学習者がexpressとmongoとnode.jsを用いて、MERN環境でサーバとの通信とCRUDの基本をマスターできるまでを記述する。

# 事前に必要なもの
mongodb, node, yarnのインストール。
Reactの知識。

mongodbのインストール。↓を参照
https://kageura.hatenadiary.jp/entry/2018/01/09/Windows%E7%89%88MongoDB%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%83%BBMongoShell%E3%82%92%E9%80%9A%E3%81%97%E3%81%A6CRUD%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%82%92%E6%89%93


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
            <input type="text" name="email" />
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
            <h3>メール : {user.email}</h3>
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

また、データベースのデータの型を規定するためのモデル(スキーマ)を作成する。
appディレクトリ内に、models/user.jsを作成する。





