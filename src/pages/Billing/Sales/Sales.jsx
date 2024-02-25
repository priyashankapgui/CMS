import Layout from "../../../Layout/Layout";
import "./Sales.css";
import InputField from "../../../Components/InputField/InputField";
import InputDropdown from "../../../Components/InputDropdown/InputDropdown";
import InputLabel from "../../../Components/Label/InputLabel";

export const Sales = () => {
    return (
        <>
            <div className="sales">
                <h4>Sales</h4>
            </div>
            <Layout>
                <div className="sales-top-content">
                    <div className="branchName">
                        <InputLabel for="branchName" color="#0377A8">Branch</InputLabel>
                        <InputDropdown id="branchName" name="branchName" options={['Galle', 'Kaluthara']} editable={true} />
                    </div>
                    <div className="customerName">
                        <InputLabel for="customerName" color="#0377A8" fontsize="">Customer Name</InputLabel>
                        <InputField type="text" id="customerName" name="customerName" editable={true} />
                    </div>
                    <div className="contactNo">
                        <InputLabel for="contactNo" color="#0377A8">Contact No</InputLabel>
                        <InputField type="text" id="contactNo" name="contactNo" editable={true} />
                    </div>
                </div>
            </Layout>

        </>
    );
};
