import React, { useState, useRef, useEffect } from 'react'
import { upload } from "../../../api";
import ErrorLogin from "../../errors/errorLogin";
import Alert from "../../errors/alert";
import { VideoDetails, ChooseVideo, UploadMenu, VideoSuccess, uploadText, loadingText } from "./elements";


/*
    Upload video form
*/
const filePlaceholder = "CHOOSE VIDEO TO UPLOAD";
function Upload({ isUserSignedIn, setTitle, topRef }) {
    setTitle("Upload Video");
    const inputFile = useRef(null);
    const [title, setVTitle] = useState("");
    const [description, setDescription] = useState("");
    const [password, setPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [fileError, setFileError] = useState("");
    const [file, setFile] = useState("");
    const [fileName, setFileName] = useState(filePlaceholder);
    const [buttonText, setbuttonText] = useState(uploadText);
    const [disabled, setDisabled] = useState("");
    const [uploadedId, setUploadedId] = useState(0);
    const [thumbnailPath, setThumbnailPath] = useState("");
    const [step, setStep] = useState(0);
    const [preview, setPreview] = useState("");

    const onTitleChange = (event) => setVTitle(event.target.value);
    const onDescriptionChange = (event) => setDescription(event.target.value);
    const onPasswordChange = (event) => setPassword(event.target.value);
    const closeError = () => setAlertMessage("");

    function loading(show = true) {
        if (show) {
            setDisabled("disabled");
            setbuttonText(loadingText());
            setAlertMessage("");
        } else {
            setDisabled("");
            setbuttonText(uploadText());
        }
    }

    const fileChange = (e) => {
        setAlertMessage("");
        setFileName(filePlaceholder);
        setFile("");
        setPreview("");
        setFileError("");
        var file = e.target.files[0];
        if (file.size > 1000000 * 10) {
            setFileError("Max size is 10mb");
            return;
        }
        if (file.type !== "video/webm" && file.type !== "video/mp4") {
            setFileError("Only mp4 and webm formats are allowed");
            return;
        }
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
        URL.revokeObjectURL(preview);
        var fileUrl = window.URL.createObjectURL(e.target.files[0]);
        setPreview(fileUrl);
        setStep(1);
    }

    // Upload progress
    const config = {
        onUploadProgress:
            progressEvent => setbuttonText(loadingText(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))))
    }

    const uploadSubmit = async (e) => {
        e.preventDefault();
        if (file) {
            loading();
            const formData = { title, description, password, file, fileName };
            const res = await upload("/watch/upload", formData, config);
            if (res.pass) {
                URL.revokeObjectURL(preview);
                setPreview("");
                setUploadedId(res.data.Id);
                setThumbnailPath(res.data.ThumbnailPath);
            } else {
                setAlertMessage("Unexpected error, try again later");
            }
            loading(false);
        }
    }

    useEffect(() => {
        topRef.current.scrollTop = 0;
    }, []);

    return (
        <>
            {!isUserSignedIn && <ErrorLogin />}
            {(alertMessage !== '') && <Alert message={alertMessage} close={closeError} />}

            {(uploadedId !== 0 && isUserSignedIn) &&
                <VideoSuccess uploadedId={uploadedId}
                    title={title} thumbnailPath={thumbnailPath} />}

            {(uploadedId === 0 && isUserSignedIn) && (
                <form className='upload-form' onSubmit={uploadSubmit}>
                    <h1>Upload Video</h1>

                    <UploadMenu
                        step={step}
                        setStep={setStep}
                        preview={preview} />

                    {(step === 0) &&
                        <ChooseVideo
                            fileName={fileName}
                            inputFile={inputFile}
                            fileChange={fileChange}
                            fileError={fileError} />}
                    {(step === 1) &&
                        <VideoDetails
                            preview={preview}
                            title={title}
                            onTitleChange={onTitleChange}
                            onDescriptionChange={onDescriptionChange}
                            description={description}
                            password={password}
                            onPasswordChange={onPasswordChange}
                            disabled={disabled}
                            buttonText={buttonText} />}
                </form>)}
        </>
    );
}

export default Upload;
