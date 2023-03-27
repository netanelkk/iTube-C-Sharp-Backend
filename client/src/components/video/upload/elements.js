import React from 'react'
import { Link } from "react-router-dom";
import { Player } from 'video-react';
import ReactTooltip from 'react-tooltip';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

// Video upload menu
export const UploadMenu = ({ step, setStep, preview }) => {
    return (
        <div className='upload-menu'>
            <div className='step-line'></div>
            <div>
                <div className={'step' + ((step === 0) ? " current" : "")}
                    onClick={() => setStep(0)}>
                    <div className='step-indicator'></div>
                    <span>Choose Video</span>
                </div>
            </div>
            <div>
                <div className={'step' + ((step === 1) ? " current" : "") + (!preview ? " disabled" : "")}
                    onClick={() => { if (preview) setStep(1); }}>
                    <div className='step-indicator'></div>
                    <span>Video Details</span>
                </div>
            </div>
        </div>
    );
}

// Step #1 in video upload - Choosing the file
export const ChooseVideo = ({ fileName, inputFile, fileChange, fileError }) => {
    return (
        <div className='upload-box'>
            <i className="bi bi-upload"></i>
            <div>
                {fileName}
            </div>
            <input type="file" accept="video/mp4, video/webm"
                ref={inputFile}
                onChange={fileChange} />
            {(fileError !== '') && (
                <div className="fileError">
                    {fileError}
                </div>
            )}
        </div>
    )
}

// Step #2 in video upload - Preview & video details
export const VideoDetails = ({ preview, title, onTitleChange, onDescriptionChange,
    description, password, onPasswordChange, disabled, buttonText }) => {
    return (
        <>
            <Player
                src={preview}
                fluid={false}
                width="500"
                autoPlay={true}
                muted={true}
            />

            <TextField
                label="Title"
                variant="outlined"
                value={title}
                onChange={onTitleChange}
                maxLength="100"
                fullWidth
                style={{ marginTop: "15px" }}
                required
            />

            <h3 className="subtitle">
                Description
            </h3>

            <TextField
                label="Description"
                variant="outlined"
                value={description}
                onChange={onDescriptionChange}
                maxLength="255"
                rows={3}
                fullWidth
                required
                multiline
            />

            <ReactTooltip />
            <h3 className="subtitle">
                Password (optional)
                <i className="bi bi-question-circle-fill"
                    data-tip="Upload private video protected with password"></i>
            </h3>

            <TextField
                label="Password"
                variant="outlined"
                value={password}
                onChange={onPasswordChange}
                maxLength="20"
                fullWidth
            />

            <Button
                type="submit"
                variant="contained"
                disabled={disabled}>
                {buttonText}
            </Button>
        </>
    )
}

// Video uploaded successfully, showing preview with link 
export const VideoSuccess = ({ uploadedId, title, thumbnailPath }) => {
    return (
        <div className='upload-success'>
            <div>
                <i class="bi bi-check-circle"></i>
                <div>
                    Video Uploaded Successfully!
                </div>
                <Link to={window.PATH + "/watch/" + uploadedId}>
                    <div className='upload-result'>
                        <img src={window.SERVER + "/video_thumbnails/" + thumbnailPath} />
                        <div>{title}</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export function uploadText() {
    return (<><span><i className="bi bi-arrow-up-short"></i> Upload</span></>);
}

export function loadingText(percent = 0) {
    return (<><div className="loading"></div><span>Uploading.. {percent}%</span></>);
}
