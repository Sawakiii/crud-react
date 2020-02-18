import React from "react"
import axios from "axios"

const List = (props) => {

    // 削除機能を追加
    const handleDelete = (id) => {
        // 通信してidのものを特定する。
        axios({
            method: "delete",
            url: "/api/user",
            data: {
                id,
            }
        })
        .then((res)=>{
            // 該当部分を削除したuserがresに入ってくる
            props.setUsers(res.data)
        })
        .catch(err=>{
            console.error(new Error(err))
        })
    }

    const users = props.users.map((user)=>{
        return (
        <li>
            <h3>名前 : {user.name}</h3>
            <h3>メール : {user.email}</h3>
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



