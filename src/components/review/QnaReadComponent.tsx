import {useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {IBoardRead} from "../../types/review/iboard.ts";
import {getQna} from "../../apis/review/qnaAPI.ts";
import LoadingComponent from "../common/LoadingComponent.tsx";

const initialRead:IBoardRead = {
    title: "",
    content: "",
    writer: "",
    regDate: "",
    attachFileNames: [],
    reviewList: []
}


function QnaReadComponent() {
    const {bno} = useParams();
    const [loading, setLoading] = useState<boolean>(false);

    const [query] = useSearchParams();
    const navigate = useNavigate();
    const queryStr = new URLSearchParams(query).toString();

    const [board, setBoard] = useState<IBoardRead>(initialRead)


    useEffect(() => {
        setLoading(true);
        getQna(Number(bno)).then((data) => {
            setBoard(data);
            console.log(data)
            setTimeout(() => {
                setLoading(false);
            }, 600);
        });
    },[bno])

    const handleMoveToList = () => {
        navigate(`/qna/list?${queryStr}`);
    }

    const imgDivs = board.attachFileNames.map((file,index) => {
        return(
            <div key={index}>
                <span>{file}</span>
            </div>
        )
    })

    const reviewsDiv = board.reviewList.map((review, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4 shadow-md">
            <div>
                <div className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">작성자:</span> {review.reviewer}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">작성일:</span> {review.regDate}
                </div>
            </div>
            <div className="text-gray-800">
                <span className="font-semibold">내용:</span> {review.content}
            </div>
        </div>
    ));


    return (
        <div className="pt-5 pb-5 w-full mx-auto">

            {loading && <LoadingComponent/>}

            <div className="border rounded-2xl p-10 bg-white shadow-md space-y-6">
                <div>
                    <span className="text-lg font-medium text-gray-700">제목</span>
                    <p className="mt-1 w-full px-3 py-2 border rounded-md">{board.title}</p>
                </div>
                <div>
                    <span className="text-lg font-medium text-gray-700">작성자</span>
                    <p className="mt-1 w-full px-3 py-2 border rounded-md">{board.writer}</p>
                </div>
                <div>
                    <span className="text-lg font-medium text-gray-700">작성일</span>
                    <p className="mt-1 w-full px-3 py-2 border rounded-md">{board.regDate}</p>
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700">내용</label>
                    <div className="flex space-x-2 mt-1 gap-2">
                        {board.content}
                    </div>
                    <div className="flex space-x-2 mt-1 gap-2">
                        {imgDivs}
                    </div>
                </div>

                <div className="flex gap-4 mt-6 justify-between">
                    <button
                        onClick={handleMoveToList}
                        className="px-4 py-2 bg-gray-400 rounded-lg hover:bg-gray-600">
                        목록
                    </button>
                    <div className="flex gap-3">
                        <button
                            className="px-4 py-2 bg-blue-400 rounded-lg hover:bg-blue-600">
                            수정
                        </button>
                        <button
                            className="px-4 py-2 bg-red-400 rounded-lg hover:bg-red-600">
                            삭제
                        </button>
                    </div>
                </div>

                <div className="flex space-x-2 mt-1 gap-2">
                    {reviewsDiv}
                </div>
            </div>

        </div>
    );
}

export default QnaReadComponent;