import { mouseBusy } from '../utils';
const axios = require('axios');

function callGET(path, parameters, callback, onError) {
    return _call('get', path, parameters, callback, onError);
}

function callPOST(path, parameters, callback, onError) {
    return _call('post', path, parameters, callback, onError);
}

function callPUT(path, parameters, callback, onError) {
    return _call('put', path, parameters, callback, onError);
}

function fileUpload(path, file, fileFor, callback) {
    var formData = new FormData();
    formData.append(fileFor, file);
    axios.put(path, formData, {
        headers: {
            'Response-Type': 'application/zip'
        }
    }).then(function (response) {
        callback(response);
    })
        .catch(function (error) {
            console.log('File Upload failed', error);
        });
}

function fileDownload(path, parameters, callback, progressCallback, onError) {
    mouseBusy(true);
    axios.post(path, parameters, {
        responseType: 'blob',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json-patch+json'
        },
        onDownloadProgress: (progressEvent) => {
            mouseBusy(false);
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            if (isFinite(percentCompleted))
                progressCallback(percentCompleted);
            else
                progressCallback(-1)//To indicate error in reading file
        }
    }).then(function (response) {
        const blob = new Blob([response.data], {
            type: 'application/zip',
        });
        mouseBusy(false);
        callback(blob);
    })
        .catch(function (error) {
            mouseBusy(false);
            console.log('File Download failed', error);
            if (onError) {
                onError(error);
            }
        });
}

function _call(method, path, parameters, callback, onError) {
    axios({
        method: method,
        //mode: 'no-cors',
        url: path,
        data: parameters
    }).then(function (response) {
        callback(response);
    })
        .catch(function (error) {
            console.log(error);
            if (onError)
                onError(error);
        });
}

async function callAndWaitGET(path, parameters) {
    return await callAndWait('get', path, parameters);
}

async function callAndWaitPOST(path, parameters) {
    return await callAndWait('post', path, parameters);
}

async function callAndWaitPUT(path, parameters) {
    return await callAndWait('put', path, parameters);
}

async function callAndWait(method, path, parameters) {
    const response = await axios({ method: method, url: path, data: parameters });
    return response;
}

export default { callPUT, callGET, callPOST, callAndWait, callAndWaitGET, callAndWaitPOST, fileUpload, fileDownload, callAndWaitPUT }
/* You can import them as import ajaxutils from './AjaxUtils'; and use it as ajaxutils.callGET();...
    OR
    import {callGET, callPOST} from './AjaxUtils'; and use as callGET();
*/