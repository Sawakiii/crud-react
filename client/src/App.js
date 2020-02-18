import React from 'react';
import Form from "./Form"
import List from "./List"
import axios from "axios"

const App = () => {
  const [users, setUsers] = React.useState([])
  // データを取得する機能
  const handleFetchData = () =>{
    axios.get("/api/user")
    .then(res=>{
      console.log(res)
      console.log(res.data)
      setUsers(res.data)
    }).catch(err=>{
      console.error(new Error(err))
    })
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
