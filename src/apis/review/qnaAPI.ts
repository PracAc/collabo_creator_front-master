import axios from "axios";


const host = "http://localhost:8080/api/board"

export const getQnaList = async (page?:number, size?:number,btype?:number) => {

    const pageValue:number = page || 1
    const sizeValue:number = size || 10
    const btypeValue:number = btype || 1

    const res = await axios.get(`${host}/list?btype=${btypeValue}&page=${pageValue}&size=${sizeValue}`)
    return res.data;
}

export const getQna = async (bno:number) => {
    const res = await axios.get(`${host}/read/${bno}`)
    return res.data;
}