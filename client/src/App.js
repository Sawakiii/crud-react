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
