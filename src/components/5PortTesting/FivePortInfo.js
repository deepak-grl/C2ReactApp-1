import React, { Component } from "react"
import { Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { mainstore, basemodal } from '../../modals/BaseModal';
import Switch from "react-switch";
import { ENABLE_PORT, BROWSE_VIF, TC_REPEAT, FP_CABLE_SELECTION, FIVEPORTREPEATCOUNT } from '../../Constants/tooltip';
import * as Constants from '../../Constants';
import Select from 'react-select';
import { observer } from "mobx-react";
import { observe } from "mobx";
import MoiComponents from "../MoiConfiguration";
import { mouseBusy, xmlToJson, scrollToTopOnMoiDropDownChange } from '../../utils';
import ajax from '../../modals/AjaxUtils';
import NumericInput from 'react-numeric-input';
import utils from '../../utils';

var disable5Port = " ";
const FivePortInfo = observer(
    class FivePortInfo extends Component {
        constructor(props) {
            super(props);
            this.state = {
                portNumber: this.props.portNumber,
                isVifChecked: false,
                enable5Port: false,
                selectedOption: [],
                reRender: 0,
                selectedFailureCondition: [],
                fivePortMoiList: [],
            }

            const disposer = observe(mainstore, "portTestingReRender", (change) => {
                this.setState({ reRender: this.state.reRender + 1 })
            });

            const disposer1 = observe(mainstore, "renderFivePort", (change) => {
                this.setState({ reRender: this.state.reRender + 1 })
                this.loadSelectedFailureConditionsFromFile();
                this.loadSelectedMoiFromFile();
                this.enableStartExecutionifMoiSelected(mainstore.fivePortConfiguration[this.props.portNumber].moiSelected);
            });
        }
        componentDidMount() {
            mainstore.fivePortConfiguration[this.props.portNumber].newProjectName = "Project_Name";
            mainstore.fivePortConfiguration[this.props.portNumber].portNumber = Constants.EX_PORT_TYPES[this.props.portNumber];
            mainstore.fivePortConfiguration[this.props.portNumber].isEnabled = false;
            mainstore.fivePortConfiguration[this.props.portNumber].isVifLoaded = true;
            mainstore.fivePortConfiguration[this.props.portNumber].vifFilePath = " ";
            mainstore.fivePortConfiguration[this.props.portNumber].vifFileName = "Load XML VIF File";
            mainstore.fivePortConfiguration[this.props.portNumber].moiSelected = [];
            mainstore.fivePortConfiguration[this.props.portNumber].cableType = Constants.CABLE_DATA_TYPES[0];
            mainstore.fivePortConfiguration[this.props.portNumber].dutType = "Provider Only";
            // mainstore.fivePortConfiguration[this.props.portNumber].generalRepeatCount = 0;
            mainstore.fivePortConfiguration[this.props.portNumber].failureRepeatCount = 0;
            mainstore.fivePortConfiguration[this.props.portNumber].comPort = "COM4";
            mainstore.fivePortConfiguration[this.props.portNumber].repeatCondition = [];
            basemodal.syncAjaxCalls();
        }

        loadSelectedFailureConditionsFromFile = () => {
            var selectedRepeatConditions = []
            var eachPortSelectedFailureConditon = [];
            if (mainstore.fivePortConfiguration[this.props.portNumber].repeatCondition !== undefined)
                eachPortSelectedFailureConditon = JSON.parse(JSON.stringify(mainstore.fivePortConfiguration[this.props.portNumber].repeatCondition))
            if (typeof eachPortSelectedFailureConditon === "object") {
                for (var i = 0; i < eachPortSelectedFailureConditon.length; i++) {
                    selectedRepeatConditions.push({ "value": eachPortSelectedFailureConditon[i], "label": eachPortSelectedFailureConditon[i] })
                }
            }
            else
                selectedRepeatConditions.push({ "value": eachPortSelectedFailureConditon, "label": eachPortSelectedFailureConditon })
            this.setState({ selectedFailureCondition: selectedRepeatConditions, reRender: this.state.reRender + 1 })
        }

        loadSelectedMoiFromFile = () => {
            var selectedMois = []
            var eachPortmoiSelected = []
            if (mainstore.fivePortConfiguration[this.props.portNumber].moiSelected !== undefined)
                eachPortmoiSelected = JSON.parse(JSON.stringify(mainstore.fivePortConfiguration[this.props.portNumber].moiSelected))
            if (typeof eachPortmoiSelected === "object") {
                for (var i = 0; i < eachPortmoiSelected.length; i++) {
                    selectedMois.push({ "value": eachPortmoiSelected[i], "label": eachPortmoiSelected[i] })
                }
            }
            else
                selectedMois.push({ "value": eachPortmoiSelected, "label": eachPortmoiSelected })
            this.setState({ selectedOption: selectedMois, reRender: this.state.reRender + 1 })
        }

        enableStartExecutionifMoiSelected = (MOIArray) => {
            mainstore.fivePortConfiguration[this.props.portNumber].moiSelected = MOIArray;
            var fiveportMoiLength = mainstore.fivePortConfiguration.filter((ele, index) => {
                if (ele.moiSelected && ele.moiSelected.length)
                    return ele.moiSelected.length
            });
            if (fiveportMoiLength.length)
                mainstore.disableFivePortExecutionBtn = true

            else
                mainstore.disableFivePortExecutionBtn = false
        }

        handlePojectNameOnChange = (event) => {
            mainstore.fivePortConfiguration[this.props.portNumber].newProjectName = event.target.value;                   // if checked give New project name for each file Else make it null.
        }

        handleClose = (eventKey) => {
            mainstore.show5PortTestingPopUp = false;
        }

        isVifChecked = (isVifChecked) => {
            this.setState({ isVifChecked: isVifChecked });
            mainstore.fivePortConfiguration[this.props.portNumber].isVifLoaded = isVifChecked;
        }

        enablePortToggleButtonClicked = () => {
            this.setState({ enable5Port: !this.state.enable5Port });
            mainstore.fivePortConfiguration[this.props.portNumber].isEnabled = !mainstore.fivePortConfiguration[this.props.portNumber].isEnabled;
            basemodal.syncAjaxCalls();
        }

        displayFileDialog = event => {
            if (event)
                event.preventDefault();
            this.refUploadInput.click();
        }

        onFileSeletionInDialog = event => {
            mainstore.fivePortTestingFlag = true
            mainstore.isVifLoadedFromProductCaps = false;
            mouseBusy(true);
            var file = event.target.files[0];
            mainstore.fivePortConfiguration[this.props.portNumber].vifFileName = file.name;
            var portDesc = Constants.EX_PORT_TYPES[this.props.portNumber]
            var me = this;
            mainstore.fivePortPortName.portName = Constants.EX_PORT_TYPES[this.props.portNumber]
            var path = Constants.FILE_UPLOAD_PATH_VIF + portDesc + '_' + file.name;// +"/";           
            ajax.fileUpload(path, file, "VifFile", function (response) {
                mouseBusy(false);
                me.readXMLFile(file);
            });
            mainstore.portTestingReRender = mainstore.portTestingReRender + 1;
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
                basemodal.vifDataModal.loadJson(data, Constants.TYPE_FILE, (this.props.portNumber + 1));
                if (mainstore.captiveCableVal === 1 && mainstore.isVifLoadedFromProductCaps === false)
                    mainstore.fivePortConfiguration[this.props.portNumber].cableType = Constants.CABLE_DATA_TYPES[4]
                else
                    mainstore.fivePortConfiguration[this.props.portNumber].cableType = Constants.CABLE_DATA_TYPES[0]
            }
        }

        moiTypeDropDownChange = (event) => {
            this.setState({ selectedOption: event })
            if (!this.state.selectedOption === null)
                this.state.selectedOption = [];
            scrollToTopOnMoiDropDownChange()
            var MOIArray = [];
            if (event)
                event.map(function (obj) { MOIArray.push(obj.value); });
            this.enableStartExecutionifMoiSelected(MOIArray)
        }

        cableTypedropDownChange(eventKey) {
            mainstore.fivePortConfiguration[this.props.portNumber].cableType = eventKey;                //setCableType(cableType)
        }

        dutTypeDropDownChange = eventKey => {
            mainstore.fivePortConfiguration[this.props.portNumber].dutType = eventKey;
        }
        failureRepeatDropDownChange = event => {
            this.setState({ selectedFailureCondition: event })
            scrollToTopOnMoiDropDownChange()
            if (!this.state.selectedOption === null)
                this.state.selectedOption = [];
            var selectedFailureConditionArray = [];
            if (event)
                event.map(function (obj) { selectedFailureConditionArray.push(obj.value); });

            mainstore.fivePortConfiguration[this.props.portNumber].repeatCondition = selectedFailureConditionArray;
        }

        cancel5PortTesting = () => {
            mainstore.show5PortTestingPopUp = false;
        }

        onGeneralRepeatInputChange = (valueAsNumber) => {
            if (this.props.portNumber !== null && this.props.portNumber !== undefined)
                mainstore.fivePortConfiguration[this.props.portNumber].generalRepeatCount = valueAsNumber;
        }

        onFailureRepeatInputChange = (valueAsNumber) => {
            if (this.props.portNumber !== null && this.props.portNumber !== undefined)
                mainstore.fivePortConfiguration[this.props.portNumber].failureRepeatCount = valueAsNumber;
        }

        render() {
            if (mainstore.fivePortConfiguration[this.props.portNumber].isEnabled === false)
                disable5Port = " disable-port "
            else
                disable5Port = " ";

            var activePortColor = document.getElementsByClassName('nav-link')[this.props.portNumber + 3];               //3 indicates the  starting postion of 1st tab(port) in five port 
            if (mainstore.fivePortConfiguration[this.props.portNumber].isEnabled === true)

                activePortColor.setAttribute('style', 'background-color:#229a22 !important');
            else {
                if (activePortColor !== undefined && activePortColor !== " ")
                    activePortColor.removeAttribute('style', 'background-color:#229a22 !important');
            }

            return (
                <>
                    <FlexView column className="five-port-config-width">
                        <div className="overflow-for-five-port" onWheel={(e) => utils.listenScrollEvent(e)} >
                            <input ref={(ref) => { this.refUploadInput = ref; }} accept=".xml" type="file" style={{ display: 'none' }}
                                onChange={this.onFileSeletionInDialog}
                                onClick={(event) => { event.target.value = null; }}
                            />

                            <FlexView className="five-port-label-bottom-spacing">
                                <label className="label-project-name-align"> Project Name</label>
                                <input type="text" id={"opFivePortTestingTab" + (this.props.portNumber + 1) + "ProjectNameInputField"} className="project-name-input-field" placeholder="Name of Project" value={mainstore.fivePortConfiguration[this.props.portNumber].newProjectName ? mainstore.fivePortConfiguration[this.props.portNumber].newProjectName : ''} onChange={(e) => this.handlePojectNameOnChange(e)} />
                            </FlexView>

                            <FlexView className="five-port-label-bottom-spacing">
                                <span className="port-testing-toggle-padding" >Enable Port</span >
                                <OverlayTrigger placement="top" overlay={<Tooltip > {ENABLE_PORT} </Tooltip>}>
                                    <div className="toggle-switch">
                                        <Switch
                                            id={"opFivePortTestingTab" + (this.props.portNumber + 1) + "EnablePortToggleSwitch"}
                                            checked={mainstore.fivePortConfiguration[this.props.portNumber].isEnabled ? mainstore.fivePortConfiguration[this.props.portNumber].isEnabled : false}
                                            onChange={() => this.enablePortToggleButtonClicked()}
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
                                        />
                                    </div>
                                </OverlayTrigger>
                            </FlexView>

                            <FlexView className={disable5Port + "five-port-label-bottom-spacing"}>
                                <Dropdown className="cable-selection-dropdown-five-port">
                                    <span className="cable-selection-label-padding">Cable Selection</span>
                                    <Dropdown.Toggle className="dropdowncustom cable-options-dropdown grl-button" variant="success" id={"opFivePortTestingTab" + (this.props.portNumber + 1) + "CableSelectionComboBox"} >{mainstore.fivePortConfiguration[this.props.portNumber].cableType}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.CABLE_DATA_TYPES.map((data, index) => {
                                                return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.cableTypedropDownChange.bind(this)}>{data}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                    <div className="cable-selection-info-icon" ><OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="tooltip-inner-content-align">{FP_CABLE_SELECTION}</Tooltip>}><img src="../../images/sleep-info.png" alt="info-irdrop" className="info-img-irdrop" /></OverlayTrigger></div>
                                </Dropdown>
                            </FlexView>

                            <FlexView className={disable5Port + "five-port-label-bottom-spacing"} >
                                <span className="port-label-padding dut-info-label">DUT Info</span>
                                <label className="label-checkbox-align">
                                    <input type="radio" id={"opFivePortTestingTab" + (this.props.portNumber + 1) + "VifRadioBtn"} value="vif" className="checkbox-text-align" checked={mainstore.fivePortConfiguration[this.props.portNumber].isVifLoaded ? mainstore.fivePortConfiguration[this.props.portNumber].isVifLoaded : false} onChange={() => this.isVifChecked(true)} />
                                    VIF
                         </label>

                                <label className="label-checkbox-align getcaps-checkbox">
                                    <input type="radio" id={"opFivePortTestingTab" + (this.props.portNumber + 1) + "DutTypeRadioBtn"} value="getcaps" className="checkbox-text-align" checked={!mainstore.fivePortConfiguration[this.props.portNumber].isVifLoaded} onChange={() => this.isVifChecked(false)} />
                                    DUT Type
                         </label>
                            </FlexView>

                            {(mainstore.fivePortConfiguration[this.props.portNumber].isVifLoaded) ?
                                <FlexView className={disable5Port + "five-port-label-bottom-spacing"}>
                                    <span className="port-label-padding">VIF Source</span>
                                    <OverlayTrigger placement="top" overlay={<Tooltip > {BROWSE_VIF} </Tooltip>}>
                                        <Button id={"opFivePortTestingTab" + (this.props.portNumber + 1) + "VifSourceBtn"} className={"grl-button load-file-button" + disable5Port} onClick={(e) => { this.displayFileDialog(e) }}>{mainstore.fivePortConfiguration[this.props.portNumber].vifFileName}</Button>
                                    </OverlayTrigger>
                                </FlexView>
                                :
                                <FlexView className={disable5Port + "five-port-label-bottom-spacing"}>
                                    <Dropdown className="dut-type-dropdown-five-port">
                                        <span className="port-label-padding">DUT Type</span>
                                        <Dropdown.Toggle className="grl-button fiveport-dut-type" id={"opFivePortTestingTab" + (this.props.portNumber + 1) + "DutTypeComboBox"} >{mainstore.fivePortConfiguration[this.props.portNumber].dutType}</Dropdown.Toggle>
                                        <Dropdown.Menu className="config-dropdown-menu">
                                            {
                                                Constants.USBPDDeviceType.map((uutType, index) => {
                                                    return <Dropdown.Item className="uutTypeSelection" key={index} eventKey={uutType} onSelect={this.dutTypeDropDownChange}>{uutType}</Dropdown.Item>
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </FlexView>
                            }

                            <FlexView className={disable5Port + "five-port-label-bottom-spacing"}>
                                <span className="port-label-padding">MOI List</span>
                                <Select
                                    // autoFocus
                                    id={"opFivePortTestingTab" + (this.props.portNumber + 1) + "MoiListComboBox"}
                                    isMulti
                                    placeholder="Select MOI"
                                    className='select-dropdown-padding'
                                    value={this.state.selectedOption}
                                    onChange={this.moiTypeDropDownChange}
                                    options={Constants.MOI_TYPES.map((moiType, index) => {
                                        return { value: moiType, label: moiType }
                                    })}
                                    closeMenuOnSelect={false}
                                    isDisabled={!mainstore.fivePortConfiguration[this.props.portNumber].isEnabled}
                                    maxMenuHeight={190}
                                    menuPosition={"fixed"}
                                    menuPlacement={"top"}
                                />
                            </FlexView>

                            {/* <FlexView className={disable5Port + "five-port-label-bottom-spacing"}>
                                <p className="five-port-test-repeat-text-align">Rerun Count </p>
                                <div className="numeric-input-align-five-port">
                                    <OverlayTrigger placement="top" overlay={<Tooltip>General Test Rerun Count </Tooltip>}>
                                        <>
                                            <NumericInput className="five-port-general-repeat-btn" min={0} max={100} value={mainstore.fivePortConfiguration[this.props.portNumber].generalRepeatCount} style={{ display: 'flex', flex: '1' }} onChange={this.onGeneralRepeatInputChange} />
                                        </>
                                    </OverlayTrigger>
                                </div>
                            </FlexView> */}
                            <FlexView className={disable5Port + "five-port-label-bottom-spacing"}>
                                <p className="five-port-failure-repeat-text-align">Repeat Count </p>
                                <div className="numeric-input-align-five-port">
                                    <NumericInput id={"opFivePortTestingTab" + (this.props.portNumber + 1) + "RepeatCountInputField"} className="five-port-failure-repeat-btn" min={0} max={100} value={mainstore.fivePortConfiguration[this.props.portNumber].failureRepeatCount} style={{ width: '100px' }} onChange={this.onFailureRepeatInputChange} />
                                    <div className="five-port-repeat-info-icon" ><OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="tooltip-inner-content-align">{FIVEPORTREPEATCOUNT}</Tooltip>}><img src="../../images/sleep-info.png" alt="info-irdrop" className="info-img-irdrop" /></OverlayTrigger></div>
                                </div>
                            </FlexView>
                            <FlexView className={disable5Port + "five-port-label-bottom-spacing"}>
                                <span className="failure-condition-label-padding">Repeat Condition</span>
                                <Select
                                    id={"opFivePortTestingTab" + (this.props.portNumber + 1) + "RepeastConditionBComboBox"}
                                    isMulti
                                    placeholder="Select Condition"
                                    className='failure-condition-dropdown-padding'
                                    value={this.state.selectedFailureCondition}
                                    onChange={this.failureRepeatDropDownChange}
                                    options={Constants.FAILURE_REPEAT_CONDITION.map((failureType, index) => {
                                        return { value: failureType, label: failureType }
                                    })}
                                    closeMenuOnSelect={false}
                                    isDisabled={mainstore.fivePortConfiguration[this.props.portNumber].failureRepeatCount > 0 ? false : true}
                                    maxMenuHeight={190}
                                    menuPosition={"fixed"}
                                    menuPlacement={"top"}
                                />
                            </FlexView>
                        </div>
                    </FlexView>

                    <FlexView className="five-port-moi-config-align">
                        <FlexView className="align-moi-five-port">
                            <MoiComponents selectedMoi={this.state.selectedOption} />
                        </FlexView>
                    </FlexView>

                    {/* <FlexView>
                        <Button className={"grl-button port-run-button" + disable5Port} onClick={(e) => { this.run5PortTesting() }}>Run</Button>
                        <Button className={"grl-button port-cancel-button" + disable5Port} onClick={(e) => { this.cancel5PortTesting() }}>Cancel</Button>
                    </FlexView> */}
                </>
            );
        }
    })

export default FivePortInfo;