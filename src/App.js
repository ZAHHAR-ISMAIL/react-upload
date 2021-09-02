import React, { useState } from 'react';
import logo from './logo.svg';
import Axios from 'axios';
import './App.css';
import ImageUploader from 'react-images-upload';

const UploadSection = props => (
    <form>
        <label>
            File upload url:
            <input id="url" type="text" onChange={props.onUrlChange} value={props.url}></input>
        </label>
        <ImageUploader
            key="image-uploader"
            withIcon={true}
            singleImage={true}
            withPreview={true}
            label="Maximum file size: 5mb"
            buttonText="Choose an image"
            onChange={props.onImage}
            imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
            maxFileSize={5242880}
        />
    </form>
);

const App = () => {
    const [url, setURL] = useState(undefined);
    const [progress, setProgress] = useState('getUpload');
    const [errorMessage, setErrorMessage] = useState('');
  
    const onFileChange = async (failedImages, successImages) => {

        if (!url) {
            console.log('missing url');
            setErrorMessage('missing URL to upload to');
            setProgress('uploadError');
            return;
        }
        setProgress('uploading');

        try {
            let parts = successImages[0].split(';');
            //console.log('parts:', parts)
            let mime = parts[0].split(':').slice(1, 2)[0];
            let name = parts[1].split('=').slice(1, 100).join('');
            let data = parts[2];
            console.log(mime, name);
            const res = await Axios.post(url, { mime, name, image: data });
            console.log('res', res);
            setURL(res.data.imageURL);
            setProgress('uploaded');
        } catch (e) {
            //Pop up an error message?
            console.log(e);
            setErrorMessage(e.message);
            setProgress('uploadError');
        }
    };

    const onURLChange = e => {
        setURL(e.target.value);
    };

    const content = () => {
        switch (progress) {
            case 'getUpload':
                return <UploadSection onUrlChange={onURLChange} onImage={onFileChange} url={url} />;
            case 'uploading':
                return <h2>Uploading...</h2>;
            case 'uploadError':
                return (
                    <>
                        <div>Error Message = {errorMessage}</div>
                        <UploadSection onUrlChange={onURLChange} onImage={onFileChange} url={url} />
                    </>
                );
            case 'uploaded':
                return <img src={url} alt="uploaded" />;
        }
    };

    return (
        <div className="App">
            <h1>Image Upload Website</h1>
            {content()}
        </div>
    );
};

export default App;
