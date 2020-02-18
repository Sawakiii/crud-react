import React from "react"
import axios from "axios"

const List = (props) => {
    // データを削除する機能
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

    const users = props.users.map((user)=>{
        return (
        <li>
            <h3>名前 : {user.name}</h3>
            <h3>メール : {user.age}</h3>
            <button onClick={()=>{handleDelete(user._id)}}>delete</button>
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



