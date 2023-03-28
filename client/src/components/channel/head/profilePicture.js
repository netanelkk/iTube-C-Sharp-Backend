import React, { useState, useRef } from 'react'
import { upload } from "../../../api";

/*
    User profile page - Header - Profile picture
    Allowing the user the change its picture
*/
const ProfilePicture = ({ picturePath, userId, setRefreshBar }) => {
  const inputFile = useRef(null);
  const profilePicker = useRef(null);
  const [pickerLabel, setPickerLabel] = useState("choose");
  const [allowToggle, setAllowToggle] = useState((userId === localStorage.getItem('myid')));
  const [allowPick, setAllowPick] = useState((userId === localStorage.getItem('myid')));
  const [profilePicture, setProfilePicture] = useState(picturePath);
  let fileSize = 0;

  const openPictureChooser = () => {
    inputFile.current.click();
  };

  const toggleChooser = (e) => {
    if (allowToggle)
      e.currentTarget.classList.toggle('showChooser');
  }

  const config = {
    onUploadProgress: progressEvent => setPickerLabel(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)) + "%")
  }

  const uploadError = (mess) => {
    profilePicker.current.classList.add('picker-error');
    setPickerLabel(mess);
    setAllowToggle(false);
    fileSize = 0;
  }

  const uploadFinish = () => {
    setPickerLabel("choose");
    profilePicker.current.classList.remove('showChooser');
    fileSize = 0;
    setAllowToggle(true);
  }

  const uploadPicture = async (e) => {
    profilePicker.current.classList.add('showChooser');
    profilePicker.current.classList.remove('picker-error');
    fileSize = e.target.files[0].size;
    if (fileSize > 1000000 * 2) {
      uploadError("Max size is 2mb");
      return;
    }
    setPickerLabel("0%");

    const formData = {
      file: e.target.files[0],
      fileName: e.target.files[0].name
    };
    
    const res = await upload("/channel/picture", formData, config);
    if (res.pass) {
      uploadFinish();
      setProfilePicture(res.data);
      setRefreshBar(x => x + 1);
    } else {
      uploadError(res.msg);
    }
  }

  return (
    <div className='channel-profile'
      onMouseEnter={toggleChooser}
      onMouseLeave={toggleChooser}
      ref={profilePicker}>

      <img src={"" + window.SERVER + "/user_thumbnails/" + (profilePicture ? profilePicture : "default.png")} alt="profile-pic" />

      <div className='profile-picker'
        onClick={openPictureChooser}
        style={{ display: (allowPick ? "block" : "none") }}>

        {pickerLabel}

        <input type="file"
          accept="image/png, image/gif, image/jpeg, image/webp"
          ref={inputFile}
          onChange={uploadPicture} />

      </div>
    </div>
  );
}

export default ProfilePicture;