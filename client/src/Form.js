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



