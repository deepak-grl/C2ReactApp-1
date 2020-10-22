import React, { Component } from "react"
import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { PC_FILE_CONVERTER_BTN } from '../../Constants/tooltip';
import FlexView from 'react-flexview/lib';
import * as Constants from '../../Constants';
import VIFEditor from './VIFEditor';
import utils from '../../utils';
import { basemodal, mainstore } from '../../modals/BaseModal';
import { observer } from 'mobx-react';
import VIFLoadComponent from "./VIFLoadComponent";
import PortConfigComponent from "./PortConfigComponent";
import NewProjectButton from "../PanelTestConfig/NewProjectButton";
import fileDownloader from 'js-file-download';
import ProductCapabilityProps from "./ProductCapabilityProps";
var convert = require('xml-js');

let informationalCableType = "";
var compilanceModeSelected = "";
const ProductCapabilityComponent = observer(

    class ProductCapabilityComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {
                vifFileData: null,
                vifDeviceData: null,
                generateVIFFileDeviceData: "Generate VIF(Device Data)",
            };

        }

        appModeSelectionRadBtnClick = (event) => {
            if (mainstore.isVifFieldChange || mainstore.loadedVifVendorName !== "USB-IF") {
                if (mainstore.isVifXmlLoaded)
                    basemodal.showPopUp(mainstore.loadedVifVendorName === "USB-IF" ? Constants.USB_IF_LOADEDVIF : Constants.NON_USB_IFLOADED_VIF, null, 'VIF fields Changed', null, false, 'OKCancel', null, this.showNewVIF.bind(this, event.currentTarget.value))
            }
            if (!mainstore.isVifFieldChange && !mainstore.popUpInputs.displayPopUp) {
                this.appMode(event.currentTarget.value)
            }
        }


        appMode = (selectedAppMode) => {
            mainstore.productCapabilityProps.executionMode = selectedAppMode
            if (mainstore.productCapabilityProps.executionMode === "ComplianceMode") {
                informationalCableType = mainstore.productCapabilityProps.ports[Constants.PORTA].cableType
                mainstore.productCapabilityProps.ports[Constants.PORTA].cableType = mainstore.complianceCableType
                mainstore.vifEditorEditable = true;
            }
            else if (mainstore.vifEditableOnlyInInformationalMode) {
                mainstore.vifEditorEditable = false;
            }
            else {
                if (mainstore.cableSelectionFromDropDownInInformational === false && mainstore.loadSelectedCableFromBackend === false)
                    mainstore.productCapabilityProps.ports[Constants.PORTA].cableType = mainstore.complianceCableType
                else
                    mainstore.productCapabilityProps.ports[Constants.PORTA].cableType = informationalCableType
                mainstore.vifEditorEditable = true;
            }
            basemodal.putPortConfig()
            basemodal.vifDataModal.specialCases()           //To set functional moi values(Enable USB Data Validation) while changing the btwn compliance and info mod
        }

        showNewVIF = (selectedMode) => {
            if (mainstore.popUpInputs.responseButton === "Ok") {
                mainstore.isVifFieldChange = false;
                if (mainstore.loadedVifVendorName === "USB-IF")
                    basemodal.vifDataModal.loadJson(JSON.parse(JSON.stringify(mainstore.copyLoadedXmlVif)), Constants.TYPE_FILE, 1);
                this.appMode(selectedMode)
                if (selectedMode === "ComplianceMode" && mainstore.loadedVifVendorName !== "USB-IF") {
                    this.clearLoadedGeneratedDeviceDataFromInfoToCompMode()
                }
            }
        }

        clearLoadedGeneratedDeviceDataFromInfoToCompMode() {
            if (mainstore.popUpInputs.responseButton === "Ok")
                if (basemodal.vifDataModal.portA.fileJson && mainstore.loadedVifVendorName !== "USB-IF") {
                    basemodal.vifDataModal.clearAll();
                    basemodal.vifDataModal.clearVifData()
                }
        }

        copyDeviceData() {
            if (basemodal.vifDataModal.portA && mainstore.getCapsPortNumber === 1)
                basemodal.vifDataModal.portA.vif.copyDeviceDataToFileData()

            else if (basemodal.vifDataModal.portB && mainstore.getCapsPortNumber === 2)
                basemodal.vifDataModal.portB.vif.copyDeviceDataToFileData()

        }

        generateVIFFile = () => {
            var parsedJson = null;
            if (mainstore.getCapsPortNumber === 1)
                parsedJson = basemodal.vifDataModal.getportA().getCleanedDeviceJson();
            else if (mainstore.getCapsPortNumber === 2)
                parsedJson = basemodal.vifDataModal.getportB().getCleanedDeviceJson();

            if (parsedJson)
                if (parsedJson.VIF && parsedJson.VIF.VIF_App)
                    parsedJson.VIF.VIF_App.Vendor["_text"] = "GRL"          //changing the Vendor Name for the Generating device data
            var options = { compact: true, ignoreAttributes: false, ignoreComment: true, spaces: 4 };
            var jsonObject = convert.json2xml(parsedJson, options);
            if (parsedJson !== null)        //to avoid to download the empty file
                fileDownloader(jsonObject, mainstore.popUpInputs.userTextBoxInput)
        }

        showDialogForVifGenerationDialog() {
            basemodal.showPopUp('FileName', null, 'Save File', "DeviceData.Xml", true, null, null, this.generateVIFFile.bind(this))
        }


        //TODO rename numberofPorts to isMultiPortDut
        render() {
            var isCompModeSelected = (mainstore.productCapabilityProps.executionMode === Constants.COMPLIANCE_MODE)
            if (isCompModeSelected)
                compilanceModeSelected = " copy-device-btn-compilance-mode"
            else
                compilanceModeSelected = " "
            // ProductCapabilityProps.udpateProductCapsPros();//TODO Check with kishore if this is ok
            return (
                <>
                    <FlexView column className="right-border align-on-zoom panel-padding scroll mobile-product-capability-left-side-container" style={{ width: Constants.LEFT_PANEL_WIDTH, overflowY: 'auto', display: "block" }} onWheel={(e) => utils.listenScrollEvent(e)}>
                        <NewProjectButton />
                        <FlexView>
                            <Form className="form-padding">
                                <span>Select Test Mode </span>
                                <label className="test-mode-label"><input type='radio' id="pcComplianceTestRadioBtn" className="test-mode-radio-btn" value={Constants.COMPLIANCE_MODE} checked={mainstore.productCapabilityProps.executionMode === Constants.COMPLIANCE_MODE} onChange={this.appModeSelectionRadBtnClick} />Compliance </label>
                                <label className="test-mode-label"><input type='radio' id="pcInformationalTestRadioBtn" className="test-mode-radio-btn" value={Constants.INFORMATIONAL_MODE} checked={mainstore.productCapabilityProps.executionMode === Constants.INFORMATIONAL_MODE} onChange={this.appModeSelectionRadBtnClick} />Informational (No VIF)</label>
                            </Form>
                        </FlexView>

                        <VIFLoadComponent isInCompMode={isCompModeSelected} />

                        <PortConfigComponent portnumber={Constants.PORTA} isInCompMode={isCompModeSelected} />

                        {(isCompModeSelected === true && mainstore.numberofPorts === true) ?
                            null : <PortConfigComponent portnumber={Constants.PORTB} isInCompMode={isCompModeSelected} />}

                        {isCompModeSelected ? null :
                            <>
                                <p className="panelHeading">Device Data Operation</p>
                                <FlexView>
                                    <OverlayTrigger placement="auto" trigger="hover" overlay={<Tooltip>{this.state.generateVIFFileDeviceData} </Tooltip>}>
                                        <Button className="grl-button generate-vif-device-btn generate-vif-button-height-min-screen" id="pcGenerateVifDeviceDataBtn" onClick={this.showDialogForVifGenerationDialog.bind(this)}>{this.state.generateVIFFileDeviceData} </Button>
                                    </OverlayTrigger>
                            
                            {mainstore.productCapabilityProps.executionMode !== Constants.COMPLIANCE_MODE ?
                                <>
                                    <OverlayTrigger placement="top" overlay={<Tooltip>Copy Device data to VIF data</Tooltip>}>
                                        <Button className="grl-button-blue copyGetCapsbtn" id="pcCopyDeviceDataToVifDataBtn" disabled={!mainstore.isGetCapsEnabled} onClick={this.copyDeviceData.bind(this)}>Copy Device Data to VIF Data</Button>
                                    </OverlayTrigger>
                                </>
                                : null}
                        </FlexView>
                            </>}

                    
                          <OverlayTrigger placement="top" overlay={<Tooltip> {PC_FILE_CONVERTER_BTN} </Tooltip>}>
                                <a href="javascript:void(0);" onClick={() => window.open("https://www.usb.org/document-library/usb-vendor-info-file-generator")} className={"xml-tool " + compilanceModeSelected } id="pcVifGeneratorLinkLabel">USB-IF VIF Generator Download Link</a>
                            </OverlayTrigger>
                    </FlexView>

                    <FlexView className="right-border panel-padding vif-editor-custom-width vif-editor-mobiledisplay" column >
                        {mainstore.fivePortTestingFlag ? null :
                            <VIFEditor vifFileData={this.state.vifFileData} vifDeviceData={this.state.vifDeviceData} />
                        }
                    </FlexView>
                </>
            );
        }
    })

export default ProductCapabilityComponent;

