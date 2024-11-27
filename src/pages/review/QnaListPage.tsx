
import BasicLayout from "../../layouts/BasicLayout.tsx";
import QnaListComponent from "../../components/review/QnaListComponent.tsx";


function QnaListPage() {
    return (
        <BasicLayout>
            <div className="container mx-auto">
                <QnaListComponent />
            </div>
        </BasicLayout>
    );
}

export default QnaListPage;