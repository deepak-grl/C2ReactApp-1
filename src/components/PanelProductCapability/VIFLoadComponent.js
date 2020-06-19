import React from "react"
import { Button, OverlayTrigger, Tooltip, Modal, Dropdown } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import * as Constants from '../../Constants';
import { mouseBusy, xmlToJson } from '../../utils';
import { basemodal, mainstore } from '../../modals/BaseModal';
import { observer } from 'mobx-react';
import { PC_CLEAR_BTN } from '../../Constants/tooltip';
import fileDownloader from 'js-file-download';
import Switch from "react-switch";
import { EDIT_TEXTBOX } from '../../Constants/tooltip';
import ajax from '../../modals/AjaxUtils';
import providerSampleVif from '../../vif_files/Sample_Provider_Vif';
import consumerSampleVif from '../../vif_files/Sample_Consumer_Vif';
import drpSampleVif from '../../vif_files/Sample_Drp_Vif';
import cableSampleVif from '../../vif_files/Sample_Cable_Vif';

var convert = require('xml-js');
var vifFileToSetDefaultValues = providerSampleVif;

const VIFLoadComponent = observer(
    class VIFLoadComponent extends React.Component {
        state = {
            generateVIFFile: "Generate VIF(VIF Data)",
            showModal: false,
            editVifValues: false,
            generateVifFileName: "",
            isDefaultValuesSet: true,
            showVifConfigModal: false,
            dutType: 'Provider Only',
            isDefaultValueChecked: true,
        };

        readXMLFile = (file) => {
            var me = this;
            xmlToJson(file, function (parsedJson) {
                mainstore.productCapabilityProps.vifFileName = file.name.length > 45 ? file.name.substring(0, 45) + '...' : file.name
                // me.setState({ vifFileName: mainstore.productCapabilityProps.vifFileName })
                me.loadFileData(parsedJson);
                mouseBusy(false);
            });
        }

        onFileSeletionInDialog = event => {
            mainstore.fivePortTestingFlag = false;
            mainstore.isVifLoadedFromProductCaps = true;
            mouseBusy(true);
            var file = event.target.files[0];
            var me = this;
            var path = Constants.FILE_UPLOAD_PATH_VIF + file.name;// +"/";           
            ajax.fileUpload(path, file, "VifFile", function (response) {
                mouseBusy(false);
            });

            if (file.type === "text/xml") {
                me.readXMLFile(file)
            }
            else {
                alert("Please upload VIF file in XML format")
            }
        }

        onGenerateViFNameSet() {
            this.setState({ showModal: false });
        }
        // showDialogForVifGenerationDialog() {
        //     this.setState({ showModal: true });
        // }

        vifEditToggleButtonClicked() {
            this.setState({ editVifValues: !this.state.editVifValues });
            mainstore.vifEditorEditable = !mainstore.vifEditorEditable;
            mainstore.vifEditableOnlyInInformationalMode = !mainstore.vifEditableOnlyInInformationalMode;
        }

        displayFileDialog = event => {
            if (event)
                event.preventDefault();
            this.refUploadInput.click();
        }

        clearVifData() {
            mainstore.productCapabilityProps.vifFileName = "Load XML VIF File"
            // this.setState({ vifFileName: 'Load XML VIF File' })
            basemodal.vifDataModal.clearAll();
            basemodal.putVIFData(Constants.PORTA, {})
            mainstore.selectedMoiTestCase = [];
            mainstore.testConfiguration.selectedTestList = [];
            mainstore.numberofPorts = true
        }

        onGenerateVifFileNameChange(event) {
            this.setState({ generateVifFileName: event.target.value })
        }

        generateVIFFile = () => {
            var parsedJson = basemodal.vifDataModal.getportA().getCleanedFileJson();
            var options = { compact: true, ignoreAttributes: false, ignoreComment: true, spaces: 4 };
            var jsonObject = convert.json2xml(parsedJson, options);
            if (mainstore.popUpInputs.responseButton === "Ok")
                fileDownloader(jsonObject, mainstore.popUpInputs.userTextBoxInput)
        }

        loadFileData(data) {
            if (data) {
                mainstore.cableSelectionFromDropDownInInformational = false;
                mainstore.loadSelectedCableFromBackend = false;
                basemodal.vifDataModal.loadJson(data, Constants.TYPE_FILE, 1);
            }
        }

        showDialogForVifGenerationDialog() {
            basemodal.showPopUp('FileName', null, 'Save File', "DeviceData.xml", true, "OKCancel", null, this.generateVIFFile.bind(this))
        }


        setDefaultValues() {
            var parsedJsonObj = JSON.parse((JSON.stringify(vifFileToSetDefaultValues)));
            if (this.state.isDefaultValuesSet) {
                basemodal.vifDataModal.loadJson(parsedJsonObj, Constants.TYPE_FILE, 1);
            }
            else {
                basemodal.vifDataModal.loadJson(parsedJsonObj, Constants.TYPE_FILE, 1);
                basemodal.vifDataModal.clearVifFileValues();
                basemodal.vifDataModal.vifDataModified();
            }
        }

        showVifModal = () => {
            mainstore.isCreateNewVifInProgress = true;
            this.setState({ showVifConfigModal: !this.state.showVifConfigModal })
        }
        handleCloseVifModal = () => {
            this.setState({ showVifConfigModal: false })
        }

        dutTypeDropDownChange = (eventKey) => {
            this.setState({ dutType: eventKey })
            if (eventKey === Constants.DUT_TYPE[0]) {
                vifFileToSetDefaultValues = consumerSampleVif;
            }
            else if (eventKey === Constants.DUT_TYPE[1]) {
                vifFileToSetDefaultValues = providerSampleVif;
            }
            else if (eventKey === Constants.DUT_TYPE[2]) {
                vifFileToSetDefaultValues = cableSampleVif;
            }
            else if (eventKey === Constants.DUT_TYPE[3]) {
                vifFileToSetDefaultValues = drpSampleVif;
            }

        }

        isDefaultValueChecked = () => {
            this.setState({
                isDefaultValueChecked: !this.state.isDefaultValueChecked,
            });
            if (!this.state.isDefaultValueChecked === true) {
                this.setState({ isDefaultValuesSet: true });
            }
            else if (!this.state.isDefaultValueChecked === false) {
                this.setState({ isDefaultValuesSet: false });
            }
        }

        handleVifConfigOkButton = () => {
            this.setDefaultValues();
            this.setState({ showVifConfigModal: false });
            mainstore.isCreateNewVifInProgress = true;
        }
        render() {
            return (
                <FlexView column>
                    <input ref={(ref) => { this.refUploadInput = ref; }} type="file" accept=".xml" style={{ display: 'none' }}
                        onChange={this.onFileSeletionInDialog}
                        onClick={(event) => { event.target.value = null; }}
                    />
                    <FlexView>
                        <label className="load-vif-label">Load VIF</label>
                        <OverlayTrigger placement="auto" trigger="hover" overlay={<Tooltip>{"Load DUT's XML VIF File"} </Tooltip>}>
                            <Button className="grl-button load-vif-button" id="load_xml_vif_button" onClick={(e) => { this.displayFileDialog(e) }}>{mainstore.productCapabilityProps.vifFileName}</Button>
                        </OverlayTrigger>
                    </FlexView>

                    {this.props.isInCompMode === false ?
                        <div>
                            <FlexView>
                                <OverlayTrigger placement="top" trigger="hover" overlay={<Tooltip >Create a new VIF File in Xml Format</Tooltip>}>
                                    <Button className="grl-button createNewFilebtn" onClick={(e) => { this.showVifModal(e) }} >Create New VIF </Button>
                                </OverlayTrigger>
                                {/* <OverlayTrigger placement="auto" overlay={<Tooltip>Set Default Values</Tooltip>}>
                                    <Button className="grl-button createNewFilebtn"  onClick={(e) => { this.setDefaultValues(e) }} >Default Values</Button>
                                </OverlayTrigger> */}
                                <div className="clear-vif-link-label-div">
                                    <OverlayTrigger placement="auto" overlay={<Tooltip>{PC_CLEAR_BTN}</Tooltip>}>
                                        <a href="javascript:void(0);" className="clear-btn" onClick={this.clearVifData.bind(this)} >Clear VIF Data</a>
                                    </OverlayTrigger>
                                </div>
                            </FlexView>

                            <FlexView className="generate-vif-container" >
                                <OverlayTrigger placement="bottom" trigger="hover" overlay={<Tooltip>{this.state.generateVIFFile} </Tooltip>}>
                                    <Button className="grl-button generate-vif-btn generate-vif-button-height-min-screen" onClick={this.showDialogForVifGenerationDialog.bind(this)}>{this.state.generateVIFFile} </Button>
                                </OverlayTrigger>

                                <FlexView className="edit-vif-toggle-btn">
                                    <span className="toggle-padding" >Edit VIF</span >
                                    <OverlayTrigger placement="top" overlay={<Tooltip> {EDIT_TEXTBOX} </Tooltip>}>
                                        <div className="toggle-switch">
                                            <Switch
                                                checked={this.state.editVifValues}
                                                onChange={this.vifEditToggleButtonClicked.bind(this)}
                                                onColor="#0000ff"
                                                offColor="#c1c1c1"
                                                offHandleColor="#06789a"
                                                onHandleColor="#06789a"
                                                handleDiameter={20}
                                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                                height={20}
                                                width={50}
                                                uncheckedIcon={<div style={{ color: "black", paddingLeft: 3, fontWeight: 600 }}> Off </div>}
                                                checkedIcon={<div style={{ color: "White", paddingLeft: 3, fontWeight: 600 }}> On </div>}
                                            // disabled={mainstore.productCapabilityProps.vifFileName === Constants.VIF_LOAD_BTN_DEFAULT}
                                            />
                                        </div>
                                    </OverlayTrigger>
                                </FlexView>
                            </FlexView>
                        </div> : null}

                    <Modal show={this.state.showVifConfigModal} onHide={this.handleCloseVifModal} size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                        <Modal.Header closeButton>
                            <Modal.Title>VIF Config</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FlexView column >
                                <Dropdown className="irDrop-port-align" >
                                    <span className="label-text-padding">DUT Type</span>
                                    <Dropdown.Toggle className="dropdowncustom vif-config-dropdown" variant="success">{this.state.dutType}</Dropdown.Toggle>
                                    <Dropdown.Menu className="vif-config-dropdown-menu">
                                        {
                                            Constants.DUT_TYPE.map((dutType, index) => {
                                                return <Dropdown.Item className="uutTypeSelection" key={index} eventKey={dutType} onSelect={(e) => this.dutTypeDropDownChange(e, index)}>{dutType}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                                <FlexView>
                                    <span className="port-label-padding">Set Default Value</span>
                                    <label className="label-checkbox-align">
                                        <input type="radio" className="checkbox-text-align" checked={this.state.isDefaultValueChecked} onChange={this.isDefaultValueChecked} />
                                        Yes
                                     </label>

                                    <label className="label-checkbox-align getcaps-checkbox">
                                        <input type="radio" className="checkbox-text-align" checked={!this.state.isDefaultValueChecked} onChange={this.isDefaultValueChecked} />
                                        No
                                    </label>
                                </FlexView>
                                <FlexView className="vif-config-ok-button">
                                    <Button className="grl-button vif-config-button" onClick={() => this.handleVifConfigOkButton()}>Ok</Button>
                                </FlexView>
                            </FlexView>
                        </Modal.Body>
                    </Modal>
                </FlexView>
            );
        }

    }
)
export default VIFLoadComponent;
