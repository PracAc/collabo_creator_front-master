import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {IBoardReadWithReview} from "../../types/review/iboard.ts";
import {deleteBoard, getBoardRead, putBoardEdit} from "../../apis/review/boardAPI.ts";
import LoadingComponent from "../common/LoadingComponent.tsx";

const initialRead: IBoardReadWithReview = {
    title: "",
    content: "",
    writer: "",
    regDate: "",
    attachFileNames: [],
    reviewList: []
};

function NoticeReadComponent() {
    const { bno } = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false); // 편집 모드 상태
    const [query] = useSearchParams();
    const navigate = useNavigate();
    const queryStr = new URLSearchParams(query).toString();

    const [board, setBoard] = useState<IBoardReadWithReview>(initialRead);
    const [deleteChk, setDeleteChk] = useState(false);
    const [editTitle, setEditTitle] = useState(board.title);
    const [editContent, setEditContent] = useState(board.content);
    const [modalOpen, setModalOpen] = useState(false); // 모달 상태
    const [modalMessage, setModalMessage] = useState(""); // 모달 메시지

    useEffect(() => {
        setLoading(true);
        getBoardRead(Number(bno)).then((data) => {
            setBoard(data);
            setEditTitle(data.title); // 초기값 설정
            setEditContent(data.content); // 초기값 설정
            setTimeout(() => {
                setLoading(false);
            }, 600);
        });
    }, [bno]);

    const handleMoveToList = () => {
        navigate(`/notice/list?${queryStr}`);
    };

    const handleEditClick = () => {
        setIsEditing(true); // 편집 모드 활성화
    };

    const handleSaveClick = () => {
        // const files = filesRef?.current?.files

        const formData:FormData = new FormData()

        // if(files) {
        //     for (let i = 0; i < files.length; i++) {
        //         formData.append("files", files[i])
        //         console.log(files[i]);
        //     }
        // }
        formData.append("title", editTitle)
        formData.append("content", editContent)

        putBoardEdit(Number(bno),formData)
            .then((data) => {
                setModalMessage(`번호 ${data}가 수정이 완료되었습니다.`); // 성공 메시지
                setModalOpen(true);
            })
            .catch(() => {
                setModalMessage("수정에 실패했습니다."); // 실패 메시지
                setModalOpen(true);
            });

    };

    const handleDeleteClick = () => {
        deleteBoard(Number(bno))
            .then((data) => {
                setModalMessage(`번호 ${data}가 삭제가 완료되었습니다.`); // 성공 메시지
                setModalOpen(true);
                setDeleteChk(true);
            })
            .catch(() => {
                setModalMessage("삭제를 실패했습니다."); // 실패 메시지
                setModalOpen(true);
                setDeleteChk(true);
            });
    }

    const closeModal = () => {
        setBoard({ ...board, title: editTitle, content: editContent });
        setIsEditing(false); // 편집 모드 종료

        if (deleteChk){
            handleMoveToList()
        }
        setModalOpen(false)
    };

    const imgDivs = board.attachFileNames.map((file, index) => (
        <div key={index}>
            <span>{file}</span>
        </div>
    ));

    const reviewsDiv = board.reviewList.map((review, index) => (
        <div key={index} className="flex items-start border border-gray-200 p-4">
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold text-gray-800">{review.reviewer}</div>
                    <div className="flex gap-1 text-xs text-gray-500">
                        <span>{review.regDate}</span>
                        <span className="underline hover:text-gray-600 cursor-pointer">수정</span>
                        <span className="underline hover:text-gray-600 cursor-pointer">삭제</span>
                    </div>
                </div>
                <div className="mt-2 text-gray-700 leading-relaxed">{review.content}</div>
            </div>
        </div>
    ));

    return (
        <div className="pt-5 pb-5 w-full mx-auto">
            {loading && <LoadingComponent />}
            <div className="px-4 space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <span className="text-2xl font-semibold text-gray-800">제목</span>
                    {isEditing ? (
                        <input
                            className="mt-1 w-full p-2 border border-black text-gray-700"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                    ) : (
                        <p className="mt-1 w-full p-2 text-gray-700">{board.title}</p>
                    )}
                </div>
                <div className="border-b border-gray-200 pb-4">
                    <span className="text-xl font-semibold text-gray-800">작성자</span>
                    <p className="mt-1 w-full p-2 text-gray-700">{board.writer}</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                    <span className="text-xl font-semibold text-gray-800">작성일</span>
                    <p className="mt-1 w-full p-2 text-gray-700">{board.regDate}</p>
                </div>
                <div className="flex flex-col">
                    <label className="text-xl font-semibold text-gray-800">내용</label>
                    {isEditing ? (
                        <textarea
                            className="mt-2 min-h-80 text-gray-700 px-4 py-3 border border-gray-300 break-words"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                    ) : (
                        <div className="mt-2 min-h-80 text-gray-700 px-4 py-3 border border-gray-300 break-words">
                            {board.content}
                        </div>
                    )}
                    {imgDivs && <div className="mt-4">{imgDivs}</div>}
                </div>

                <div className="flex gap-4 mt-6 justify-between">
                    <button
                        onClick={handleMoveToList}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 transition duration-200"
                    >
                        목록
                    </button>
                    <div className="flex gap-3">
                        {isEditing ? (
                            <button
                                onClick={handleSaveClick}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition duration-200"
                            >
                                저장
                            </button>
                        ) : (
                            <button
                                onClick={handleEditClick}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 transition duration-200"
                            >
                                수정
                            </button>
                        )}
                        <button
                            onClick={handleDeleteClick}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 transition duration-200"
                        >
                            삭제
                        </button>
                    </div>
                </div>

                <div className="flex flex-col w-full mt-1 gap-2">
                    <span className="text-xl font-semibold text-gray-800">답변</span>
                    {reviewsDiv}
                </div>
            </div>

            {/* 모달 */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="flex flex-col justify-center bg-white p-8 rounded-lg shadow-lg">
                        <p className="text-xl">{modalMessage}</p>
                        <button
                            onClick={closeModal}
                            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 transition duration-200"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NoticeReadComponent;
