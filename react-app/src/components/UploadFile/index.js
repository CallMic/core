// UploadFile

import React, { useState } from 'react';

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUpload = async () => {
    try {
      if (!file || !email) {
        console.error('Please provide both file and email');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', email);

      // Replace 'YOUR_NODEJS_API_ENDPOINT' with the actual endpoint of your Node.js API
      const response = await fetch('/process_audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
        console.log(response);
        console.log(response.data);
        console.log(response.body);
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
        <div>Please upload an audio file to receive your detailed conversation report.</div>
      <form>
        <div>
          <label>Email:</label>
          <input type="text" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label>File:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="button" onClick={handleUpload}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadFile;
