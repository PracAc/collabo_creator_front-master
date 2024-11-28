import axios from "axios";
import {IReview} from "../../types/review/iboard.ts";

const host = "http://localhost:8080/api/board/review"

export const postReviewAdd = async (bno:number, data:IReview) => {

    const res = await axios.post(`${host}/${bno}`, data)

    return res.data;
}

export const getReviewOne = async (rno:number)=> {
    const res = await axios.get(`${host}/${rno}`)
    return res.data;
}

export const putReviewEdit = async (rno:number, content:string) => {
    const res = await axios.put(`${host}/edit/${rno}`, content,{headers: {
            'Content-Type': 'text/plain',  // 본문을 plain 텍스트로 전송
        }})
    return res.data;
}

export const deleteReview = async (rno:number) => {
    const res = await axios.put(`${host}/delete/${rno}`)
    return res.data;
} //