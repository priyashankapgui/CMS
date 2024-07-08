import { useRef, useCallback, useState } from "react";
import EditPopup from "../../../../Components/PopupsWindows/EditPopup";
import UpdateUserRolePopup from "./UpdateUserRolePopup";
import CustomAlert from "../../../../Components/Alerts/CustomAlert/CustomAlert";

export default function UpdateUserRolePopupConnector({ userRoleId, refresh, displaySuccess }) {
    const ref = useRef(null);
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    // Use useCallback to ensure the function is memoized and not created on every render
    const handleUpdate = useCallback(async () => {
        if (ref.current) {
            await ref.current.handleUpdate();
        }
    }, []);

    return (
            <EditPopup
                topTitle="Update User Role Details"
                buttonId="update-btn"
                buttonText="Update"
                onClick={handleUpdate} // Pass the memoized callback function here
                open={open}
            >
                <UpdateUserRolePopup
                    refresh={refresh}
                    userRoleId={userRoleId}
                    handleClose={handleClose}
                    ref={ref}
                    displaySuccess={displaySuccess}
                />
            </EditPopup>
    );
}
