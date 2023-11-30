export default function uploadFileToImageKit(file: File): Promise<any> {
  return new Promise(function (resolve, reject) {

    let request = new XMLHttpRequest();
    request.open('POST', import.meta.env.VITE_IMAGEKIT_URL);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    fetch("https://api.jimmyxchange.com/api/image/signature", {
      method: "GET"
    }).then(response => response.json()).then(data => { if (data) callBackFunc(data) }).catch(err => console.log(err))

    function callBackFunc(data: { expire: number, token: string, signature: string }) {
      let formData = new FormData();
      formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('useUniqueFileName', 'true');
      formData.append('expire', data.expire.toString());
      formData.append('token', data.token);
      formData.append('signature', data.signature);

      request.onreadystatechange = () => {
        // File uploaded successfully
        if (request.readyState === 4 && request.status === 200) {
          let response = JSON.parse(request.responseText);
          
          resolve(response);
        }

        // Not successful, let's find out what happened
        if (request.status !== 200) {
          let response = JSON.parse(request.responseText);
          let error = response.error.message;
          alert('error, status code not 200 ' + error);
          reject(error);
        }
      };

      request.onerror = (err) => {
        alert('error: ' + err);
        reject(err);
      };

      request.send(formData);
      
    }

  });
}