import Layout from "../../Layout/Layout";
import "./Reporting.css";
import InputLabel from "../../Components/Label/InputLabel";
import InputDropdown from "../../Components/InputDropdown/InputDropdown";
import DatePicker from "../../Components/DatePicker/DatePicker"
import Buttons from "../../Components/Buttons/Buttons";

export const Reporting = () => {
    return (
        <>
            <div className="reporting">
                <h4>Reporting</h4>
            </div>
            <Layout>
                <div className="reportingTop">
                    <div className="reportLeftContent">
                        <h3 className="reportingTop-title">Daliy Sale Analysis</h3>
                        <div className="rep-Cont1">
                            <div className="rep-Cont1-top">
                                <div className="branchField">
                                    <InputLabel for="branchName" color="#0377A8">Branch Name</InputLabel>
                                    <InputDropdown id="branchName" name="branchName" options={['All', 'Galle', 'Kaluthara']} editable={true} />
                                </div>
                                <div className="dateField">
                                    <InputLabel for="date" color="#0377A8">Date</InputLabel>
                                    <DatePicker />
                                </div>
                            </div>
                            <Buttons type="submit" id="view-btn" style={{ backgroundColor: "#23A3DA", color: "white" }}> View </Buttons>
                        </div>
                    </div>
                    <div className="reportRightContent">
                        <h3>Total Sales Amount:</h3>
                    </div>
                </div>
                <div className="reportingMiddle">
                   <h4>Chart</h4>
                </div>





            </Layout>
        </>

    );
};
