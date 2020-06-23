import React, { Component } from "react"
import { Button, Modal, Tab, Tabs, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { mainstore, basemodal } from '../../modals/BaseModal';
import { observer } from "mobx-react";
import { ClipLoader } from 'react-spinners';
import FivePortInfo from "./FivePortInfo";
import { AUTO_CONNECT } from '../../Constants/tooltip';
import * as Constants from '../../Constants/index';
import { getCurrentDateAndTime } from '../../utils/index';
import { chartstore } from '../../modals/ChartStoreModal';
import ajax from '../../modals/AjaxUtils';
import { mouseBusy, xmlToJson } from '../../utils';
import toastNotification from '../../utils/toastNotification';
import NumericInput from 'react-numeric-input';
import fileDownloader from 'js-file-download';
var convert = require('xml-js');

let checkPortStatusDescription = ''
const PortTesting = observer(
    class PortTesting extends Component {
        constructor(props) {
            super(props);
            this.state = {
                index: 1,
                loading: false,
                currentPage: 4,
                activeTab: 1,
                previousActiveTab: 1,
                comPort: 'COM4',
                loading: false,
                statusIcon: "",
                showCheckStatus: false,
                fileName: 'Load Five Port Data',
                currentSelectedPort: 1,
            }
        }

        handleClose = (eventKey) => {
            mainstore.show5PortTestingPopUp = false;
        }

        isAutoConnected = () => {
            this.setState({ loading: true })
        }

        handleSelectedTab = (selectedTab) => {
            this.setState({
                activeTab: selectedTab,
            });
            this.setState(prevState => ({
                previousActiveTab: prevState.activeTab,
            }));
            basemodal.getSelectedTabMoiConfiguration(selectedTab, this.state.previousActiveTab)
        }


        getCapabilitiesForFivePort = () => {
            for (let i = 0; i < 5; i++) {
                var portNum = Constants.EX_PORT_TYPES[i];
                if (mainstore.fivePortConfiguration[i].isVifLoaded === false)
                    basemodal.getCapabilities(portNum, null);
            }
        }

        validateFivePortToStartEexcution = () => {
            if (this.state.comPort === "") {
                var toast = new toastNotification("Please Fill the COM Port Field", Constants.TOAST_ERROR, 5000)
                toast.show()
            }
            else {
                mainstore.enableGlassPaneIfOptionsPanelSelected = true;
                this.run5PortTesting();
            }
        }

        run5PortTesting = () => {
            // call all ajax calls for 5 ports
            mainstore.isFivePortStartedExecution = true;
            this.getCapabilitiesForFivePort();
            basemodal.putFivePortTestingConfig();

            (async function loop() {
                for (let i = 0; i < 5; i++) {
                    if (mainstore.fivePortConfiguration[i].isEnabled) {
                        var cloneMoiConfiguration = {}
                        cloneMoiConfiguration.pd2Configuration = mainstore.testConfiguration.pd2Configuration
                        cloneMoiConfiguration.tbtConfiguration = mainstore.testConfiguration.tbtConfiguration
                        cloneMoiConfiguration.qc3Configuration = mainstore.testConfiguration.qc3Configuration
                        cloneMoiConfiguration.sptConfiguration = mainstore.testConfiguration.sptConfiguration
                        cloneMoiConfiguration.qc4Configuration = mainstore.testConfiguration.qc4Configuration
                        cloneMoiConfiguration.functionalConfiguration = mainstore.testConfiguration.functionalConfiguration
                        cloneMoiConfiguration.dpAltModeConfiguration = mainstore.testConfiguration.dpAltModeConfiguration
                        cloneMoiConfiguration.deterministicConfig = mainstore.testConfiguration.deterministicConfig
                        cloneMoiConfiguration.cbChargerConfiguration = mainstore.testConfiguration.cbChargerConfiguration
                        cloneMoiConfiguration.mfiChargerConfiguration = mainstore.testConfiguration.mfiChargerConfiguration
                        cloneMoiConfiguration.bc_1_2TestConfiguration = mainstore.testConfiguration.bc_1_2TestConfiguration
                        cloneMoiConfiguration.pd3Configuration = mainstore.testConfiguration.pd3Configuration

                        mainstore.fivePortConfiguration[i].moiConf = cloneMoiConfiguration

                        if (mainstore.fivePortConfiguration[i].newProjectName) {
                            await new Promise(resolve => basemodal.putProjectFolderName(mainstore.fivePortConfiguration[i].newProjectName));
                        }
                        // await mainstore.productCapabilityProps.ports[portNum].setCableType(mainstore.fivePortConfiguration[i].cableType);
                        basemodal.syncMoiConfigurations();
                    }
                }
            })();

            mouseBusy(true);
            var runTest = !(mainstore.status.appState === Constants.BUSY ? true : false)
            if (runTest) {
                setTimeout(() => {
                    this.setMouseReady()
                    mainstore.panelResultPolling = true;
                    mainstore.isPollingChecked = false
                }, 3000);
                mainstore.status.appState = Constants.BUSY;
                chartstore.AppState = Constants.BUSY;
                basemodal.syncMoiConfigurations();
                // basemodal.postSelectedTestList();
                mainstore.chartPollEnabled = true;
                basemodal.chartModal.resetPlot();
                mainstore.currentPanelIndex = 3;
                mainstore.results.testResultsList = [];
                chartstore.showVerticalBar = false;

            }
            else
                basemodal.getStopTestExecution(this.setMouseReady.bind(this));
        }

        setMouseReady = () => {
            mouseBusy(false)
        }

        handleComPortOnChange = (event) => {
            for (var i = 0; i < 5; i++) {
                mainstore.fivePortConfiguration[i].comPort = event.target.value;
                this.setState({ comPort: mainstore.fivePortConfiguration[i].comPort })
            }
        }

        showComPortInfoImage = () => {
            basemodal.showPopUp(null, null, 'COM Port', null, false, null, "comPort.png", null)
        }

        checkCurrentSelectedPort = () => {
            this.setState({ loading: true })
            mainstore.currentPortStatus.currentSelectedPortNumber = Constants.EX_PORT_TYPES[this.state.currentSelectedPort - 1]
            mainstore.currentPortStatus.comPortValue = this.state.comPort;
            basemodal.putCurrentSelectedPort(this.getCurrentSelectedPortStatus.bind(this));
            // this.getCurrentSelectedPortStatus()
        }

        getCurrentSelectedPortStatus = () => {
            basemodal.getCurrentSelectedPortStatus(this.currentSelectedPortStatus.bind(this))
        }

        currentSelectedPortStatus = () => {
            this.setState({ loading: false, statusIcon: mainstore.fivePortSelectedPortStatus, showCheckStatus: true })
            checkPortStatusDescription = ""
        }

        saveFivePortInfo = () => {
            var jsonData = []
            if (mainstore.popUpInputs.responseButton === "Ok") {
                for (var i = 0; i < 5; i++) {
                    var parsedJson = JSON.parse(JSON.stringify(mainstore.fivePortConfiguration[i]));
                    parsedJson.repeatCondition = { "selectedFailureConditionArray": parsedJson.repeatCondition }
                    parsedJson.moiSelected = { "MOIArray": parsedJson.moiSelected }
                    var options = { compact: true, ignoreAttributes: false, ignoreComment: true, spaces: 4, indentAttributes: true, indentCdata: true };
                    var jsonObject = convert.json2xml(parsedJson, options);
                    if (i == 0) {
                        jsonObject = '<fivePort>' + jsonObject;
                    } else if (i == 4) {
                        jsonObject = jsonObject + '</fivePort>';
                    }
                    jsonData.push(jsonObject)
                }
                fileDownloader(jsonData, mainstore.popUpInputs.userTextBoxInput)
            }
        }

        saveFivePortInfoGenerationDialog() {
            basemodal.showPopUp('FileName', null, 'Save Five Port Configurations', "fiveportdata.xml", true, "OKCancel", null, this.saveFivePortInfo.bind(this))
        }

        displayFileDialog = event => {
            if (event)
                event.preventDefault();
            this.refUploadInput.click();
        }

        onFileSeletionInDialog = event => {
            mouseBusy(true);
            var file = event.target.files[0];
            var me = this;
            var path = Constants.FILE_UPLOAD_PATH_VIF + file.name;// +"/";    
            this.setState({ fileName: file.name })
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

        readXMLFile = (file) => {
            var me = this;
            xmlToJson(file, function (parsedJson) {
                me.loadFileData(parsedJson);
                mouseBusy(false);
            });
        }

        loadFileData(data) {
            if (data) {
                for (var i = 0; i < 5; i++) {
                    mainstore.fivePortConfiguration[i].newProjectName = data.fivePort.newProjectName[i]._text;
                    mainstore.fivePortConfiguration[i].portNumber = data.fivePort.portNumber[i]._text;
                    mainstore.fivePortConfiguration[i].isEnabled = JSON.parse(data.fivePort.isEnabled[i]._text);
                    mainstore.fivePortConfiguration[i].isVifLoaded = JSON.parse(data.fivePort.isVifLoaded[i]._text);
                    mainstore.fivePortConfiguration[i].vifFilePath = " ";
                    mainstore.fivePortConfiguration[i].cableType = data.fivePort.cableType[i]._text;
                    mainstore.fivePortConfiguration[i].dutType = data.fivePort.dutType[i]._text;
                    mainstore.fivePortConfiguration[i].generalRepeatCount = data.fivePort.generalRepeatCount[i]._text;
                    mainstore.fivePortConfiguration[i].failureRepeatCount = data.fivePort.failureRepeatCount[i]._text;
                    mainstore.fivePortConfiguration[i].comPort = data.fivePort.comPort[i]._text;
                    if (data.fivePort.vifFileName[i]._text)
                        mainstore.fivePortConfiguration[i].vifFileName = data.fivePort.vifFileName[i]._text
                    this.handleSelectedFailureRepeatCondition(data);
                    this.handleSelectedMoiListForEachPort(data);
                }
            }
            mainstore.renderFivePort = mainstore.renderFivePort + 1
        }

        handleSelectedFailureRepeatCondition = (data) => {
            for (let n in data.fivePort.repeatCondition) {
                let selectedFailureValues = []
                if (data.fivePort.repeatCondition[n].selectedFailureConditionArray && data.fivePort.repeatCondition[n].selectedFailureConditionArray.length) {
                    for (let child of data.fivePort.repeatCondition[n].selectedFailureConditionArray) {
                        if (!(Object.values(mainstore.fivePortConfiguration[n].repeatCondition).indexOf(child._text) > - 1)) {
                            selectedFailureValues.push(child._text)
                            mainstore.fivePortConfiguration[n].repeatCondition = selectedFailureValues
                        }
                    }
                }
                else {
                    if (data.fivePort.repeatCondition[n].selectedFailureConditionArray)
                        mainstore.fivePortConfiguration[n].repeatCondition = data.fivePort.repeatCondition[n].selectedFailureConditionArray._text
                    else
                        mainstore.fivePortConfiguration[n].repeatCondition = {}
                }
            }
        }

        handleSelectedMoiListForEachPort = (data) => {
            for (let n in data.fivePort.moiSelected) {
                let selectedMoiList = []
                if (data.fivePort.moiSelected[n].MOIArray && data.fivePort.moiSelected[n].MOIArray.length) {
                    for (let child of data.fivePort.moiSelected[n].MOIArray) {
                        if (!(Object.values(mainstore.fivePortConfiguration[n].moiSelected).indexOf(child._text) > - 1)) {
                            selectedMoiList.push(child._text)
                            mainstore.fivePortConfiguration[n].moiSelected = selectedMoiList
                        }
                    }
                }
                else {
                    if (data.fivePort.moiSelected[n].MOIArray)
                        mainstore.fivePortConfiguration[n].moiSelected = data.fivePort.moiSelected[n].MOIArray._text
                    else
                        mainstore.fivePortConfiguration[n].moiSelected = {}
                }
            }
        }

        checkPortStatusDescription = () => {
            if (mainstore.popUpInputs.spinnerID === 4)
                checkPortStatusDescription = mainstore.popUpInputs.spinnerDesc;
        }

        onCurrentSelectedPortInputChange = (valueAsNumber) => {
            this.setState({ currentSelectedPort: valueAsNumber })
        }

        render() {
            var ifProjectInputFieldEnabled = "";
            if (this.state.isNewProjectChecked) {
                ifProjectInputFieldEnabled = "project-input-field-enabled"
            }
            else {
                ifProjectInputFieldEnabled = "five-port-panel-width"
            }
            var appState = mainstore.status.appState === Constants.BUSY
            var buttonText = appState ? "Stop Execution" : "Start Execution";
            var buttonClass = appState ? "stopbtn" : "runbtn";
            var fivePortStartButtonTooltip = appState ? "Stop Five Port Test Execution" : "Start Five Port Test Execution";

            return (
                <>
                    <FlexView column className={ifProjectInputFieldEnabled}>
                        <input ref={(ref) => { this.refUploadInput = ref; }} type="file" accept=".xml" style={{ display: 'none' }}
                            onChange={this.onFileSeletionInDialog}
                            onClick={(event) => { event.target.value = null; }}
                        />
                        <FlexView className="auto-run-btn-div-five-port">
                            <Button className={"grl-button port-run-button "} onClick={(e) => { this.saveFivePortInfoGenerationDialog() }}>Save Five Port Data</Button>
                            <Button className={"grl-button port-run-button "} onClick={(e) => { this.displayFileDialog(e) }}>{this.state.fileName}</Button>
                        </FlexView>
                        <FlexView className="auto-run-btn-div-five-port">
                            <OverlayTrigger placement="top" overlay={<Tooltip>{fivePortStartButtonTooltip}</Tooltip>}>
                                <Button disabled={!mainstore.disableFivePortExecutionBtn} className={"grl-button port-run-button " + buttonClass} onClick={(e) => { this.validateFivePortToStartEexcution() }}>{buttonText}</Button>
                            </OverlayTrigger>
                        </FlexView>

                        <FlexView className="com-port-width">
                            <label className="com-port-label">
                                <span className="com-port-text">COM Port
                                <OverlayTrigger placement="top" overlay={<Tooltip>COM Port Info Image</Tooltip>}>
                                        <img src="../../images/icons8-five-port-help-48.png" alt="help-five-port" className="plot-toolbar-img help-img-com-port" onClick={() => this.showComPortInfoImage()} />
                                    </OverlayTrigger>
                                </span>
                                <input type="text" className="com-port-input-field" value={this.state.comPort} onChange={(e) => this.handleComPortOnChange(e)} />
                            </label>

                            <p className="select-port-label">Select Port </p>
                            <div className="select-port-input">
                                <NumericInput min={1} max={5} value={this.state.currentSelectedPort} onChange={this.onCurrentSelectedPortInputChange} />
                            </div>

                            <OverlayTrigger placement="auto" overlay={<Tooltip>Current Selected Port</Tooltip>}>
                                <Button className="grl-button current-port-check-button" onClick={(e) => { this.checkCurrentSelectedPort() }}>Check</Button>
                            </OverlayTrigger>
                            <div className="cliploader-check-selected-port-status">
                                <ClipLoader sizeUnit={"px"} size={25} color={'#123abc'} loading={this.state.loading} />
                            </div>
                            {this.state.showCheckStatus === true && this.state.loading === false ?
                                this.state.statusIcon === "PASS" ?
                                    <OverlayTrigger placement="top" overlay={<Tooltip>Enabled Port - {mainstore.currentPortStatus.currentSelectedPortNumber}</Tooltip>}>
                                        <img src="images/pass.png" className="check-status-icon" alt='PASS' ></img>
                                    </OverlayTrigger> :
                                    <OverlayTrigger placement="top" overlay={<Tooltip>Could not communicate with PORT - {mainstore.currentPortStatus.currentSelectedPortNumber}</Tooltip>}>
                                        <img src="images/fail.png" className="check-status-icon" alt='FAIL' ></img>
                                    </OverlayTrigger> : null}
                        </FlexView>
                        <FlexView className="check-port-status-desc">
                            <p className="firmware-spinner-status">{checkPortStatusDescription}</p>
                        </FlexView>

                        <FlexView column className="five-port-height">
                            <Tabs activeKey={this.state.activeTab} className="tab-pane-control" onSelect={this.handleSelectedTab} >
                                <Tab eventKey="1" title="1" id="tab-btn-align">
                                    <FivePortInfo portNumber={0} />
                                </Tab>
                                <Tab eventKey="2" title="2">
                                    <FivePortInfo portNumber={1} />
                                </Tab>
                                <Tab eventKey="3" title="3" >
                                    <FivePortInfo portNumber={2} />
                                </Tab>
                                <Tab eventKey="4" title="4" >
                                    <FivePortInfo portNumber={3} />
                                </Tab>
                                <Tab eventKey="5" title="5" >
                                    <FivePortInfo portNumber={4} />
                                </Tab>
                            </Tabs>
                        </FlexView>
                        {/* <Button className={"grl-button port-run-button"} onClick={(e) => { this.run5PortTesting() }}>Run</Button> */}
                    </FlexView>
                </>
            );
        }
    })

export default PortTesting;