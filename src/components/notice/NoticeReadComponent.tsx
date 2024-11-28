import {useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {IBoardReadWithReview, IReview} from "../../types/review/iboard.ts";
import {deleteBoard, getBoardRead, putBoardEdit} from "../../apis/review/boardAPI.ts";
import LoadingComponent from "../common/LoadingComponent.tsx";
import {deleteReview, getReviewOne, postReviewAdd, putReviewEdit} from "../../apis/review/reviewAPI.ts";


const initialRead: IBoardReadWithReview = {
    title: "",
    content: "",
    writer: "",
    regDate: "",
    attachFileNames: [],
    reviewList: []
};

const initialReview: IReview = {
    rno: 0,
    reviewer: 'reviewer',
    content: '',
    regDate: ''
}

function NoticeReadComponent() {
    // uri 작성글 번호
    const {bno} = useParams();
    // uri 상 page, size
    const [query] = useSearchParams();
    const navigate = useNavigate();
    const queryStr = new URLSearchParams(query).toString();

    // 로딩 상태
    const [loading, setLoading] = useState<boolean>(false);
    // 작성글 편집 모드 상태
    const [isBoardEditing, setIsBoardEditing] = useState<boolean>(false);
    // 답글 편집 모드 상태
    const [isReviewEditing, setIsReviewEditing] = useState<boolean>(false);

    // 작성글 + 답글 상태
    const [board, setBoard] = useState<IBoardReadWithReview>(initialRead);
    // 답글 1개 상태
    const [reviewState, setReviewState] = useState<IReview>(initialReview);
    // 작성글 삭제클릭 확인 상태
    const [deleteChk, setDeleteChk] = useState(false);
    // 작성글 제목
    const [boardEditTitle, setBoardEditTitle] = useState(board.title);
    // 작성글 내용
    const [boardEditContent, setBoardEditContent] = useState(board.content);
    // 알림 모달 상태
    const [modalOpen, setModalOpen] = useState(false);
    // 알림 모달 메시지
    const [modalMessage, setModalMessage] = useState("");

    // 답글 모달 상태
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    // 리스트 목록 이동
    const handleMoveToList = () => {
        navigate(`/notice/list?${queryStr}`);
    };
    // 게시글 편집 모드 활성화
    const handleBoardEditClick = () => {
        setIsBoardEditing(true);
    };
    // 게시글 수정 처리
    const handleBoardModifyClick = () => {
        // 추후 파일 처리 필요
        // const files = filesRef?.current?.files

        const formData: FormData = new FormData()

        // if(files) {
        //     for (let i = 0; i < files.length; i++) {
        //         formData.append("files", files[i])
        //         console.log(files[i]);
        //     }
        // }
        formData.append("title", boardEditTitle)
        formData.append("content", boardEditContent)

        putBoardEdit(Number(bno), formData)
            .then((data) => {
                setModalMessage(`번호 ${data}가 수정이 완료되었습니다.`); // 성공 메시지
                setModalOpen(true);
            })
            .catch(() => {
                setModalMessage("수정에 실패했습니다."); // 실패 메시지
                setModalOpen(true);
            });

    };
    // 게시글 삭제 처리
    const handleBoardDeleteClick = () => {
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
    // 알림 모달 닫기
    const closeModal = () => {
        // setBoard({ ...board, title: editTitle, content: editContent });
        setIsBoardEditing(false); // 편집 모드 종료
        setModalOpen(false)

        if (deleteChk) {
            handleMoveToList()
        }
    };
    // 답글 신규 작성 처리
    const handleReviewSaveClick = () => {
        postReviewAdd(Number(bno), reviewState)
            .then((data) => {
                setModalMessage(`번호 ${data} 답글 작성 이 완료되었습니다.`); // 성공 메시지
                setReviewModalOpen(false);
                setModalOpen(true);
            })
            .catch(() => {
                setModalMessage("답글 작성에 실패했습니다."); // 실패 메시지
                setReviewModalOpen(false);
                setModalOpen(true);
            });
    }
    // 답글 편집 모드 활성화
    const handleReviewEditClick = (rno: number) => {
        getReviewOne(rno)
            .then(data => {
                setReviewModalOpen(true)
                setIsReviewEditing(true)
                setReviewState(data)
            })
    }
    // 답글 수정 처리
    const handleReviewModifyClick = () => {
        putReviewEdit(reviewState.rno, reviewState.content)
            .then(() => {
                setReviewModalOpen(false)
                setModalMessage(`답글 내용 수정이 완료되었습니다.`); // 성공 메시지
                setModalOpen(true);
            })
            .catch(() => {
                setReviewModalOpen(false)
                setModalMessage("수정에 실패했습니다."); // 실패 메시지
                setModalOpen(true);
            });
    }
    // 답글 삭제 처리
    const handleReviewDeleteClick = (rno: number) => {
        deleteReview(rno)
            .then(() => {
                setModalMessage(`답글 삭제가 완료되었습니다.`); // 성공 메시지
                setModalOpen(true);
            })
            .catch(() => {
                setModalMessage("삭제에 실패했습니다."); // 실패 메시지
                setModalOpen(true);
            });
    }

    useEffect(() => {
        setLoading(true);
        getBoardRead(Number(bno)).then((data) => {
            setBoard(data);
            setBoardEditTitle(data.title); // 초기값 설정
            setBoardEditContent(data.content); // 초기값 설정
            setTimeout(() => {
                setLoading(false);
            }, 600);
        });
    }, [bno, modalOpen]);

    const imgDivs = board.attachFileNames.map((file, index) => (
        <div key={index}>
            <span>{file}</span>
        </div>
    ));

    const reviewsDiv = board.reviewList.map((review) => (
        <div key={review.rno} className="flex items-start border border-gray-200 p-4">
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold text-gray-800">{review.reviewer}</div>
                    <div className="flex gap-1 text-xs text-gray-500">
                        <span>{review.regDate}</span>
                        <span onClick={() => handleReviewEditClick(review.rno)}
                              className="underline hover:text-gray-600 cursor-pointer">수정</span>
                        <span onClick={() => handleReviewDeleteClick(review.rno)}
                              className="underline hover:text-gray-600 cursor-pointer">삭제</span>
                    </div>
                </div>
                <div className="mt-2 text-gray-700 leading-relaxed">{review.content}</div>
            </div>
        </div>
    ));

    return (
        <div className="pt-5 pb-5 w-full mx-auto">
            {loading && <LoadingComponent/>}
            <div className="px-4 space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <span className="text-2xl font-semibold text-gray-800">제목</span>
                    {isBoardEditing ? (
                        <input
                            className="mt-1 w-full p-2 border border-black text-gray-700"
                            value={boardEditTitle}
                            onChange={(e) => setBoardEditTitle(e.target.value)}
                        />
                    ) : (
                        <p className="mt-1 w-full p-2 border border-opacity-0 text-gray-700">{board.title}</p>
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
                    {isBoardEditing ? (
                        <textarea
                            className="mt-2 min-h-80 text-gray-700 px-4 py-3 border border-black break-words"
                            value={boardEditContent}
                            onChange={(e) => setBoardEditContent(e.target.value)}
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
                        {isBoardEditing ? (
                            <button
                                onClick={handleBoardModifyClick}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition duration-200"
                            >
                                저장
                            </button>
                        ) : (
                            <button
                                onClick={handleBoardEditClick}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 transition duration-200"
                            >
                                수정
                            </button>
                        )}
                        {isBoardEditing ? (
                            <button
                                onClick={() => setIsBoardEditing(false)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 transition duration-200"
                            >
                                취소
                            </button>
                        ) : (
                            <button
                                onClick={handleBoardDeleteClick}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 transition duration-200"
                            >
                                삭제
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col w-full mt-1 gap-2">
                    <div className="flex justify-between">
                        <span className="text-xl font-semibold text-gray-800">답변</span>
                        <span className="text-xs font-semibold text-gray-800" onClick={() => {
                            setReviewModalOpen(true)
                        }}>답글 작성</span>
                    </div>

                    {reviewsDiv}
                </div>
            </div>

            {/* 알림 모달 */}
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
            {/* 답글 입력모달 */}
            {reviewModalOpen &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="flex flex-col justify-center bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex flex-col">
                            <label className="text-xl font-semibold text-gray-800">내용</label>

                            <textarea
                                className="mt-2 min-w-96 min-h-80 text-gray-700 px-4 py-3 border border-gray-300 break-words"
                                value={reviewState.content}
                                onChange={(e) => setReviewState({...reviewState, content: e.target.value})}
                            />
                        </div>
                        <div className="flex justify-center gap-3 p-2">
                            {isReviewEditing ?
                                (<button
                                    onClick={handleReviewModifyClick}
                                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition duration-200">
                                    수정
                                </button>) :
                                (<button
                                    onClick={handleReviewSaveClick}
                                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 transition duration-200">
                                    작성
                                </button>)}

                            <button
                                onClick={() => setReviewModalOpen(false)}
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 transition duration-200"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default NoticeReadComponent;
