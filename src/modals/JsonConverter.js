var vifConstants = require('../Constants/VIF_ENUMS')

function _elementStruct(mainstruct) {
    let item = mainstruct;
    let decodedValue = item.decodedValue;
    let specValue = item.specValue;

    let tempEle = {
        "_attributes": {
            "value": specValue
        },
        "_text": decodedValue
    };

    return tempEle;
}
function convertCapsJsonFormat(backendCapsJson) {
    let formatedJson = {};
    formatedJson.VIF = {};
    formatedJson.VIF.Component = {};

    let staticVifElements = backendCapsJson.nonComponentVIFElements;
    let staticComponentElements = backendCapsJson.vifComponents[0]["staticPortElements"];
    let staticSourcePdoList = backendCapsJson.vifComponents[0]["sourcePDOs"];
    let staticSinkPdoList = backendCapsJson.vifComponents[0]["sinkPDOs"];
    let staticSvidList = backendCapsJson.vifComponents[0]["sviDs"];

    // ADD VIF ELEMENTS
    for (let i = 0; i < staticVifElements.length; i++) {
        let item = staticVifElements[i];
        formatedJson.VIF[item.enum] = _elementStruct(item);
    }
    // ADD COMPONENT ELEMENTS
    for (let i = 0; i < staticComponentElements.length; i++) {
        let item = staticComponentElements[i];
        formatedJson.VIF.Component[item.enum] = _elementStruct(item);
    }

    formatedJson.VIF.Component["SrcPdoList"] = _createPDOStructure(staticSourcePdoList, "SrcPDO");
    formatedJson.VIF.Component["SnkPdoList"] = _createPDOStructure(staticSinkPdoList, "SnkPDO");
    formatedJson.VIF.Component["SOPSVIDList"] = _createPDOStructure(staticSvidList, "SOPSVID");

    return formatedJson;
}
function _createPDOStructure(categoryList, pdoName) {
    let tempPdos = [];
    let pdoObj = {};

    if (categoryList !== null) {
        var keys = Object.keys(categoryList);
        for (let i = 0; i < keys.length; i++) {
            // NOTE 'k' variable starts with 0 but index starts with 1
            let akey = keys[i];
            let currentArr = categoryList[akey].vifFieldList;

            let pdo_Obj = {};
            let SOPSVIDModeList = {}

            let currentSubFieldArr = categoryList[akey].vifSubFieldList;
            //let testObj = {};

            if (currentSubFieldArr !== null) {

                let sopmodeArr = [];

                for (let x = 0; x < currentSubFieldArr.length; x++) {

                    let currentMode = currentSubFieldArr[x];
                    let modeEles = currentMode.vifFieldList;
                    let mode_obj = {};

                    for (let i = 0; i < modeEles.length; i++) {
                        let currentModeEle = modeEles[i];
                        let tempModeEle = _elementStruct(currentModeEle);
                        mode_obj[currentModeEle.enum] = tempModeEle;
                    }
                    sopmodeArr.push(mode_obj);
                }
                SOPSVIDModeList["SOPSVIDMode"] = sopmodeArr;
            }

            for (let j = 0; j < currentArr.length; j++) {

                let currentEle = currentArr[j];
                let eleName = currentEle.enum;
                let tempo = _elementStruct(currentEle);
                pdo_Obj[eleName] = tempo;
            }
            pdo_Obj["SOPSVIDModeList"] = SOPSVIDModeList
            tempPdos.push(pdo_Obj);

        }

    }
    pdoObj[pdoName] = tempPdos;
    return pdoObj;
}

module.exports = {
    convertCapsJsonFormat: convertCapsJsonFormat
}
