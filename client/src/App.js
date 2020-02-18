import React from 'react';
import Form from "./Form"
import List from "./List"
import axios from 'axios';


const App = () => {
  const [users, setUsers] = React.useState([])

  // データベースからデータを取ってくる関数。
  const fetchData = () => {
    axios({
      method: "get",
      url: "/api/user"
    })
    .then(res => {
      console.log(res.data)
      setUsers(res.data)
    })
    .catch(err => {
      console.error(new Error(err))
    })
  }
  // const fetchData = () => {
  //   axios.get("/api/user")
  //   .then(res => {
  //     console.log(res.data)
  //     setUsers(res.data)
  //   })
  //   .catch(err => {
  //     console.error(new Error(err))
  //   })
  // }

  return (
    <>
    <Form setUsers={setUsers}></Form>
    <button onClick={fetchData}>fetch</button>
    <List users={users} setUsers={setUsers}></List>
    </>
  )

}

export default App;
