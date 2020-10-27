import React, { Component } from "react"
import { Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import * as Constants from '../../Constants';
import { basemodal, mainstore } from '../../modals/BaseModal';
import { ClipLoader } from 'react-spinners';
import { APPLY_CONFIGURE, CONFIG_CTRL_APP_MODE } from '../../Constants/tooltip';
import { observer } from "mobx-react";

let applyStatusDescription = ""
const Configure = observer(
    class Configure extends Component {
        state = {
            grlSpclCableSelected: true,
            startCaptureLoader: false,
            loading: false,
        };

        getControls() {
            this.setState({ loading: true })
            basemodal.putC2Configuration(this.doneApplyConfigurations.bind(this));
        }

        uutTypeDropDownOnChange = (index) => mainstore.configControl.c2Config.controllerMode = index;

        onChangeTestCableType = (index) => mainstore.configControl.c2Config.cableType = index;

        onChangePortType = (index) => mainstore.configControl.c2Config.portType = index;

        onChangeAppMode = (index) => {
            mainstore.configControl.c2Config.appMode = index
            if (index === 1)
                mainstore.configControl.c2Config.portType = 0;
        }

        onChangePdSpecType = (index) => mainstore.configControl.c2Config.pdSpecType = index;

        onChangeCableEmulation = (index) => mainstore.configControl.c2Config.cableEmulation = index

        onChangeRpLevels = (index) => mainstore.configControl.c2Config.rpLevel = index

        onChangeFixtureSelection = (index) => mainstore.configControl.c2Config.fixtureSelection = index

        handleAttach = () => basemodal.putSimulateAttachDetach(true)

        handleDetach = () => basemodal.putSimulateAttachDetach(false)

        doneApplyConfigurations = () => {
            setTimeout(() => {
                this.setState({ loading: false })
                applyStatusDescription = ""
            }, 3000);
        }

        startCapture = () => {
            mainstore.status.appState = Constants.BUSY
            mainstore.currentPanelIndex = 3;
            mainstore.enableGlassPaneIfOptionsPanelSelected = true;
            this.setChartAndPollingState(true)
            basemodal.configControllerStartCapture();
        }

        stopCapture = () => basemodal.configControllerStopCapture(this.doneCaptureLoading.bind(this));

        doneCaptureLoading = () => {
            this.setChartAndPollingState(false)
            mainstore.configControllerCaptureInProgress = false
            mainstore.enableGlassPaneIfOptionsPanelSelected = false;
        }

        setChartAndPollingState = (enableStatus) => {
            if (enableStatus)
                mainstore.panelResultPolling = enableStatus
            mainstore.configControllerCaptureInProgress = enableStatus;
            mainstore.chartPollEnabled = enableStatus;
            this.setState({ startCaptureLoader: enableStatus })
        }

        onChangeVbusCheck = () => mainstore.configControlChannels.isCheckedVbus = !mainstore.configControlChannels.isCheckedVbus

        onChangeCcOneCheck = () => mainstore.configControlChannels.isCheckedCc1 = !mainstore.configControlChannels.isCheckedCc1

        onChangeCc2TwoCheck = () => mainstore.configControlChannels.isCheckedCc2 = !mainstore.configControlChannels.isCheckedCc2

        downloadCaptureFile = () => basemodal.getCaptureFile(null);

        dpAuxSnifferLicenseInfo = () => {
            let dpAuxExpired = false;
            mainstore.connectionInfo.licenseInfo.map(license => {
                if (license["moduleName"] === "DP AUX Sniffer")
                    if (license["moduleStatus"] === "EXPIRED")
                        dpAuxExpired = true
                    else
                        dpAuxExpired = false;
            })
            return dpAuxExpired;
        }

        render() {
            if (mainstore.popUpInputs.spinnerID === 5)
                applyStatusDescription = mainstore.popUpInputs.spinnerDesc

            let startCaptureBtnColor = " ";
            let disableRequestMessage = ""
            if (this.state.startCaptureLoader)
                startCaptureBtnColor = "start-capture-btn-color"

            if (Constants.APP_MODE[mainstore.configControl.c2Config.appMode] === Constants.APP_MODE[0])
                disableRequestMessage = " disable-request-message"

            let dutTypeSelection = (<FlexView column className="dut-type-selection">

                <span className="configure-label-padding">Controller Mode
                    {<Dropdown className="config-control-dropdown-flex">
                        <Dropdown.Toggle className="dropdowncustom controller-mode" disabled={Constants.APP_MODE[mainstore.configControl.c2Config.appMode] === Constants.APP_MODE[1]} variant="success" id="dropdown-basic">{Constants.CONTROLLER_MODES[mainstore.configControl.c2Config.controllerMode]}</Dropdown.Toggle>
                        <Dropdown.Menu className="config-dropdown-menu">
                            {
                                Constants.CONTROLLER_MODES.map((uutType, index) => {
                                    return <Dropdown.Item className="uutTypeSelection" key={index} eventKey={uutType} onSelect={this.uutTypeDropDownOnChange.bind(this, index)}>{uutType}</Dropdown.Item>

                                })
                            }
                        </Dropdown.Menu>
                    </Dropdown >}
                </span>
            </FlexView >);

            return (
                <>
                    <FlexView className="panel-padding config-controller-width configure-container" column >
                        <p className="panelHeading">Configure</p>
                        <div className="panel-div">
                            <span className="configure-label-padding" >App Mode
                               <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom app-mode-dropdown" variant="success" id="dropdown-basic" >{Constants.APP_MODE[mainstore.configControl.c2Config.appMode]}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.APP_MODE.map((mode, index) => {
                                                return <Dropdown.Item key={index} eventKey={mode} value={mode} onSelect={this.onChangeAppMode.bind(this, index)} >{mode}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                    {Constants.APP_MODE[mainstore.configControl.c2Config.appMode] === Constants.APP_MODE[1] && this.dpAuxSnifferLicenseInfo() ?
                                        <div className="config-app-mode-dropdown-info-icon" >
                                            <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom"
                                                overlay={<Tooltip className="dut-type-info-tooltip tooltip-inner-content-align">{CONFIG_CTRL_APP_MODE}</Tooltip>}><img className="firmware-version-icon" src="../../images/warning.png" />
                                            </OverlayTrigger>
                                        </div> : null
                                    }
                                </Dropdown >
                            </span>

                            <span className="configure-label-padding fixture-selection-label">{`DP AUX Sniffer \nconnected to `}
                                <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom fixture-selection-dropdown" variant="success" id="dropdown-basic" >{Constants.FIXTURE_SELECTION[mainstore.configControl.c2Config.fixtureSelection]}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.FIXTURE_SELECTION.map((fixture, index) => {
                                                return <Dropdown.Item key={index} eventKey={fixture} value={fixture} onSelect={this.onChangeFixtureSelection.bind(this, index)} >{fixture}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </span>

                            <span className="configure-label-padding" >Port Type
                                <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom configure" disabled={Constants.APP_MODE[mainstore.configControl.c2Config.appMode] === Constants.APP_MODE[1]} variant="success" id="dropdown-basic" >{Constants.PORT_TYPES[mainstore.configControl.c2Config.portType]}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.PORT_TYPES.map((data, index) => {
                                                return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.onChangePortType.bind(this, index)} >{data}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </span>
                            {dutTypeSelection}

                            <span className="configure-label-padding">Test Cable Type
                                <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom cable-type" disabled={Constants.APP_MODE[mainstore.configControl.c2Config.appMode] === Constants.APP_MODE[1]} variant="success" id="dropdown-basic">{Constants.CABLE_DATA_TYPES[mainstore.configControl.c2Config.cableType]}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.CABLE_DATA_TYPES.map((data, index) => {
                                                return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.onChangeTestCableType.bind(this, index)}>{data}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </span>

                            <span className="configure-label-padding">PD Spec Type
                                  <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom pd-spec" disabled={Constants.APP_MODE[mainstore.configControl.c2Config.appMode] === Constants.APP_MODE[1]} variant="success" id="dropdown-basic">{Constants.PDREV_TYPES[mainstore.configControl.c2Config.pdSpecType]}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.PDREV_TYPES.map((data, index) => {
                                                return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.onChangePdSpecType.bind(this, index)}>{data}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </span>

                            <span className="configure-label-padding">Cable Emulation
                                 <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom cable-emulation" variant="success" id="dropdown-basic">{Constants.CABLE_EMULATION[mainstore.configControl.c2Config.cableEmulation]}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.CABLE_EMULATION.map((data, index) => {
                                                return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.onChangeCableEmulation.bind(this, index)}>{data}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </span>

                            <span className="configure-label-padding">Rp Level
                                  <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom rp-level" variant="success" id="dropdown-basic">{Constants.RP_LEVELS[mainstore.configControl.c2Config.rpLevel]}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.RP_LEVELS.map((data, index) => {
                                                return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.onChangeRpLevels.bind(this, index)}>{data}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </span>

                            <FlexView>
                                <OverlayTrigger placement="top" overlay={<Tooltip > {APPLY_CONFIGURE} </Tooltip>}>
                                    <Button className="grl-button configure-apply-button" disabled={mainstore.isTesterStatusNotConnected} onClick={this.getControls.bind(this)}>Apply </Button>
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
                                <Button className="grl-button configure-attach-button attach-detach-btn-align" disabled={Constants.APP_MODE[mainstore.configControl.c2Config.appMode] === Constants.APP_MODE[1] || mainstore.isTesterStatusNotConnected} onClick={this.handleAttach.bind(this)}>Attach </Button>
                                <Button className="grl-button configure-detach-button" disabled={Constants.APP_MODE[mainstore.configControl.c2Config.appMode] === Constants.APP_MODE[1] || mainstore.isTesterStatusNotConnected} onClick={this.handleDetach.bind(this)}>Detach </Button>
                            </FlexView>

                            <FlexView>
                                <span className="configure-label-padding config-channels-checkbox">Channels</span>
                                <label className={"checkbox-label-align"}>
                                    <input type="checkbox" className="checkbox-text-align" checked={mainstore.configControlChannels.isCheckedVbus} onChange={() => { this.onChangeVbusCheck() }} />
                               VBUS
                            </label>
                                <label className={"checkbox-label-align"}>
                                    <input type="checkbox" className="checkbox-text-align" checked={mainstore.configControlChannels.isCheckedCc1} onChange={() => { this.onChangeCcOneCheck() }} />
                               CC1
                            </label>
                                <label className={"checkbox-label-align"}>
                                    <input type="checkbox" className="checkbox-text-align" checked={mainstore.configControlChannels.isCheckedCc2} onChange={() => { this.onChangeCc2TwoCheck() }} />
                               CC2
                            </label>
                            </FlexView>

                            <FlexView >
                                <span className="configure-label-padding">Signal Capture</span>
                                <Button disabled={mainstore.isTesterStatusNotConnected} className={"grl-button configure-attach-button start-capture-btn-align " + startCaptureBtnColor} onClick={() => { this.startCapture() }}>Start </Button>
                                <div className="cliploader-div">
                                    <ClipLoader
                                        sizeUnit={"px"}
                                        size={25}
                                        color={'#123abc'}
                                        loading={this.state.startCaptureLoader}
                                    />
                                </div>
                                <Button disabled={mainstore.isTesterStatusNotConnected} className="grl-button configure-detach-button" onClick={() => { this.stopCapture() }}>Stop </Button>
                            </FlexView>
                            <FlexView >
                                <span className="configure-label-padding">Capture File</span>
                                <p className="save-location-config">{mainstore.configControlSaveLocation}</p>
                            </FlexView>
                            <FlexView >
                                <Button disabled={mainstore.isTesterStatusNotConnected} className="grl-button configure-attach-button download-capture-btn-align " onClick={() => { this.downloadCaptureFile() }}>Download Capture </Button>
                            </FlexView>
                        </div>
                    </FlexView>
                </>
            );
        }
    })

export default Configure;