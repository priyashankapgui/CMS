import React from "react";


export const UnAuthorized = () =>{
    const goBack = () => {
        window.history.back();
    }

    return (
        <div>
            
                <h1>UnAuthorized to access this page</h1>
                <button onClick={goBack}>Go Back</button>
            

        </div>
    )

}

