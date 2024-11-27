import { lazy, Suspense } from "react";
import LoadingPage from "../pages/LoadingPage";
import {Navigate} from "react-router-dom";

const ReviewListPage = lazy(() => import("../pages/review/ReviewListPage"));
const ReviewReplyPage = lazy(() => import("../pages/review/ReviewReplyPage"));
const QnaListPage = lazy(() => import("../pages/review/QnaListPage"));
const QnaReadPage = lazy(() => import("../pages/review/QnaReadPage"));

const reviewRouter = {
    path: "/",
    children: [
        {
            path: "review",
            children: [
                {
                    path: "",
                    element: <Navigate to="list" replace={true}/>
                },
                {
                    path: "list",
                    element: (
                        <Suspense fallback={<LoadingPage />}>
                            <ReviewListPage />
                        </Suspense>
                    ),
                },
                {
                    path: "reply/:id",
                    element: (
                        <Suspense fallback={<LoadingPage />}>
                            <ReviewReplyPage />
                        </Suspense>
                    ),
                },
            ]
        },
        {
            path: "qna",
            children: [
                {
                    path: "",
                    element: <Navigate to="list" replace={true}/>
                },
                {
                    path: "list",
                    element: (
                        <Suspense fallback={<LoadingPage />}>
                            <QnaListPage />
                        </Suspense>
                    ),
                },
                {
                    path: "read/:bno",
                    element: (
                        <Suspense fallback={<LoadingPage />}>
                            <QnaReadPage />
                        </Suspense>
                    ),
                },
            ]
        },
    ],
};

export default reviewRouter;
