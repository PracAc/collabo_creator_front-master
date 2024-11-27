export interface IBoard {
    bno:number,
    title: string,
    writer: string,
    regDate: string
}

export interface IBoardRead{
    title: string,
    writer: string,
    regDate: string,
    content: string
    attachFileNames: string[],
    reviewList: IReview[]
}

export interface IReview {
    reviewer: string,
    regDate: string,
    content: string,
}