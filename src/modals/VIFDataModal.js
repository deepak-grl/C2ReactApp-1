import * as Constants from '../Constants';
import { mainstore, basemodal } from './BaseModal';
import * as VIF_ENUMS from '../Constants/VIF_ENUMS';
import cleaner from 'deep-cleaner';
import _ from 'lodash';
import { VIFComboBoxRules } from './ComboBoxRules';
import usbif from './usbif.json';
import toastNotification from '../utils/toastNotification';

export class VIFDataModal {
    constructor() {
        this.clearAll();

    }
    clearAll() {
        this.portA = null;//new VIFPortModal(1);
        this.portB = null;//new VIFPortModal(2);
        this.initialized = false;
        this.vifDataModified();
        mainstore.portLabelArrayEntries = [];
        mainstore.isGetCapsEnabled = false;
    }

    clearGetCapsData() {
        let port = this.getCurrentPort(mainstore.currentPortIndex);
        port.setDeviceData(null);
        this.vifDataModified();
        basemodal.putClearGetCapsData();
    }
    vifDataModified() {
        mainstore.vifEditorDataUpdated = mainstore.vifEditorDataUpdated + 1;
    }

    updatedFileJson(fileData) {
        let port = this.getCurrentPort(1);
        port.createJsonStructureForBackend();
    }
    getportA() {
        if (!this.portA) {
            this.portA = new VIFPort(1);
        }
        return this.portA;
    }
    getportB() {
        if (!this.portB) {
            this.portB = new VIFPort(2);
        }
        return this.portB;
    }
    getCurrentPort(portIndex) {
        let port = (portIndex == 1) ? this.getportA() : this.getportB();
        return port;
    }

    loadJson(jsonData, fileOrDevice, portIndex) {
        this.initialized = true;
        if (jsonData) { } else {
            throw Error("json null");
        }
        mainstore.vifFileLoaded = jsonData;
        mainstore.currentPortIndex = portIndex;
        let port = this.getCurrentPort(portIndex);

        if (fileOrDevice === Constants.TYPE_FILE) {
            port.setFileData(jsonData);
            mainstore.testConfiguration.selectedTestList = []
            mainstore.selectedMoiTestCase = [];
        } else if (fileOrDevice === Constants.TYPE_DEVICE) {
            port.setDeviceData(jsonData);
        }

        //Checking the loading VIF from GRL
        var allowGrlXmlToast = new toastNotification("Loaded unsupported VIF, please load the VIF generated from USB-IF official VIF generator tool", Constants.TOAST_ERROR, 5000);
        if (port.fileJson)
            if (mainstore.productCapabilityProps.executionMode === Constants.INFORMATIONAL_MODE) {
                if (fileOrDevice === Constants.TYPE_FILE && port.fileJson.VIF.VIF_App) {
                    var vendorName = port.fileJson.VIF.VIF_App.Vendor._text
                    if (vendorName !== "GRL" && vendorName !== "USB-IF") {
                        allowGrlXmlToast.show();
                        this.clearAll();
                        return allowGrlXmlToast
                    }
                }
            }
            else {
                if (port.fileJson.VIF.VIF_App.Vendor._text !== "USB-IF") {
                    allowGrlXmlToast.show();
                    this.clearAll();
                    return allowGrlXmlToast
                }
            }

        var showValidXmlToast = new toastNotification("Please Provide a Valid XML File", Constants.TOAST_WARN, 4000);
        if (port.fileJson !== undefined && mainstore.isGetCapsEnabled !== true) {
            if (port.fileJson.VIF === undefined) {
                showValidXmlToast.show();
                this.clearAll();
                return showValidXmlToast
            }
        }

        //Checking Version Number
        if (port.fileJson && port.deviceJson === undefined) {
            if (port.fileJson.VIF.VIF_App)
                if (port.fileJson.VIF.VIF_App.Version["_text"].split('.').join("") > Constants.VIF_SUPPORTED_VERSION.split('.').join("")) {
                    basemodal.showPopUp("The current version of software only supports VIF files with version upto  " + [Constants.VIF_SUPPORTED_VERSION] + ". But still user can load other versions of VIF files." + "\n" + "There might be issues with decoding the VIF data, If find any issue in VIF loading, Please report it to support@graniteriverlabs.com", null, 'VIF Version Support', null, null, null, null, null)
                }
        }

        port.createJsonStructureForBackend();

        var pdPortType = port.vif.getComponents()[mainstore.dutPortIndex_C2PortA].getElementByName(VIF_ENUMS.PD_Port_Type);

        if (fileOrDevice === Constants.TYPE_FILE) {
            mainstore.filePdPortTypeValue = pdPortType.getValue();
        }
        var vifProductType = port.vif.getElementByName(VIF_ENUMS.VIF_Product_Type);
        var captiveCable = port.vif.getComponents()[mainstore.dutPortIndex_C2PortA].getElementByName(VIF_ENUMS.Captive_Cable);
        mainstore.captiveCableVal = captiveCable.getValue();
        var typeCStateMachine = port.vif.getComponents()[mainstore.dutPortIndex_C2PortA].getElementByName(VIF_ENUMS.Type_C_State_Machine);
        let typeCStateMachineValue = true;
        if (typeCStateMachine.source && typeCStateMachine.source.fileJson && typeCStateMachine.source.fileJson.USB_PD_Support)
            typeCStateMachineValue = JSON.parse(typeCStateMachine.source.fileJson.USB_PD_Support._attributes.value)

        if (mainstore.isVifLoadedFromProductCaps === true) {
            if (vifProductType && vifProductType.getValue() === 1) {
                mainstore.productCapabilityProps.ports[Constants.PORTA].setDutType(Constants.USBPDDeviceType[5])
            }
            else if (pdPortType) {
                var dutTypeValue = Constants.USBPDDeviceType[pdPortType.getValue()];
                if (dutTypeValue) {
                    mainstore.productCapabilityProps.ports[Constants.PORTA].setDutType(dutTypeValue);
                }
                else if (typeCStateMachine && typeCStateMachineValue === false) {
                    mainstore.productCapabilityProps.ports[Constants.PORTA].setDutType(Constants.USBPDDeviceType[6])
                    mainstore.productCapabilityProps.ports[Constants.PORTA].setStateMachineType(typeCStateMachine.source.fileJson.Type_C_State_Machine._text);
                }
            }

        }
        this.vifDataModified();
        this.numOfPorts();
        this.getPortLabels();
        this.specialCases();
        return port.vif;
    }
    numOfPorts() {
        var components = this.getCurrentPort(mainstore.currentPortIndex).vif.getComponents()
        if (components.length === 1 || 0) {
            mainstore.numberofPorts = true;
        }
        else {
            mainstore.numberofPorts = false;
        }
    }
    getPortLabels() {
        var portLabels = [];
        var fileComponents = this.getCurrentPort(mainstore.currentPortIndex).vif.getComponents();

        fileComponents.forEach((eachComp, index) => {
            var portLabelElement = eachComp.getElementByName(VIF_ENUMS.Port_Label);
            var portLabelElementDecodedValue = (portLabelElement && portLabelElement.elementName !== undefined) ? portLabelElement.getVIFElementValueForTextBox() : null;
            var portLabelDisplayFormat = "Port" + "-" + index + ":" + " Label (" + portLabelElementDecodedValue + ")";
            portLabels.push(portLabelDisplayFormat);
            mainstore.portLabelArrayEntries = portLabels;
        })
    }

    specialCases() {
        var functionalConfigInfo = mainstore.testConfiguration.functionalConfiguration;
        var firstComponent = this.getCurrentPort(mainstore.currentPortIndex).vif.getComponents()[0];
        var typeCCanActAsHostElement = firstComponent.getElementByName(VIF_ENUMS.Type_C_Can_Act_As_Host);
        var typeCCanActAsDeviceElement = firstComponent.getElementByName(VIF_ENUMS.Type_C_Can_Act_As_Device);
        var typeCPortOnHubElement = firstComponent.getElementByName(VIF_ENUMS.Type_C_Port_On_Hub);


        //Based on typeCCanActAsHostValue and typeCCanActAsDeviceValue update functional config moi selection in Ui
        functionalConfigInfo.typeCCanActAsHostValue = typeCCanActAsHostElement.getValue();
        functionalConfigInfo.typeCCanActAsDeviceValue = typeCCanActAsDeviceElement.getValue();
        functionalConfigInfo.typeCPortOnHub = typeCPortOnHubElement.getValue();

        if (mainstore.productCapabilityProps.executionMode === "ComplianceMode") {
            if (functionalConfigInfo.typeCCanActAsHostValue === 0 && functionalConfigInfo.typeCCanActAsDeviceValue === 0)
                this.unSelectTheHSDataAndAutomateDataValidation();
            else {
                functionalConfigInfo.isHSValidationEnabled = true
            }
        }
        else
            this.unSelectTheHSDataAndAutomateDataValidation();
    }

    unSelectTheHSDataAndAutomateDataValidation() {
        mainstore.testConfiguration.functionalConfiguration.isHSValidationEnabled = false
        mainstore.testConfiguration.functionalConfiguration.isValidationAutomated = false
    }

    clearVifFileValues() {
        let port = this.getportA();
        let metadata = basemodal.metaData.metaDataJson;
        let sourcePdoList = port.vif.getComponents()[mainstore.dutPortIndex_C2PortA].getSrcPdoList();
        let snkPdoList = port.vif.getComponents()[mainstore.dutPortIndex_C2PortA].getSnkPdoList();
        let sopPdoList = port.vif.getComponents()[mainstore.dutPortIndex_C2PortA].getSOPSVIDList();
        let cableSvidList = port.vif.getComponents()[mainstore.dutPortIndex_C2PortA].getCableSVIDList();

        for (let i = 0; i < metadata.length; i++) {
            let currentEle = metadata[i].VifFieldEnum;
            let currentEleVifFieldTtype = metadata[i].VifFieldType;
            let vifEle = port.vif.getElementByName(currentEle);
            let compEle = port.vif.getComponents()[mainstore.dutPortIndex_C2PortA].getElementByName(currentEle);

            if (vifEle.json) {
                if (currentEleVifFieldTtype === 2 || currentEleVifFieldTtype === 3) {
                    vifEle.setSelectedIndex(null);
                }
                else {
                    vifEle.setVIFElementDecodedValue("");
                    vifEle.setVIFElementRawValue("");
                }
            }
            else if (compEle.json) {
                if (currentEleVifFieldTtype === 2 || currentEleVifFieldTtype === 3) {
                    compEle.setSelectedIndex(null);
                }
                else {
                    compEle.setVIFElementDecodedValue("");
                    compEle.setVIFElementRawValue("");
                }
            }
        }
        this.clearPdoValues(sourcePdoList);
        this.clearPdoValues(snkPdoList);
        this.clearPdoValues(sopPdoList);
        this.clearPdoValues(cableSvidList);
        basemodal.vifDataModal.vifDataModified()
    }

    clearPdoValues(PdoList) {
        if (PdoList !== null) {
            let pdoArray = PdoList.getCategoriesArray();

            for (let j = 0; j < pdoArray.length; j++) {
                let currentPdo = pdoArray[j];
                let currentPdoRowDatas = currentPdo.getAllRowDatas();
                for (let k = 0; k < currentPdoRowDatas.length; k++) {
                    let currentPdoEleObj = currentPdoRowDatas[k];
                    let currentPdoEle = currentPdoEleObj.fileElement;
                    if (currentPdoEle.json) {
                        currentPdoEle.setVIFElementDecodedValue("");
                        currentPdoEle.setVIFElementRawValue("");
                        currentPdoEle.setSelectedIndex(null)
                    }
                }
            }
        }
    }
}

export class VIFPort {
    constructor(portNumber) {
        this.portNumber = portNumber;
        this.vif = new VIF(null, null);
    }
    getCleanedJson() {
        let cloneJson = JSON.parse(JSON.stringify(this.deviceJson));

        return cleaner(cloneJson, 'localProps');
    }
    setFileData(fileJson) {
        this.fileJson = fileJson;
        let fvif = (fileJson) ? fileJson.VIF : null;
        this.vif.setFileJson(fvif);
    }
    setDeviceData(deviceJson) {
        this.deviceJson = deviceJson;
        let dvif = (deviceJson) ? deviceJson.VIF : null;
        this.vif.setDeviceJson(dvif);
    }

    getCleanedDeviceJson() {
        let cloneJson = JSON.parse(JSON.stringify(this.deviceJson));

        return cleaner(cloneJson, 'localProps');
    }

    getCleanedFileJson() {
        let cloneFileJson = JSON.parse(JSON.stringify(this.fileJson));
        return cleaner(cloneFileJson, 'localProps');
    }


    createJsonStructureForBackend() {
        let allStaticElements = {};
        let comps = this.vif.getComponents();
        let nonComponentVIFElements = [];
        let vifComponents = [];

        nonComponentVIFElements = this._getRowElementsForBackedJson(this.vif.getAllRowDatas());

        comps.forEach(eachComp => {
            allStaticElements = this._getRowElementsForBackedJson(eachComp.getAllRowDatasForBackendJson());
            let vifInfo = {
                "staticPortElements": allStaticElements,
                "sourcePDOs": this._getCategoryStructureForBackedJson(eachComp.getSrcPdoList()),
                "sinkPDOs": this._getCategoryStructureForBackedJson(eachComp.getSnkPdoList()),
                "sVIDs": this._getCategoryStructureForBackedJson(eachComp.getSOPSVIDList().fileJson ? eachComp.getSOPSVIDList() : eachComp.getCableSVIDList()),

            };

            vifComponents.push(vifInfo)
        })
        var vIFInfoModelNew = { nonComponentVIFElements: nonComponentVIFElements, vifComponents: vifComponents }
        mainstore.copyVifInfo = vIFInfoModelNew
        if (mainstore.fivePortTestingFlag) {
            basemodal.putVIFData(mainstore.fivePortPortName.portName, vIFInfoModelNew);
        }
        else {
            if (mainstore.productCapabilityProps.vifFileName !== Constants.VIF_LOAD_BTN_DEFAULT) {
                basemodal.putVIFData(Constants.PORTA, vIFInfoModelNew, this.getReportInputs.bind(this));
            }
        }
    }
    getReportInputs() {
        basemodal.getReportInputs()
    }
    _getRowElementsForBackedJson(allrows) {
        let filteredAllrows = allrows.filter(function (obj) {
            var checkIsElementPresentInMetaData = basemodal.metaData.getElement(obj.elementName)
            if (checkIsElementPresentInMetaData !== null) {
                return obj;
            }
        });
        let elements = filteredAllrows.map(row => {
            let fileEle = row.fileElement;
            let xmlDecodedValue = fileEle.getVIFElementDecodedValue();
            var multiplierValue = fileEle.getMultiplier();
            var typeOfEle = basemodal.metaData.getElementValue(fileEle.elementName, Constants.VIF_ELEMENT_TYPE);
                if (multiplierValue && multiplierValue !== undefined) {
                    if (xmlDecodedValue)
                        if (xmlDecodedValue.includes("mV") || xmlDecodedValue.includes("mA") || xmlDecodedValue.includes("mW") || xmlDecodedValue.includes("msec") || xmlDecodedValue.includes("ns")) {
                            xmlDecodedValue = xmlDecodedValue.split(' ');
                            var xmlDecodedUnit = xmlDecodedValue[1];
                            xmlDecodedValue = xmlDecodedValue[0];
                        }
                }

                let xmlSpecValue = fileEle.getValue();
                if (xmlSpecValue === 1 && typeOfEle === 3) {
                    xmlDecodedValue = "YES"
                }
                else if (xmlSpecValue === 0 && typeOfEle === 3)
                    xmlDecodedValue = "NO"

                if (typeOfEle === 2 && fileEle.comboBoxItems)
                    xmlDecodedValue = fileEle.comboBoxItems[xmlSpecValue]
                let obj = {
                    "enum": fileEle.getElementName(),
                    "specValue": fileEle.getValue(),
                    "decodedValue": xmlDecodedValue,
                    "units": xmlDecodedUnit
                };
                return obj;
        });
        return elements;
    }
    _getCategoryStructureForModeCategoryList(categoryList) {
        if (categoryList != null) {
            let me = this;
            let allModeCategoriesArray = categoryList.getCategoriesArray();
            let vifModeList = [];
            let modeListFormat = [];
            for (let i = 0; i < allModeCategoriesArray.length; i++) {
                let currentModeCategory = allModeCategoriesArray[i];

                vifModeList = me._getRowElementsForBackedJson(currentModeCategory.getAllRowDatas());
                modeListFormat.push({ "vifFieldList": vifModeList, "vifSubFieldList": [] });
            }

            return modeListFormat;
        }
    }

    _getCategoryStructureForBackedJson(categoryList) {
        if (categoryList != null) {
            let allCategoriesArray = categoryList.getCategoriesArray();
            let me = this;
            let pdos = {};

            for (let i = 0; i < allCategoriesArray.length; i++) {
                let currentCategory = allCategoriesArray[i];
                let vifFieldList = me._getRowElementsForBackedJson(currentCategory.getAllRowDatas());
                let vifSubs = [];
                var modeList = [];
                let modes = {};
                if (currentCategory.categoryType === "SOPSVID" || currentCategory.categoryType === "CableSVID") {
                    // following recursive function only executed once as SOPSVID occours only once at top level.

                    vifSubs = me._getCategoryStructureForModeCategoryList(currentCategory.getModeCategoryList());
                    modes = { "vifFieldList": [], "vifSubFieldList": vifSubs };
                    modeList.push(modes);
                }

                pdos[(i + 1)] = { "vifFieldList": vifFieldList, "vifSubFieldList": modeList };
            }
            return pdos;
        }
        else {
            return null;
        }
    }
}
const INVALID_VALUE = "INVALID_VALUE";
/**
 * VIFElement represents a Element in the xml/json static file
 * <Host_Speed value="4">
 *  propertyName is "value"
 *  val is "4"
 *
 * Host_speed is this.name
 *
 */
export class VIFElement {
    constructor(elementName, json, source, rulesMethodRef, elementType) {
        this.elementName = elementName;
        this.json = json;
        this.source = source;
        this.rulesMethodRef = rulesMethodRef;
        this.elementType = elementType;
        this.comboBoxItems = null;
        this.toolTip = null;
        this.updateMinMaxFromMetaData();
        this.updateMultiplierFromMetaData();
    }
    _getLocalProps() {
        if (!this.json) {
            return {};
        }
        if (!this.json.localProps) {
            this.json.localProps = {};
        }
        return this.json.localProps;
    }
    getLocalProperty(propertyName) {
        if (propertyName !== null) {
            return this._getLocalProps()[propertyName];
        } else {
            return null;
        }
    }
    isEmpty() {
        return (this.json) ? false : true;
    }
    isNotEmpty() {
        return !this.isEmpty();
    }
    setIgnore(val) {
        if (this.source && this.source.getVif().isValidationRun) {

        } else {
            this.setLocalProperty(Constants.VIF_IGNORE, val);
        }

    }
    isIgnore() {
        return this.getLocalProperty(Constants.VIF_IGNORE);
    }
    validateCurrentValue() {
        let currentVal = this.getValue();
        this.setPropertyValue(Constants.STR_VALUE, currentVal);
    }
    /**
     * setPropertyValue() will call rules engine, setLocalProperty() wont
     */
    setLocalProperty(propertyName, val, specialProp = false) {
        if (propertyName !== null && this.isNotEmpty()) {
            if (specialProp) {
                this._getLocalProps()[propertyName] = val;
            }
            if (this.isLiveMode(this._getLocalProps()[propertyName], val)) {
                this._getLocalProps()[propertyName] = val;
            }
        } else {
            return null;
        }
    }
    setPropertyValue(propertyName, val) {

        if (this.rulesMethodRef) {
            if (this.rulesMethodRef(this.source, this, propertyName, val)) {
                if (Constants.STR_TEXT === propertyName) {
                    if (this.isLiveMode(this.json._text, val)) {
                        this.json._text = val;
                        let multiplierValue = this.getMultiplier();
                        if (multiplierValue !== null && multiplierValue !== undefined) {
                            if (this.json._attributes) {
                                this.json._attributes.value = (val / multiplierValue)
                            };
                        }
                    }
                } else {
                    if (this.json) {
                        let lref = this._getAttribute(this.json);
                        let lrefVal = lref.value;
                        if (!isNaN(lrefVal)) {
                            lrefVal = lrefVal * 1;          //multiplying by 1 to convert string to int value
                        }

                        if (this.isLiveMode(lrefVal, val)) {
                            this._getAttribute(this.json).value = val;
                        }
                    }
                }
            }
        }

        return val;
    }
    isLiveMode(currentVal, newVal) {
        let isRun = (this.source) ? this.source.getVif().isValidationRun : true;
        if (isRun) {
            if (currentVal && currentVal !== newVal) {
                this.setLocalProperty(INVALID_VALUE, true, true);
            }
            return false;
        }
        return true;
    }
    _getAttribute(json) {
        if (!json._attributes) {
            json._attributes = {};
        }
        return json._attributes;
    }
    setSelectedIndex(index) {
        if (this.source && this.source.getVif().isValidationRun) {
            if (index !== this.getValue()) {
                this.setLocalProperty(INVALID_VALUE, true, true);
            }
        }
        else {
            this.setLocalProperty(INVALID_VALUE, false, true);
            this.setLocalProperty(Constants.VIF_CURRENTDROPDOWNINDEX, index);
            this.setVIFElementRawValue(index);
        }
    }

    getSelectedIndex() {
        if (this.getLocalProperty(Constants.VIF_CURRENTDROPDOWNINDEX) === undefined || this.getLocalProperty(Constants.VIF_CURRENTDROPDOWNINDEX === null)) {
            if (this.getValue() === true) {
                this.setLocalProperty(Constants.VIF_CURRENTDROPDOWNINDEX, Constants.VIF_YES);
            }
            else if (this.getValue() === false) {
                this.setLocalProperty(Constants.VIF_CURRENTDROPDOWNINDEX, Constants.VIF_NO);
            }
            else {
                this.setLocalProperty(Constants.VIF_CURRENTDROPDOWNINDEX, this.getValue());
            }
        }
        return this.getLocalProperty(Constants.VIF_CURRENTDROPDOWNINDEX);

    }
    getTextValueForDropDown() {
        return this.comboBoxEntries()[this.getSelectedIndex()];
    }

    isDropDown() {
        if (this.json) {
            return (this.comboBoxEntries().length) ? true : false;
        }
        return false;
    }
    getElementName() {
        return this.elementName;
    }
    getVIFElementValueForTextBox() {
        let xmlDecodedValue = this.getVIFElementDecodedValue();
        var multiplierValue = this.getMultiplier();
        if (multiplierValue && multiplierValue !== undefined) {
            if (xmlDecodedValue.includes("mV") || xmlDecodedValue.includes("mA") || xmlDecodedValue.includes("mW") || xmlDecodedValue.includes("msec") || xmlDecodedValue.includes("ns")) {
                xmlDecodedValue = xmlDecodedValue.split(' ');
                xmlDecodedValue = xmlDecodedValue[0];
            }
        }
        if (xmlDecodedValue === null || xmlDecodedValue === undefined) {
            xmlDecodedValue = this.getValue();
        }
        if (this.elementName === VIF_ENUMS.Snk_PDO_Supply_Type || this.elementName === VIF_ENUMS.Src_PDO_Supply_Type) {
            xmlDecodedValue = this.getValue();
        }

        return xmlDecodedValue;
    }
    getVIFElementDecodedValue() {
        return (this.json) ? (this.json._text) : null;
    }

    getValue() {
        let val = (this.json && this.json._attributes) ? this.json._attributes.value : "";
        if (val) {
            if (typeof (val) === "string") {
                if (val === "true")
                    val = Constants.VIF_YES;
                else if (val === "false")
                    val = Constants.VIF_NO;
                else if (isNaN(val)) // "abc is true"
                {
                    this.json._text = val;
                }
                else { // everything here is a number
                    val = JSON.parse(val);
                }
            }
        }
        return val;
    }
    updateMinMaxFromMetaData() {
        this.setMinValue(basemodal.metaData.getElementValue(this.elementName, Constants.VIF_MINVALUE));
        this.setMaxValue(basemodal.metaData.getElementValue(this.elementName, Constants.VIF_MAXVALUE));
    }
    updateMultiplierFromMetaData() {
        this.setMultiplier(basemodal.metaData.getElementValue(this.elementName, Constants.VIF_MULTIPLIER));
    }

    setMinValue(val) {
        this.setLocalProperty(Constants.VIF_MINVALUE, val);
    }
    setMaxValue(val) {
        this.setLocalProperty(Constants.VIF_MAXVALUE, val);
    }
    setMultiplier(val) {
        this.setLocalProperty(Constants.VIF_MULTIPLIER, val);
    }
    getMinValue() {
        return this.getLocalProperty(Constants.VIF_MINVALUE);
    }
    getMaxValue() {
        return this.getLocalProperty(Constants.VIF_MAXVALUE);
    }
    getMultiplier() {
        return this.getLocalProperty(Constants.VIF_MULTIPLIER);
    }
    comboBoxEntries() {
        if (!this.comboBoxItems) {
            this.comboBoxItems = basemodal.metaData.getElementValue(this.elementName, Constants.VIF_COMBOBOXENTRIES);
        }
        return this.comboBoxItems;

    }
    getUnitsForTextBox() {
        if (!this.comboBoxUnits) {
            this.comboBoxUnits = basemodal.metaData.getElementValue(this.elementName, Constants.VIF_TEXTBOXUNITS);
        }
        return this.comboBoxUnits;
    }

    setVIFElementRawValue(val) {
        this.setPropertyValue(Constants.STR_VALUE, val);
        basemodal.vifDataModal.specialCases();
    }
    setVIFElementDecodedValue(val) {
        this.setPropertyValue(Constants.STR_TEXT, val);
        this.minMaxValidation(val);
        return true;
    }
    minMaxValidation(val) {
        if (this.isDropDown()) {

        } else {
            if (this.getMinValue() && this.getMaxValue()) {
                if (val < this.getMinValue() || val > this.getMaxValue()) {
                    this.setLocalProperty(INVALID_VALUE, true, true);
                }
                else {
                    //this.invalidValue = false;
                    this.setLocalProperty(INVALID_VALUE, false, true);
                }
            }
        }
    }
    isInValidValue() {
        if (this.getLocalProperty(INVALID_VALUE)) {
            return true;
        }
        return false;
    }

    decodedValueValidation() {
        var multiplierValue = this.getMultiplier();
        let me = this;
        var mismatchedDecodedValue = false;
        mainstore.toolTipForVifEditor = "";
        if (multiplierValue && multiplierValue !== undefined) {
            var multipliedDecodedValue = (me.getValue() * multiplierValue);
            var xmlDecodedValue = me.getVIFElementDecodedValue();
            if (xmlDecodedValue.includes("mV") || xmlDecodedValue.includes("mA") || xmlDecodedValue.includes("mW") || xmlDecodedValue.includes("msec") || xmlDecodedValue.includes("ns")) {
                xmlDecodedValue = xmlDecodedValue.split(' ');
                var xmlDecodedValueOnly = xmlDecodedValue[0];
                //var xmlDecodedUnit = xmlDecodedValue[1];
                if (String(xmlDecodedValueOnly) !== String(multipliedDecodedValue)) {
                    mismatchedDecodedValue = true;
                    mainstore.toolTipForVifEditor = Constants.DecodedValueMismatch;
                }
            }
        }
        return mismatchedDecodedValue
    }
}
//------------RowData------------------
export class VIFRowData {
    constructor(elementName, fileJson, deviceJson, source, rulesMethodRef) {
        this.elementName = elementName;
        this.fileElement = new VIFElement(elementName, fileJson, source, rulesMethodRef, Constants.TYPE_FILE);
        this.deviceElement = new VIFElement(elementName, deviceJson, source, rulesMethodRef, Constants.TYPE_DEVICE);
        this.source = source;
        this.rulesMethodRef = rulesMethodRef;


    }
    _createRowString(categoryName, pdoIndex, name) {
        return categoryName + Constants.ID_SEPERATOR + pdoIndex + Constants.ID_SEPERATOR + name;
    }
    printlog() {
        //   
    }

    setItem(dataFor, element) {
        if (Constants.TYPE_FILE === dataFor) {
            this.fileElement = element;
        } else if (Constants.TYPE_DEVICE === dataFor) {
            this.deviceElement = element;
        }
    }
    getElementName() {
        var dispName = "x";
        if (this.fileElement.getElementName()) {
            dispName = this.fileElement.getElementName();
        } else if (this.deviceElement.getElementName()) {
            dispName = this.deviceElement.getElementName();
        }
        return dispName;
    }
    isValueMisMatched() {
        let fileEle = this.fileElement;
        let deviceEle = this.deviceElement;
        var typeOfEle = basemodal.metaData.getElementValue(deviceEle.elementName, Constants.VIF_ELEMENT_TYPE);
        if (fileEle.json && deviceEle.json) {
            let fdecodeVal = fileEle.getVIFElementValueForTextBox();
            var typeOfEle = basemodal.metaData.getElementValue(fileEle.elementName, Constants.VIF_ELEMENT_TYPE);
            let ddecodeVal = deviceEle.getVIFElementValueForTextBox();
            if (typeOfEle === 2) {
                var comboBoxEntriesForCurrentEle = basemodal.metaData.getElementValue(deviceEle.elementName, Constants.VIF_METADATA_COMBOBOXENTRY);
                var deviceentry = comboBoxEntriesForCurrentEle[parseInt(ddecodeVal)];
                var fileentry = comboBoxEntriesForCurrentEle[parseInt(fdecodeVal)];
                if (fileentry && fileentry !== undefined) {
                    fileentry = fileentry.split(":");
                    fdecodeVal = fileentry[1];
                }
                else {
                    fdecodeVal = fileentry;
                }
                if (deviceentry && deviceentry !== undefined) {
                    deviceentry = deviceentry.split(":");
                    ddecodeVal = deviceentry[1];
                }
                else {
                    ddecodeVal = deviceentry;
                }

            }

            if (typeOfEle === 3 && fdecodeVal === 1)
                fdecodeVal = "YES";
            else if (typeOfEle === 3 && fdecodeVal === 0)
                fdecodeVal = "NO";
            if (fdecodeVal && ddecodeVal) {
                if (fdecodeVal.toString() !== ddecodeVal.toString()) {
                    return true;
                }
            }
        }
        return false;
    }

}
//-------------------------VIFBaseObject---------------------
class VIFBaseObject {
    constructor(fileJson, deviceJson, parent, rulesMethodRef) {
        this.fileJson = (fileJson) ? fileJson : this.getEmptyjson();
        this.deviceJson = (deviceJson) ? deviceJson : this.getEmptyjson();
        this.parent = parent;
        this.rulesMethodRef = rulesMethodRef;

        this.allRowDatas = null;
        if (fileJson || deviceJson) {
            this.allRowDatas = null;
            this.getAllRowDatas();
        }
        this.emptyElement = new VIFElement();
    }
    fjItem(ofType) {
        let item = (this.fileJson) ? this.fileJson[ofType] : null;
        return item;
    }
    djItem(ofType) {
        let item = (this.deviceJson) ? this.deviceJson[ofType] : null;
        return item;
    }
    getVif() {
        return null;
    }
    getEmptyjson() {
        return null;
    }
    /*getOnlyElements(keys, tjson){
        var onlyElements = keys.filter((key) => {
            return typeof(tjson[key]) != "object";
        });
        return onlyElements;
    }*/
    /**
     * Gets all VIFRowData in a Array
     */
    getAllRowDatas() {
        if (this.allRowDatas) {
            return this.allRowDatas;
        }
        return this.reCreateRowDatas();
    }
    validateRows() {
        let allRows = this.getAllRowDatas();
        allRows.forEach(row => {
            row.fileElement.validateCurrentValue();
        });
        return allRows;
    }
    reCreateRowDatas() {
        this.allRowDatas = [];
        if (this.fileJson) {
            var fileKeys = Object.keys(this.fileJson);
            //let onlyFileElements = this.getOnlyElements(this.fileJson);

            //let onlyDeviceElements = this.getOnlyElements(this.deviceJson);
            /**
             * Loop through file and device Elements and create VIFRowData objects
             */

            for (let x = 0; x < fileKeys.length; x++) {
                let key = fileKeys[x];

                let fileJsonEle = this.fileJson[key];
                let deviceJsonEle = null; // initially all device elements are null, will be set in next loop
                if (fileJsonEle['_attributes'] || fileJsonEle['_text']) {
                    let vifRowData = new VIFRowData(key, fileJsonEle, deviceJsonEle, this, this.rulesMethodRef);
                    this.allRowDatas.push(vifRowData);
                }
            }
        }
        if (this.deviceJson) {
            var deviceKeys = Object.keys(this.deviceJson);

            /**
             * Set or add device elements in the RowData
             */
            for (let y = 0; y < deviceKeys.length; y++) {
                var elementName = deviceKeys[y];
                var rowData = this.getRowDataIfAlreadyExists(elementName);
                var deviceJsonEle = this.deviceJson[elementName];
                if (rowData) {
                    //rowData.deviceElement = deviceJsonEle;
                    rowData.deviceElement = new VIFElement(elementName, deviceJsonEle, this, this.rulesMethodRef, Constants.TYPE_DEVICE);
                } else {
                    let fileJsonEle = null;
                    if ((deviceJsonEle['_attributes'] || deviceJsonEle['_text'])) {
                        let vifRowData = new VIFRowData(elementName, fileJsonEle, deviceJsonEle, this, this.rulesMethodRef);
                        this.allRowDatas.push(vifRowData);

                    }
                }
                if (elementName === VIF_ENUMS.PD_Port_Type) {
                    mainstore.devicePdPortTypeValue = parseInt(deviceJsonEle['_attributes'].value)
                }
            }
        }
        return this.allRowDatas;
    }
    getRowDataIfAlreadyExists(key) {
        var allrows = this.allRowDatas;//getAllRowDatas();
        let length = 0;
        if (allrows)
            length = allrows.length;
        for (let i = 0; i < length; i++) {
            let rowData = allrows[i];
            if (rowData.elementName === key) {
                return rowData;
            }
        }
        return null;
    }
    getElementByName(name) {
        var rowdata = this.getRowDataIfAlreadyExists(name);
        if (rowdata) {
            return rowdata.fileElement;
        }
        return this.emptyElement;
    }
    getElementValueOf(elementName) {
        var ele = this.getElementByName(elementName);
        if (ele) {
            return ele.getValue();
        }
        return null;
    }
    setElementValueOf(elementName, value) {
        var ele = this.getElementByName(elementName);
        ele.setVIFElementRawValue(value);
    }

}
//-------------------------VIF---------------------
export class VIF extends VIFBaseObject {
    constructor(fileJson, deviceJson) {
        super(fileJson, deviceJson, null, basemodal.rulesEngine.onVIF_setVIFElementPropertyValue);
        this.allComponents = [];
        this.displayName = "VIF";
        this.isValidationRun = false;
    }
    getVif() {
        return this;
    }

    copyDeviceDataToFileData() {
        var emptyJson = this.getEmptyjson();
        var isDeviceDataEmpty = _.isEqual(this.deviceJson, emptyJson);
        if (!isDeviceDataEmpty) {
            this.fileJson = this.deviceJson;
            this.setFileJson(this.fileJson);
        }
        basemodal.vifDataModal.vifDataModified()
    }
    setFileJson(fileJson) {
        //
        this.allComponents = [];
        this.fileJson = fileJson;
        this.reCreateRowDatas();
        this.runValidator();
    }
    runValidator() {
        this.isValidationRun = true;
        /**
         * get each rowdata and set it back for validation check
         */
        this.allComponents.forEach(eachComp => {
            eachComp.validateRows();
        });
        this.isValidationRun = false;

        this.allComponents.forEach(eachComp => {
            eachComp.validateComboValuesByComboBoxRules();
        });
    }
    setDeviceJson(deviceJson) {
        this.deviceJson = deviceJson;

        this.reCreateRowDatas();
    }
    reCreateRowDatas() {
        super.reCreateRowDatas();
        //this.getComponent().reCreateRowDatas();
        this._createAllComponents();
        this.allComponents.forEach(eachComp => {
            eachComp.resetNewFileUploaded();
        });
    }
    getEmptyjson() {
        return {
            "Component": {
                "SrcPdoList": {
                    "SrcPDO": []
                },
                "SnkPdoList": {
                    "SnkPDO": []
                },
                "SOPSVIDList": {
                    "SOPSVID": []
                },
                "CableSVIDList": {
                    "CableSVID": []
                }
            }
        };
    }
    _createAllComponents() {
        this.allComponents = [];
        let tempCompsDeviceJson = null;
        if (this.deviceJson) {
            //this.deviceJson["VIF"] = {};
            tempCompsDeviceJson = this.deviceJson["Component"];
            var usbVidEle = tempCompsDeviceJson[VIF_ENUMS.USB_VID];
            var usbVidSopEle = tempCompsDeviceJson[VIF_ENUMS.USB_VID_SOP];
            if (usbVidEle || usbVidSopEle) {
                //TODO Display Vendor Name based on USB_VID in VIF section
                var vendorName = "";
                if (usbVidEle) {
                    var usbVidEleDecodedValue = usbVidEle["_text"];
                    var decimalVal = parseInt(usbVidEleDecodedValue, 16);
                    vendorName = basemodal.usbIf.getElementByVidValue(decimalVal);
                }
                else if (usbVidSopEle) {
                    var usbVidSopEleDecodedValue = usbVidSopEle["_text"];
                    var decimalVal = parseInt(usbVidSopEleDecodedValue, 16);
                    vendorName = basemodal.usbIf.getElementByVidValue(decimalVal);
                }
                //let test =["VIF"];
                tempCompsDeviceJson[VIF_ENUMS.Vendor_Name] = {
                    "_text": vendorName
                };

            }
        }
        if (this.fileJson) {
            let compList = this.fileJson["Component"];
            if (!Array.isArray(compList)) {
                this.fileJson["Component"] = [compList];
            }
            this.fileJson["Component"].forEach(eachComp => {
                var tempComp = new Component(eachComp, tempCompsDeviceJson, this);
                tempCompsDeviceJson = null; // reset to null after the first use.
                this.allComponents.push(tempComp);
            });
        }

    }
    getComponents() {
        if (!this.allComponents.length) {
            this._createAllComponents();
        }
        return this.allComponents;
    }
}
/**
 * Component will have
 * (1) elements (variables) and
 * (2) a CategoryList for each of SourcePDO, SinkPDO and Svidlist
 */
//-------------------------Component---------------------
export class Component extends VIFBaseObject {
    constructor(fileJson, deviceJson, vif) {
        super(fileJson, deviceJson, vif, basemodal.rulesEngine.onComponent_setVIFElementPropertyValue);
        this.displayName = "Component";
        this.srcPdoList = null;
        this.snkPdoList = null;
        this.sopSvidList = null;
        this.cableSvidList = null;
        this.removedRowDatas = [];
        this.filteredRowDatas = [];
        //  These variables are only for UI
        this.UI_isPortExpanded = false;
        this.UI_isComponentExpanded = false;
    }
    getVif() {
        return this.parent;
    }
    validateRows() {
        super.validateRows();
        this.getSrcPdoList().validateRows();
        this.getSnkPdoList().validateRows();
        this.getSOPSVIDList().validateRows();
        this.getCableSVIDList().validateRows();
        // this.getSopSvidModeList().validateRows();
    }
    validateComboValuesByComboBoxRules() {
        this.getSrcPdoList().validateComboValuesByComboBoxRules();
        this.getSnkPdoList().validateComboValuesByComboBoxRules();
        this.getSOPSVIDList().validateComboValuesByComboBoxRules();
        this.getCableSVIDList().validateComboValuesByComboBoxRules();
    }
    resetNewFileUploaded() {
        this.filteredRowDatas = [];
    }
    reCreateRowDatas() {
        super.reCreateRowDatas();
        this.srcPdoList = null;
        this.snkPdoList = null;
        this.sopSvidList = null;
        this.cableSvidList = null;
    }
    getSrcPdoList() {
        if (!this.srcPdoList) {
            this.srcPdoList = new CategoryList(this.fjItem("SrcPdoList"), this.djItem("SrcPdoList"), this, Constants.SrcPDO);
        }
        return this.srcPdoList;
    }
    getSnkPdoList() {
        if (!this.snkPdoList) {
            this.snkPdoList = new CategoryList(this.fjItem("SnkPdoList"), this.djItem("SnkPdoList"), this, Constants.SnkPDO);
        }
        return this.snkPdoList;
    }
    getSOPSVIDList() {
        if (!this.sopSvidList) {
            this.sopSvidList = new CategoryList(this.fjItem("SOPSVIDList"), this.djItem("SOPSVIDList"), this, Constants.SopSVID);
        }
        return this.sopSvidList;
    }
    getCableSVIDList() {
        if (!this.cableSvidList) {
            this.cableSvidList = new CategoryList(this.fjItem("CableSVIDList"), this.djItem("CableSVIDList"), this, Constants.CableSVID);
        }
        return this.cableSvidList;
    }
    // getSopSvidModeList() {
    //     if (!this.sopSvidModeList) {
    //         this.sopSvidModeList = new CategoryList(this.fileJson.CableSVIDList, this.deviceJson.CableSVIDList, this, Constants.CableSVID);
    //     }
    //     return this.sopSvidModeList;
    // }
    getAllRowDatas() {
        let allrows = super.getAllRowDatas();
        this.removedRowDatas = [];
        if (allrows) {
            let rowLength = allrows.length;
            this.filteredRowDatas = [];

            for (let i = 0; i < rowLength; i++) {
                let row = allrows[i];
                let rowElementName = row.getElementName();
                let matched = false;
                for (let j = 0; j < Constants.REMOVE_ELEMENTS.length; j++) {
                    if (rowElementName === Constants.REMOVE_ELEMENTS[j]) {
                        matched = true;
                    }
                }
                if (matched) {
                    this.removedRowDatas.push(row);
                } else {
                    this.filteredRowDatas.push(row);
                }
            }
            return this.filteredRowDatas;
        }
        return [];
    }

    getAllRowDatasForBackendJson() {
        let filteredRows = this.getAllRowDatas();
        let removedRowDatas = this.removedRowDatas;
        let allRows = filteredRows.concat(removedRowDatas);
        return allRows;
    }
}


/**
 * CategoryList will have
 * (1) elements(variables) and
 * (2) Array of SrcPDO's, SinkPDO's and SvidList (allCategories)
 */
export class CategoryList extends VIFBaseObject {  //SrcPdoList
    constructor(fileJson, deviceJson, component, categoryType) {
        super(fileJson, deviceJson, component, basemodal.rulesEngine.onCategoryList_setVIFElementPropertyValue);

        if (fileJson) {
            let catList = fileJson[categoryType];
            //
            if (!Array.isArray(catList)) {
                let catListAsArray = [catList];
                this.fileJson[categoryType] = catListAsArray;
            }
            let catList2 = fileJson[categoryType];
        }
        this.categoryType = categoryType;
        this.categoryArray = [];
        this.categoryListSpecificComponentRowDatas = [];
        this.filteredCONSTANTRef = [];

        //  These variables are only for UI
        this.UI_isCategoryListExpanded = true;
        if (categoryType === Constants.SrcPDO) {
            this.displayName = "Source Power Profile";
            this.filteredCONSTANTRef = Constants.SOURCE_PDO_SPECIFIC_ELEMENTS_STOREDIN_COMPONENT;
        }
        else if (categoryType === Constants.SnkPDO) {
            this.displayName = "Sink Power Profile";
            this.filteredCONSTANTRef = Constants.SINK_PDO_SPECIFIC_ELEMENTS_STOREDIN_COMPONENT;
        }
        else if (categoryType === Constants.SopSVID) {
            this.displayName = "SVID Info";
            this.filteredCONSTANTRef = Constants.SVID_PDO_SPECIFIC_ELEMENTS_STOREDIN_COMPONENT;
        }
        else if (categoryType === Constants.CableSVID) {
            this.displayName = "Cable SVID Info";
            this.filteredCONSTANTRef = Constants.CABLE_SVID_PDO_SPECIFIC_ELEMENTS_STOREDIN_COMPONENT;
        }
    }
    getVif() {
        return this.parent.getVif();
    }
    validateRows() {
        this.getCategoriesArray().forEach(eachCategory => {
            eachCategory.validateRows();
        });
    }
    validateComboValuesByComboBoxRules() {
        this.getCategoriesArray().forEach(eachCategory => {
            eachCategory.validateComboValuesByComboBoxRules();
        });
    }
    reCreateRowDatas() {
        this.getCategoriesArray().forEach(eachCategory => {
            eachCategory.reCreateRowDatas();
        });

    }
    getCategoryListSpecificRowDatas() {
        let removedRows = this.parent.removedRowDatas;
        let categoryListSpecificComponentRowDatas = [];
        if (removedRows) {
            for (let i = 0; i < removedRows.length; i++) {
                let row = removedRows[i];
                let rowElementName = row.getElementName();
                for (let j = 0; j < this.filteredCONSTANTRef.length; j++) {
                    if (rowElementName === this.filteredCONSTANTRef[j]) {
                        categoryListSpecificComponentRowDatas.push(row);
                    }
                }
            }
        }
        return categoryListSpecificComponentRowDatas;
    }
    /**
     * Gets list of Categories
     */
    getCategoriesArray() {
        this.categoryArray = [];
        if (this.fileJson) {
            let fileCatJson = (this.fileJson) ? this.fileJson[this.categoryType] : null;
            let deviceCatJson = (this.deviceJson) ? this.deviceJson[this.categoryType] : null;
            /**
             * Largest Category Array between FileCategory Array and DeviceCategory Array
             */
            let fileCatJsonLength = (fileCatJson) ? fileCatJson.length : 0;
            let deviceCatJsonLength = (deviceCatJson) ? deviceCatJson.length : 0;
            let largestCatLengh = (fileCatJsonLength > deviceCatJsonLength) ? fileCatJsonLength : deviceCatJsonLength;
            for (var i = 0; i < largestCatLengh; i++) {
                let fcatJson = (fileCatJson) ? fileCatJson[i] : null;
                let dcatJson = (deviceCatJson) ? deviceCatJson[i] : null;

                let cat = new Category(fcatJson, dcatJson, this, this.categoryType, i);
                this.categoryArray.push(cat);
            }
        }
        return this.categoryArray;
    }
    resizeCategoryArray(newLength) {
        if (newLength <= 0) {
            return;
        }
        let fileCatJson = this.fileJson[this.categoryType];
        let deviceCatJson = this.deviceJson[this.categoryType];

        this._resizeCategoryArrayFor(fileCatJson, newLength);
        this._resizeCategoryArrayFor(deviceCatJson, newLength);
    }
    _resizeCategoryArrayFor(jsonArray, newLength) {
        let jsonArrayLength = jsonArray.length;
        if (jsonArrayLength > 0) {
            let diff = newLength - jsonArrayLength;
            if (diff > 0) {
                let firstCategory = jsonArray[0];
                for (let x = 0; x < diff; x++) {
                    jsonArray.push(firstCategory);
                }
            }
            else if (diff < 0) {
                jsonArray.length = newLength;
            }
        }
    }
}

export class Category extends VIFBaseObject {
    constructor(fileJson, deviceJson, categoryList, categoryType, index) {
        super(fileJson, deviceJson, categoryList, basemodal.rulesEngine.onCategory_setVIFElementPropertyValue);
        this.categoryType = categoryType;
        this.categoryIndex = index;
        this.displayName = categoryType + "-" + (index + 1);

        this.subCategories = this.getModeCategoryList();
    }
    /**
     * For special cases
     */
    getModeCategoryList() {
        if (this.categoryType === "SOPSVID" || this.categoryType === "CableSVID") {
            let modeCategoryMode = this.categoryType + "Mode";
            let modeCategoryModeFullName = modeCategoryMode + "List";
            let comp = this.parent;
            let tCategoryList = new ModeCategoryList(this.fileJson[modeCategoryModeFullName], this.deviceJson[modeCategoryModeFullName], comp, modeCategoryMode);
            return tCategoryList;
        }
        return null;
    }
    getVif() {
        return this.parent.getVif();
    }
    getEmptyjson() {
        return {};
    }
    setElement(name, val) {
        this._dict[name] = val;
        return basemodal.rulesEngine.onCategorySetElement(this, name, val);
    }
    validateComboValuesByComboBoxRules() {
        let allRows = super.validateRows();
        allRows.forEach(row => {
            this.getVif().getComponents().forEach(eachComp => {
                basemodal.vifComboBoxRules.rule_Categories(this, eachComp);
            });
        });
    }
}
export class ModeCategoryList extends CategoryList {
    constructor(fileJson, deviceJson, component, categoryType) {
        super(fileJson, deviceJson, component, categoryType);
    }
}
export class MetaData {
    constructor(json) {
        this.metaDataJson = json.default;
    }
    getElement(elementName) {
        var len = this.metaDataJson.length;
        for (var i = 0; i < len; i++) {
            var current = this.metaDataJson[i];
            if (current.VifFieldEnum === elementName) {
                return current;
            }
        }
        return null;
    }
    getElementValue(elementName, propertyName) {
        let ele = this.getElement(elementName);
        if (ele) {
            return ele[propertyName];
        } else {
            if (elementName !== undefined)
                if (mainstore.skipMissingVIFFieldToast === null) {
                    mainstore.skipMissingVIFFieldToast = new toastNotification(` Identified invalid VIF field , Please report it to support@graniteriverlabs.com, But still user can continue using this software`, Constants.TOAST_ERROR, 5000);
                    mainstore.skipMissingVIFFieldToast.show();
                }
        }
        return '-!-';
    }
}

export class UsbIf {
    constructor(json) {
        this.usbIfJson = json.default;
    }
    getElementByVidValue(usbVidValue) {
        var len = this.usbIfJson.length;
        for (var i = 0; i < len; i++) {
            var currentField = this.usbIfJson[i];
            if (parseInt(currentField.field_vid) === usbVidValue) {
                return currentField.name;
            }
        }
        return null;
    }
}

