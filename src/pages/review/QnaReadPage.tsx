import BasicLayout from "../../layouts/BasicLayout.tsx";
import QnaReadComponent from "../../components/review/QnaReadComponent.tsx";


function QnaReadPage() {
    return (
        <BasicLayout>
            <div className="container mx-auto">
                <QnaReadComponent />
            </div>
        </BasicLayout>
    );
}

export default QnaReadPage;