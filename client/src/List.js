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



