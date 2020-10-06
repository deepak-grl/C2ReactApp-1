import React, { Component } from "react"
import { Button, Modal, Dropdown, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { mainstore, basemodal } from '../../modals/BaseModal';
import { observer } from "mobx-react";
import { observe } from 'mobx';
import * as Constants from '../../Constants';
import { ClipLoader } from 'react-spinners';
import utils from '../../utils';
import { IRDROP_CABLENAME_INFO, IRDROP_GRL_SPL_CABLE, IRDROP_USB_C_CABLE, IRDROP_SAVE_LOCATION } from '../../Constants/tooltip';


var irDropSpinnerDesc = "";
const IrDropCalibration = observer(class IrDropCalibration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            location: 1,
            cableType: Constants.IR_DROP_CABLE_DATA_TYPES[0],
            inputValue: "",
            loading: false,
        }

        const disposer = observe(mainstore, "irDropCalibration", (change) => {
            this.updateValues();
        });
    }


    componentDidMount() {
        this.updateValues();
    }

    updateValues() {
        var saveLocaion = Constants.SAVE_LOCATION[mainstore.irDropCalibration.saveLocation];
        var cableType = Constants.IR_DROP_CABLE_DATA_TYPES[mainstore.irDropCalibration.cableType];
        var cableName = mainstore.irDropCalibration.cableName;
        this.setState({ location: saveLocaion, cableType: cableType, inputValue: cableName });
    }

    handleClose = (eventKey) => {
        mainstore.showIrDropCalibrationPopUp = false;
    }
    saveLocationDropDownChange = (eventKey, index) => {
        this.setState({ location: eventKey });
        mainstore.irDropCalibration.saveLocation = index + 1;
    }
    cableTypeDropDownChange = (eventKey, index) => {
        this.setState({ cableType: eventKey });
        mainstore.irDropCalibration.CableType = index;
    }
    cableNameOnChange = (event) => {
        this.setState({ inputValue: event.target.value.replace(/[^\w\s]/gi, "") });
        mainstore.irDropCalibration.CableName = event.target.value.replace(/[^\w\s]/gi, "");
    }

    calibrateButtonClicked = () => {
        mainstore.irDropCalibrationStatus = ""
        mainstore.isCalibratedButtonClicked = true;
        this.setState({ loading: true })
        this.startLogPolling();
        basemodal.putIRDropCalibration(this.doneCalibration.bind(this));
    }

    doneCalibration = () => {
        this.setState({ loading: false })
        mainstore.isCalibratedButtonClicked = false;
        basemodal.getIRDropCalibrationTableValues();
        basemodal.getIrDropCalibrationStatus();
        this.stopLogPolling()
    }

    showReportFile() {
        basemodal.showPopUp('FileName', null, 'Download File', this.fileName(this.state.cableType), true, "OKCancel", null, this.downloadIrDropValues.bind(this))
    }

    fileName = (cableType) => {
        var appendCableTypeText = "_IRDrop.csv"
        switch (cableType) {
            case Constants.IR_DROP_CABLE_DATA_TYPES[1]:
                return "SPL2" + appendCableTypeText;
            case Constants.IR_DROP_CABLE_DATA_TYPES[2]:
                return "STD1" + appendCableTypeText;
            case Constants.IR_DROP_CABLE_DATA_TYPES[3]:
                return "STD2" + appendCableTypeText;
            default:
                return "SPL1" + appendCableTypeText;
        }
    }

    downloadIrDropValues = () => {
        if (mainstore.popUpInputs.responseButton === "Ok")
            basemodal.downloadIrDropFile()
    }

    startLogPolling() {
        this.pollingObj = setInterval(() => {
            basemodal.getIrDropLogMessage()
        }, 1000);
    }

    stopLogPolling() {
        clearInterval(this.pollingObj)
    }

    render() {

        if (mainstore.popUpInputs.spinnerID === 8) {
            irDropSpinnerDesc = mainstore.popUpInputs.spinnerDesc
        }
        return (
            <>
                <FlexView className="ir-drop-img-log-msg-div" >
                    <img className="ir-setup-image" src="../../images/Setup Images/IRdropimg.jpg" />
                    <FlexView className="log-message-div" onWheel={(e) => utils.listenScrollEvent(e)}>
                        {mainstore.logMessages ?
                            mainstore.logMessages.map((message, index) => {
                                return <p className="log-message-label">{message}</p>
                            }) : null
                        }
                    </FlexView>
                </FlexView>

                <FlexView >
                    <FlexView column className="right-border  align-on-zoom panel-padding scroll mobile-product-capability-left-side-container" style={{ width: "58%", paddingLeft: '20px', overflowY: 'auto', marginTop: '0px' }}>
                        <FlexView>
                            <span className="label-text-padding">Cable Name</span>
                            <input className="cable-name" disabled={this.state.loading} value={this.state.inputValue} maxLength="10" placeholder="cablename" onChange={(e) => this.cableNameOnChange(e)} />
                            <div className="irDrop-cable-name-info-btn" ><OverlayTrigger placement="left" overlay={<Tooltip className="tooltip-inner-content-align">{IRDROP_CABLENAME_INFO} </Tooltip>}><img src="../../images/irDrop-info.png" alt="info-irdrop" className="info-img-irdrop" /></OverlayTrigger></div>
                        </FlexView>

                        <FlexView>
                            <Dropdown className="irDrop-port-align">
                                <span className="label-text-padding">Cable Type</span>
                                <Dropdown.Toggle disabled={this.state.loading} className="dropdowncustom cable-type-Dropdown" variant="success">{this.state.cableType}</Dropdown.Toggle>
                                <Dropdown.Menu className="config-dropdown-menu">
                                    {
                                        Constants.IR_DROP_CABLE_DATA_TYPES.map((cableType, index) => {
                                            return <Dropdown.Item className="uutTypeSelection" key={index} eventKey={cableType} onSelect={(e) => this.cableTypeDropDownChange(e, index)}>{cableType}</Dropdown.Item>
                                        })
                                    }
                                </Dropdown.Menu>
                                <div className="irDrop_info_btn_div" ><OverlayTrigger placement="left" overlay={<Tooltip className="tooltip-inner-content-align" > {this.state.cableType === Constants.IR_DROP_CABLE_DATA_TYPES[0] || this.state.cableType === Constants.IR_DROP_CABLE_DATA_TYPES[1] ? IRDROP_GRL_SPL_CABLE : IRDROP_USB_C_CABLE} </Tooltip>}><img src="../../images/irDrop-info.png" alt="info-irdrop" className="info-img-irdrop" /></OverlayTrigger></div>
                            </Dropdown >
                        </FlexView>
                        {/* <FlexView>
                            <Dropdown className="irDrop-port-align"  >
                                <span className="label-text-padding">Save Location</span>
                                <Dropdown.Toggle disabled={this.state.loading} className="dropdowncustom save-location-Dropdown" variant="success">{this.state.location}</Dropdown.Toggle>
                                <Dropdown.Menu className="config-dropdown-menu ir-dropdown-menu">
                                    {
                                        Constants.SAVE_LOCATION.map((saveType, index) => {
                                            return <Dropdown.Item className="uutTypeSelection" key={index} eventKey={saveType} onSelect={(e) => this.saveLocationDropDownChange(e, index)}>{saveType}</Dropdown.Item>
                                        })
                                    }
                                </Dropdown.Menu>
                                <div className="irDrop_info_btn_div" ><OverlayTrigger placement="left" overlay={<Tooltip className="tooltip-inner-content-align"> {IRDROP_SAVE_LOCATION} </Tooltip>}><img src="../../images/irDrop-info.png" alt="info-irdrop" className="info-img-irdrop" /></OverlayTrigger></div>
                            </Dropdown>
                        </FlexView> */}
                        <FlexView className="irdrop-calibration-status-div">
                            <span className="irdrop-calibration-status-label">Calibration Status : </span>
                            <p>{mainstore.irDropCalibrationStatus}</p>
                        </FlexView>
                        <FlexView>
                            <Button className="grl-button calibrate-button" disabled={mainstore.connectionInfo.testerStatus !== "Connected"} onClick={() => this.calibrateButtonClicked()}>Calibrate</Button>
                            <div className="cliploader-calibrate-status">
                                <ClipLoader sizeUnit={"px"} size={25} color={'#123abc'} loading={this.state.loading} />
                            </div>
                            <Button className="grl-button view-values-btn" onClick={() => this.showReportFile()}>Download File</Button>
                        </FlexView>
                        <p className="ir-drop-spinner-status"> {irDropSpinnerDesc}</p>
                    </FlexView>

                    <FlexView className="panel-padding ir-drop-editor-custom-width vif-editor-mobiledisplay" column>
                        <Table id="vif-table" className="vendor-table table-sticky ir-drop-table" striped bordered condensed='true' size='sm' hover>
                            <thead>
                                <tr>
                                    <th>Location</th>
                                    <th>Cable Type</th>
                                    <th>Cable Name</th>
                                    <th>Impedance </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="irdrop-table-td-border">
                                        {Object.keys(mainstore.irDropTableValues).map((key, index) => {
                                            return (<>
                                                {mainstore.irDropTableValues[key].cableVerificationBit > 0 ?
                                                    <FlexView key={index} className="ir-table-row-data">
                                                        <div>{mainstore.irDropTableValues[key].cableLocation}</div>
                                                    </FlexView> : null}
                                            </>)
                                        })}
                                    </td>
                                    <td className="irdrop-table-td-border">
                                        {Object.keys(mainstore.irDropTableValues).map((key, index) => {
                                            return (<>
                                                {mainstore.irDropTableValues[key].cableVerificationBit > 0 ?
                                                    <FlexView key={index} className="ir-table-row-data">
                                                        <div>{mainstore.irDropTableValues[key].type}</div>
                                                    </FlexView> : null}
                                            </>)
                                        })}
                                    </td>
                                    <td className="irdrop-table-td-border">
                                        {Object.keys(mainstore.irDropTableValues).map((key, index) => {
                                            return (<>
                                                {mainstore.irDropTableValues[key].cableVerificationBit > 0 ?
                                                    <FlexView key={index} className="ir-table-row-data">
                                                        <div>{mainstore.irDropTableValues[key].cableName}</div>
                                                    </FlexView> : null}
                                            </>)
                                        })}
                                    </td>
                                    <td className="irdrop-table-td-border">
                                        {Object.keys(mainstore.irDropTableValues).map((key, index) => {
                                            return (<>
                                                {mainstore.irDropTableValues[key].cableVerificationBit > 0 ?
                                                    <FlexView key={index} className="ir-table-row-data">
                                                        <div>{mainstore.irDropTableValues[key].vbusImpedance}</div>
                                                    </FlexView> : null}
                                            </>)
                                        })}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <div className="capture-loaction-div">
                            <p>Capture Location : {mainstore.irDropCalibration.captureLocation}</p>
                        </div>
                    </FlexView>
                </FlexView>
            </>
        );
    }
});

export default IrDropCalibration;