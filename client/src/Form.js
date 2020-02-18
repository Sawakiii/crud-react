import React from "react"

// HTTPメソッドでサーバと通信するためにaxiosをインポート
import axios from "axios"

const Form = () => {
    // データを追加する機能
    const handleSubmit = (e) => {
        e.preventDefault()

        // axios.HTTPメソッド(url, データ)でデータを送れる。postはreqとしてサーバに送れる。
        axios.post("/api/user", {
            name: e.target.name.value,
            age : e.target.age.value
        }).then(res => { // データの送信に成功するとこちらにresponse(返事)が返ってくる
            console.log(res)
        }).catch(err => {  // データの送信に失敗するとerrが返ってくる
            console.error(new Error(err))
        })
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



