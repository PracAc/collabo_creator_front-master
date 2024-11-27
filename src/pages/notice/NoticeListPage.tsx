
import BasicLayout from "../../layouts/BasicLayout.tsx";
import NoticeListComponent from "../../components/notice/NoticeListComponent.tsx";


function NoticeListPage() {
    return (
        <BasicLayout>
            <div className="container mx-auto">
                <NoticeListComponent />
            </div>
        </BasicLayout>
    );
}

export default NoticeListPage;