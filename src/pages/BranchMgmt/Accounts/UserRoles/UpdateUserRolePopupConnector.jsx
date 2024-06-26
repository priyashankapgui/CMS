import { useRef, useCallback } from "react";
import EditPopup from "../../../../Components/PopupsWindows/EditPopup";
import UpdateUserRolePopup from "./UpdateUserRolePopup";

export default function UpdateUserRolePopupConnector({ userRoleId }) {
    const ref = useRef(null);

    // Use useCallback to ensure the function is memoized and not created on every render
    const handleUpdate = useCallback(async() => {
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
        >
            <UpdateUserRolePopup userRoleId={userRoleId} ref={ref} />
        </EditPopup>
    );
}