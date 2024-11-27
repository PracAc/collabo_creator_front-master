import BasicLayout from "../../layouts/BasicLayout.tsx";
import NoticeReadComponent from "../../components/notice/NoticeReadComponent.tsx";


function NoticeReadPage() {
    return (
        <BasicLayout>
            <div className="container mx-auto">
                <NoticeReadComponent />
            </div>
        </BasicLayout>
    );
}

export default NoticeReadPage;