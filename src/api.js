import { serverBase } from './const';

export const request = async ({ method, route, formData, type, rawData }) => {
    var myHeaders = new Headers();
    // myHeaders.append(
    //   "Authorization",
    //   `Bearer ${this.token || this.dataManager?.token}`
    // );
    // myHeaders.append("Content-Type", "multipart/form-data");

    var requestOptions = {
      method,
      headers: myHeaders,
      redirect: "follow",
    };

    if (formData || rawData) requestOptions.body = formData || rawData;

    return new Promise((resolve, reject) => {
      fetch(serverBase + route, requestOptions)
        .then((response) => (type === 'ab') ? response.arrayBuffer() : response.text())
        .then((resultData) => {

          if (type === 'ab') {
            resolve(resultData);
          } else {
            const result = JSON.parse(resultData);
            resolve(result);
          }
        })
        .catch((error) => {
          console.error("error", error);
          resolve(false);
        });
    });
};
