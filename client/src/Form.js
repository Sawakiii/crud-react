import React from "react"

// サーバとの通信のためのaxiosをインポート
import axios from "axios"

const Form = () => {
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("/api/user", {
                name: e.target.name.value,
                email: e.target.email.value
        }).then(res => {
            console.log(res)
        }).catch(err=>{
            console.error(new Error(err))
        })
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



