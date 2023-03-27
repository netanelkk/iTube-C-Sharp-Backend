import React from 'react'
import Alert from "../../errors/alert";

// Alert message for errors
const AlertMessage = ({ alertMessage, setAlertMessage, success }) => {
    const closeError = () => setAlertMessage("");
    return (<>
        { (alertMessage !== '') &&
            <Alert
                message={alertMessage}
                close={closeError}
                success={success} />}
    </>);
}

export default AlertMessage;