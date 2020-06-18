import React, { Component } from "react"
import { Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import * as Constants from '../../Constants';
import { basemodal, mainstore } from '../../modals/BaseModal';
import { ClipLoader } from 'react-spinners';
import { APPLY_CONFIGURE } from '../../Constants/tooltip';
import { observer } from "mobx-react";

let applyStatusDescription = ""
const Configure = observer(
    class Configure extends Component {
        state = {
            selectedUutCategory: mainstore.controllerCapability.port1.uutDeviceTypePort,
            TestCableOptions: mainstore.controllerCapability.port1.cableTypePort,
            PortTypes: mainstore.controllerCapability.port1.portType,
            PdRevTypes: mainstore.controllerCapability.port1.pdType,
            AppMode: mainstore.controllerCapability.port1.appMode,
            grlSpclCableSelected: true,
            startCaptureLoader: false,
            loading: false,
        };

        componentDidMount() {
            var portType = Constants.PORT_TYPES[mainstore.ConfigControl.c2Config.portType];
            var cabelDataType = Constants.CABLE_DATA_TYPES[mainstore.ConfigControl.c2Config.cableType];
            var pdRevType = Constants.PDREV_TYPES[mainstore.ConfigControl.c2Config.pdSpecType];
            var controllerMode = Constants.CONTROLLER_MODES[mainstore.ConfigControl.c2Config.controllerMode];
            this.setState({ PortTypes: portType, TestCableOptions: cabelDataType, PdRevTypes: pdRevType, selectedUutCategory: controllerMode });
        }

        uutTypeDropDownOnChange = (eventKey, index) => {
            this.setState({ selectedUutCategory: eventKey })
            if (this.props.portnumber === Constants.PORTA) {
                mainstore.controllerCapability.uutDeviceTypePort1 = eventKey;
                basemodal.putCONTROLType(this.updateTestList.bind(this));
            }
            mainstore.ConfigControl.c2Config.cableType = index;
        }

        getControls() {
            this.setState({ loading: true })
            basemodal.putC2Configuration(this.doneApplyConfigurations.bind(this));
        }

        dropDownOnChange(index, eventKey) {
            this.setState({ TestCableOptions: eventKey })
            if (this.props.portnumber === Constants.PORTA) {
                mainstore.controllerCapability.cableTypePort = eventKey;
            }
            else {
                mainstore.controllerCapability.cableTypePort = eventKey;
            }
            mainstore.ConfigControl.c2Config.controllerMode = index;
        }

        dropDownOnChangePort(index, eventKey) {
            this.setState({ PortTypes: eventKey })
            if (this.props.portnumber === Constants.PORTA) {
                mainstore.controllerCapability.portType = eventKey;
            }
            else {
                mainstore.controllerCapability.portType = eventKey;
            }
            mainstore.ConfigControl.c2Config.portType = index;
        }

        dropDownOnChangeAppMode(index, eventKey) {
            this.setState({ AppMode: eventKey })
            mainstore.ConfigControl.c2Config.appMode = index
        }

        dropDownOnChangePd(index, eventKey) {
            this.setState({ PdRevTypes: eventKey })
            if (this.props.portnumber === Constants.PORTA) {
                mainstore.controllerCapability.pdType = eventKey;
            }
            else {
                mainstore.controllerCapability.pdType = eventKey;

            }
            mainstore.ConfigControl.c2Config.pdSpecType = index;
        }

        handleAttach = () => {
            basemodal.putSimulateAttachDetach(true)
        }

        handleDetach = () => {
            basemodal.putSimulateAttachDetach(false)
        }
        doneApplyConfigurations = () => {
            setTimeout(() => {
                this.setState({ loading: false })
                applyStatusDescription = ""
            }, 3000);
        }

        startCapture = () => {
            mainstore.status.appState = Constants.BUSY
            mainstore.currentPanelIndex = 3;
            this.setChartAndPollingState(true)
            basemodal.configControllerStartCapture();
        }

        stopCapture = () => {
            basemodal.configControllerStopCapture(this.doneCaptureLoading.bind(this));
        }

        doneCaptureLoading = () => {
            this.setChartAndPollingState(false)
        }

        setChartAndPollingState = (enableStatus) => {
            mainstore.panelResultPolling = enableStatus
            mainstore.configControllerCaptureInProgress = enableStatus;
            mainstore.chartPollEnabled = enableStatus;
            this.setState({ startCaptureLoader: enableStatus })
        }

        onChangeVbusCheck = () => {
            mainstore.configControlChannels.isCheckedVbus = !mainstore.configControlChannels.isCheckedVbus
        }

        onChangeCcOneCheck = () => {
            mainstore.configControlChannels.isCheckedCc1 = !mainstore.configControlChannels.isCheckedCc1
        }

        onChangeCc2TwoCheck = () => {
            mainstore.configControlChannels.isCheckedCc2 = !mainstore.configControlChannels.isCheckedCc2
        }

        render() {

            if (mainstore.popUpInputs.spinnerID === 5)
                applyStatusDescription = mainstore.popUpInputs.spinnerDesc

            let startCaptureBtnColor = " ";
            let disableRequestMessage = ""
            if (this.state.startCaptureLoader)
                startCaptureBtnColor = "start-capture-btn-color"

            if (this.state.AppMode === Constants.APP_MODE[0])
                disableRequestMessage = " disable-request-message"

            let dutTypeSelection = (<FlexView column className="dut-type-selection">

                <span className="configure-label-padding">Controller Mode
            {<Dropdown className="config-control-dropdown-flex">
                        <Dropdown.Toggle className="dropdowncustom controller-mode" disabled={this.state.AppMode === Constants.APP_MODE[1]} variant="success" id="dropdown-basic">{this.state.selectedUutCategory}</Dropdown.Toggle>
                        <Dropdown.Menu className="config-dropdown-menu">
                            {
                                Constants.CONTROLLER_MODES.map((uutType, index) => {
                                    return <Dropdown.Item className="uutTypeSelection" key={index} eventKey={uutType} onSelect={(e) => this.uutTypeDropDownOnChange(e, index)}>{uutType}</Dropdown.Item>

                                })
                            }
                        </Dropdown.Menu>
                    </Dropdown >}
                </span>
            </FlexView >);

            return (
                <>
                    < FlexView className="panel-padding config-controller-width configure-container" column >
                        <p className="panelHeading">Configure</p>
                        <div className="panel-div">
                            <span className="configure-label-padding" >App Mode
                            <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom app-mode-dropdown" variant="success" id="dropdown-basic" >{this.state.AppMode}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.APP_MODE.map((mode, index) => {
                                                return <Dropdown.Item key={index} eventKey={mode} value={mode} onSelect={this.dropDownOnChangeAppMode.bind(this, index)} >{mode}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </span>

                            <span className="configure-label-padding" >Port Type
                            <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom configure" disabled={this.state.AppMode === Constants.APP_MODE[1]} variant="success" id="dropdown-basic" >{this.state.PortTypes}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.PORT_TYPES.map((data, index) => {
                                                return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.dropDownOnChangePort.bind(this, index)} >{data}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </span>
                            {dutTypeSelection}

                            <span className="configure-label-padding">Test Cable Type
                         <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom cable-type" disabled={this.state.AppMode === Constants.APP_MODE[1]} variant="success" id="dropdown-basic">{this.state.TestCableOptions}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.CABLE_DATA_TYPES.map((data, index) => {
                                                return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.dropDownOnChange.bind(this, index)}>{data}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </span>

                            <span className="configure-label-padding">PD Spec Type
                         <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom pd-spec" disabled={this.state.AppMode === Constants.APP_MODE[1]} variant="success" id="dropdown-basic">{this.state.PdRevTypes}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.PDREV_TYPES.map((data, index) => {
                                                return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.dropDownOnChangePd.bind(this, index)}>{data}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </span>

                            <FlexView>
                                <OverlayTrigger placement="top" overlay={<Tooltip > {APPLY_CONFIGURE} </Tooltip>}>
                                    <Button className="grl-button configure-apply-button" disabled={this.state.AppMode === Constants.APP_MODE[1]} onClick={this.getControls.bind(this)}>Apply </Button>
                                </OverlayTrigger>
                                <div className="cliploader-div">
                                    <ClipLoader
                                        sizeUnit={"px"}
                                        size={25}
                                        color={'#123abc'}
                                        loading={this.state.loading}
                                    />
                                </div>
                            </FlexView>
                            <FlexView className="configure-apply-button">
                                <p className="firmware-spinner-status">{applyStatusDescription}</p>
                            </FlexView>

                            <FlexView >
                                <span className="configure-label-padding">Emulate Cable</span>
                                <Button className="grl-button configure-attach-button attach-detach-btn-align" disabled={this.state.AppMode === Constants.APP_MODE[1]} onClick={this.handleAttach.bind(this)}>Attach </Button>
                                <Button className="grl-button configure-detach-button" disabled={this.state.AppMode === Constants.APP_MODE[1]} onClick={this.handleDetach.bind(this)}>Detach </Button>
                            </FlexView>

                            <FlexView>
                                <span className="configure-label-padding config-channels-checkbox">Channels</span>
                                <label className={"checkbox-label-align" + disableRequestMessage}>
                                    <input type="checkbox" className="checkbox-text-align" checked={mainstore.configControlChannels.isCheckedVbus} onChange={() => { this.onChangeVbusCheck() }} />
                               VBUS
                            </label>
                                <label className={"checkbox-label-align" + disableRequestMessage}>
                                    <input type="checkbox" className="checkbox-text-align" checked={mainstore.configControlChannels.isCheckedCc1} onChange={() => { this.onChangeCcOneCheck() }} />
                               CC1
                            </label>
                                <label className={"checkbox-label-align" + disableRequestMessage}>
                                    <input type="checkbox" className="checkbox-text-align" checked={mainstore.configControlChannels.isCheckedCc2} onChange={() => { this.onChangeCc2TwoCheck() }} />
                               CC2
                            </label>
                            </FlexView>

                            <FlexView >
                                <span className="configure-label-padding">Capture</span>
                                <Button disabled={this.state.AppMode === Constants.APP_MODE[0]} className={"grl-button configure-attach-button start-capture-btn-align " + startCaptureBtnColor} onClick={() => { this.startCapture() }}>Start </Button>
                                <div className="cliploader-div">
                                    <ClipLoader
                                        sizeUnit={"px"}
                                        size={25}
                                        color={'#123abc'}
                                        loading={this.state.startCaptureLoader}
                                    />
                                </div>
                                <Button disabled={this.state.AppMode === Constants.APP_MODE[0]} className="grl-button configure-detach-button" onClick={() => { this.stopCapture() }}>Stop </Button>
                            </FlexView>
                            <FlexView >
                                <span className="configure-label-padding">Save Location</span>
                                <p className="save-location-config">{mainstore.configControlSaveLocation}</p>
                            </FlexView>
                        </div>
                    </FlexView>
                </>
            );
        }
    })

export default Configure;