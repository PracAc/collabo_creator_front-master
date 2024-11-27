import NoticeAddComponent from "../../components/notice/NoticeAddComponent.tsx";
import BasicLayout from "../../layouts/BasicLayout.tsx";


function NoticeAddPage() {
    return (
        <BasicLayout>
            <div className="container mx-auto">
                <NoticeAddComponent/>
            </div>
        </BasicLayout>
    );
}

export default NoticeAddPage;