import { mainstore, basemodal } from '../../modals/BaseModal';
import * as Constants from '../../Constants';
import toastNotification from '../../utils/toastNotification';

export default class ProductCapabilityProps {

    constructor(port, dutType = Constants.USBPDDeviceType[3], cableType = Constants.CABLE_DATA_TYPES[0], stateMachineType = Constants.STATE_MACHINE[0]) {
        this.port = port;
        this.dutType = dutType;
        this.cableType = cableType;
        this.portLable = "";
        this.stateMachineType = stateMachineType
    }

    setPortLableType(portLable) {
        this.portLable = portLable
        this.syncToServer();
    }

    setCableType(cableType) {
        this.cableType = cableType
        this.syncToServer();
        if (mainstore.cableSelectionFromDropDownInInformational === false)
            mainstore.complianceCableType = this.cableType
    }

    setDutType(dutType) {
        if (mainstore.isGetDeviceCapsInProgress === false) {
            this.cableTypeSelectionRules(dutType)
        }
        mainstore.selectedMoiTestCase = [];
        this.dutType = dutType
        this.syncToServer();
    }

    setStateMachineType(machineType) {
        mainstore.selectedMoiTestCase = [];
        this.stateMachineType = machineType
        this.syncToServer();
    }

    setvifEditorEditable(editInfo) {
        mainstore.productCapabilityProps.vifEditorEditable = editInfo;
    }

    getCableType() {
        return this.cableType
    }

    getPortLableType() {
        return this.portLable
    }

    getDutType() {
        return this.dutType
    }

    getStateMachineType() {
        return this.stateMachineType
    }

    getvifEditorEditable() {
        return mainstore.productCapabilityProps.vifEditorEditable;
    }

    syncToServer() {
        mainstore.productCapabilityProps.rerenderRandomNum += 1
        basemodal.putPortConfig(this.updateTestList.bind(this));//TODO Use the static method udpateProductCapsPros below
    }

    static udpateProductCapsPros() {
        basemodal.putPortConfig(basemodal.getTestList);
    }

    updateTestList = () => {
        basemodal.getTestList()
    }

    cableTypeSelectionRules(dutTypeSet) {
        if (dutTypeSet === Constants.USBPDDeviceType[5]) {
            if (this.cableType !== Constants.CABLE_DATA_TYPES[5] && this.cableType !== Constants.CABLE_DATA_TYPES[4]) {
                mainstore.previousCableType = this.cableType;
            }
            let alertCabletypeSelected = new toastNotification("Selected test cable type: " + Constants.CABLE_DATA_TYPES[5] + ". Ensure same cable type is selected otherwise select the test cable type appropriately.", Constants.TOAST_INFO, 5000)
            alertCabletypeSelected.show();
            this.setCableType(Constants.CABLE_DATA_TYPES[5]);
        }
        else if (mainstore.captiveCableVal === 1) {
            let alertCabletypeSelected = new toastNotification("Selected test cable type: " + Constants.CABLE_DATA_TYPES[4] + ". Ensure same cable type is selected otherwise select the test cable type appropriately.", Constants.TOAST_INFO, 5000)
            alertCabletypeSelected.show();
            this.setCableType(Constants.CABLE_DATA_TYPES[4]);
        }
        else {
            let alertCabletypeSelected = new toastNotification("Selected test cable type: " + mainstore.previousCableType + ". Ensure same cable type is selected otherwise select the test cable type appropriately.", Constants.TOAST_INFO, 5000)
            alertCabletypeSelected.show();
            this.setCableType(mainstore.previousCableType);
        }
    }

}
