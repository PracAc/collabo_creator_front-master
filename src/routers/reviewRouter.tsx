import { lazy, Suspense } from "react";
import LoadingPage from "../pages/LoadingPage";
import {Navigate} from "react-router-dom";

const ReviewListPage = lazy(() => import("../pages/review/ReviewListPage"));
const ReviewReplyPage = lazy(() => import("../pages/review/ReviewReplyPage"));

const reviewRouter = {
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
}

export default reviewRouter;
