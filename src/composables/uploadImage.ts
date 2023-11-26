export default function uploadFileToImageKit(file: File): Promise<any> {
  return new Promise(function (resolve, reject) {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    let request = new XMLHttpRequest();
    request.open('POST', 'https://upload.imagekit.io/api/v1/files/upload', true);
    request.setRequestHeader('Authorization', 'private_ciVlZHgpVTOcXuuX8Qx8KPhjqPo='); // Replace with your ImageKit private API key

    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        // File uploaded successfully
        if (request.status === 201) {
          let response = JSON.parse(request.responseText);
          resolve(response);
        } else {
          // Not successful, let's find out what happened
          let error = JSON.parse(request.responseText);
          alert('error, status code not 201: ' + error.message);
          reject(error);
        }
      }
    };

    request.onerror = (err) => {
      alert('error: ' + err);
      reject(err);
    };

    request.send(formData);
  });
}





// export default function uploadFileToCloudinary(file: File): Promise<any> {
//   return new Promise(function (resolve, reject) {
//     let formData = new FormData();
//     formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
//     formData.append('folder', import.meta.env.VITE_CLOUDINARY_UPLOAD_FOLDER);
//     formData.append('file', file);

//     let request = new XMLHttpRequest();
//     request.open('POST', import.meta.env.VITE_CLOUDINARY_URL, true);
//     request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

//     request.onreadystatechange = () => {
//       // File uploaded successfully
//       if (request.readyState === 4 && request.status === 200) {
//         let response = JSON.parse(request.responseText);
//         resolve(response);
//       }

//       // Not successful, let's find out what happened
//       if (request.status !== 200) {
//         let response = JSON.parse(request.responseText);
//         let error = response.error.message;
//         alert('error, status code not 200 ' + error);
//         reject(error);
//       }
//     };

//     request.onerror = (err) => {
//       alert('error: ' + err);
//       reject(err);
//     };

//     request.send(formData);
//   });
// }
