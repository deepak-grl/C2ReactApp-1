import React from "react"
import { Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import * as Constants from '../../Constants';
import { mainstore, basemodal } from '../../ViewModel/BaseModal';
import { CO_REQUEST_BTN } from '../../Constants/tooltip';
import { observer } from "mobx-react";

const supplyIndexBattery = 'Battery';

const RequestMessage = observer(
    class RequestMessage extends React.Component {
        constructor(props) {
            super(props);
            this.state = {

                PodTypes: mainstore.controllerCapability.port1.podType,
                loading: false,

                SupplyTypes: mainstore.controllerCapability.port1.supplyType,
                //loading: false,

                setGiveBackFlag: false,
                usbCable: false,

                showOperatingPower: true,

                isCheckedCapabilityMismatch: false,
                isCheckedUsbCommunication: false,
                isCheckedNoUsb: false,
                isCheckedUnchunkedExtend: false,

                showOperatingCurrent: true,
                isBatterySelected: false,

                operatingCurrentValue: 1,
                operatingCurrentMinimumValue: 1,
                operatingCurrentMaximumValue: 1,

                operatingPowerValue: 1,
                operatingPowerMaximumValue: 1,
                operatingPowerMinimumValue: 1,

                outputVoltage: 1,
                ppsOperatingCurrent: 1,

                SupplyIndex: 0,
                PdoIndex: 0,
            };
        }

        componentDidMount() {
            mainstore.requestMessage = basemodal.chartModal.requestMessageDefault;  // clear Request Message object values in mainstore.
        }

        dropDownOnChangePod(index, eventKey) {
            this.setState({ PodTypes: eventKey, PdoIndex: index })
            if (this.props.portnumber === Constants.PORTA) {
                mainstore.controllerCapability.podType = eventKey;
            }
            else {
                mainstore.controllerCapability.podType = eventKey;
            }
        }

        dropDownOnChangeSupply(eventKey, index, data) {
            this.setState({ SupplyTypes: eventKey, SupplyIndex: index })

            if (this.props.portnumber === Constants.PORTA) {
                mainstore.controllerCapability.supplyType = eventKey;
            }
            else {
                mainstore.controllerCapability.supplyType = eventKey;
            }
        }

        toggleChangeCapabilityMismatch = () => {
            this.setState({
                isCheckedCapabilityMismatch: !this.state.isCheckedCapabilityMismatch
            })
        }
        toggleChangeNoUsb = () => {
            this.setState({
                isCheckedNoUsb: !this.state.isCheckedNoUsb
            })
        }

        toggleChangeUsbCommunication = () => {
            this.setState({
                isCheckedUsbCommunication: !this.state.isCheckedUsbCommunication
            })
        }

        toggleChangeUnchunkedExtend = () => {
            this.setState({
                isCheckedUnchunkedExtend: !this.state.isCheckedUnchunkedExtend
            })
        }

        toggleChangeGiveBack = (event) => {
            this.setState({
                setGiveBackFlag: !this.state.setGiveBackFlag,

            })
            if (this.state.setGiveBackFlag === false) {
                this.setState({
                    showOperatingCurrent: false,
                    showOperatingPower: false,
                });
            }
            else {
                this.setState({
                    showOperatingCurrent: true,
                    showOperatingPower: true,
                });
            }
        }

        handlechangeOperatingCurrent = (event) => {
            this.setState({ operatingCurrentValue: event.target.value })
        }

        handlechangeMinimumCurrent = (event) => {
            this.setState({ operatingCurrentMinimumValue: event.target.value })
        }

        handlechangeMaximumCurrent = (event) => {
            this.setState({ operatingCurrentMaximumValue: event.target.value })
        }

        handlechangeOperatingPower = (event) => {
            this.setState({ operatingPowerValue: event.target.value })
        }

        handlechangeMaximumPower = (event) => {
            this.setState({ operatingPowerMaximumValue: event.target.value })
        }
        handlechangeMinimumPower = (event) => {
            this.setState({ operatingPowerMinimumValue: event.target.value })
        }
        handleChangeOutputVoltage = (event) => {
            this.setState({ outputVoltage: event.target.value })
        }
        handleChangePpsOperatingCurrent = (event) => {
            this.setState({ ppsOperatingCurrent: event.target.value })
        }


        requestMessage() {
            mainstore.requestMessage = {
                SupplyIndex: this.state.SupplyIndex,
                PDOIndex: this.state.PdoIndex,
                GiveBackFlag: this.state.setGiveBackFlag,
                CapabilityMismatch: this.state.isCheckedCapabilityMismatch,
                USBCommunicationsCableMismatch: this.state.isCheckedUsbCommunication,
                USBSuspend: this.state.isCheckedNoUsb,
                UnchunckedExtendMessageSupport: this.state.isCheckedUnchunkedExtend,
                OperatingCurrent: this.state.operatingCurrentValue,
                MaximumCurrent: this.state.operatingCurrentMaximumValue,
                MinimumCurrent: this.state.operatingCurrentMinimumValue,
                OperatingPower: this.state.operatingPowerValue,
                MaximumPower: this.state.operatingPowerMaximumValue,
                MinimumPower: this.state.operatingPowerMinimumValue,
                PpsOperatingCurrent: this.state.ppsOperatingCurrent,
                OutputVoltage: this.state.outputVoltage
            }
            basemodal.putConfigRequestMessage();
        }

        render() {
            var defaultOperatingCurrent = 10;
            var defaultOperatingPowerValue = 250;
            var ppsDefaultOperatingCurrent = 50;
            var ppsDefaultOutputVoltage = 20;
            var setGiveBackFlag =
                <label className="request-specs">
                    <input type="checkbox" id="opConfigControllerRequestMessageSetGiveBackFlagCheckBox" className="checkbox-text-align" checked={this.state.setGiveBackFlag} onChange={this.toggleChangeGiveBack} />  Set Give Back Flag
            </label>

            var showFixedAndVariableOperatinCurrent =
                <>
                    <label className="checkbox-label-align">Operating Current {defaultOperatingCurrent}mA Units:
                        <input className="request-input-field-width" id="opConfigControllerRequestMessageOperatingCurrentInputField" type="text" placeholder="10mA Units" value={this.state.operatingCurrentValue} onChange={(evt) => this.handlechangeOperatingCurrent(evt)}></input>
                        <p> {(this.state.operatingCurrentValue) * defaultOperatingCurrent}mA</p>
                    </label>
                </>
            var showBatteryOperatingPower =
                <>
                    <label className="checkbox-label-align">Operating Power in {defaultOperatingPowerValue}mW Units:
                        <input type="text" className="request-input-field-width" id="opConfigControllerRequestMessageOperatingPowerInputField" value={this.state.operatingPowerValue} onChange={(e) => this.handlechangeOperatingPower(e)}></input>
                        <p>{this.state.operatingPowerValue * defaultOperatingPowerValue}mW</p>
                    </label>

                </>

            return (
                <FlexView className="panel-padding config-controller-width control request-container" column>
                    <p className="panelHeading">Request</p>
                    <div className="panel-div disable-request-message">
                        <span className="request-supply-text">PDO Index
                    <Dropdown className="config-control-dropdown-flex">
                                <Dropdown.Toggle disabled className="dropdowncustom pdo-Index" variant="success" id="opConfigControllerRequestMessagePdoIndexComboBox">{this.state.PodTypes}</Dropdown.Toggle>
                                <Dropdown.Menu className="config-dropdown-menu">
                                    {
                                        Constants.PDO_TYPES.map((data, index) => {
                                            return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.dropDownOnChangePod.bind(this, index)}>{data}</Dropdown.Item>
                                        })
                                    }
                                </Dropdown.Menu>
                            </Dropdown >
                        </span>

                        <span className="request-supply-text">Supply Index
                    <Dropdown className="config-control-dropdown-flex">
                                <Dropdown.Toggle disabled className="dropdowncustom supply-type" variant="success" id="opConfigControllerRequestMessageSupplyIndexComboBox">{this.state.SupplyTypes}</Dropdown.Toggle>
                                <Dropdown.Menu className="config-dropdown-menu">
                                    {
                                        Constants.SUPPLY_TYPES.map((data, index) => {
                                            return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.dropDownOnChangeSupply.bind(this, data, index)}>{data}</Dropdown.Item>
                                        })
                                    }
                                </Dropdown.Menu>
                            </Dropdown >
                        </span>

                        {this.state.SupplyTypes === "Fixed" || this.state.SupplyTypes === "Variable" ? (
                            <div>
                                {setGiveBackFlag}
                                {this.state.showOperatingCurrent ? (<div>
                                    {showFixedAndVariableOperatinCurrent}
                                    <label className="checkbox-label-align">Maximum Current {defaultOperatingCurrent}mA Units:
                                        <input type="text" id="opConfigControllerRequestMessageMaximumCurrentInputField" className="request-input-field-width" placeholder="10mA Units" value={this.state.operatingCurrentMaximumValue} onChange={(e) => this.handlechangeMaximumCurrent(e)}></input>
                                        <p>{this.state.operatingCurrentMaximumValue * defaultOperatingCurrent}mA</p>
                                    </label>
                                </div>) :
                                    (<div>
                                        {showFixedAndVariableOperatinCurrent}
                                        <label className="checkbox-label-align">Minimum Current {defaultOperatingCurrent}mA Units:
                                            <input type="text" className="request-input-field-width" id="opConfigControllerRequestMessageMinimumCurrentInputField" placeholder="10mA Units" value={this.state.operatingCurrentMinimumValue} onChange={(e) => this.handlechangeMinimumCurrent(e)}></input>
                                            <p>{this.state.operatingCurrentMinimumValue * defaultOperatingCurrent}mA</p>
                                        </label>
                                    </div>)
                                }
                            </div>) : null}

                        {this.state.SupplyTypes === "Battery" ? (
                            <>
                                {setGiveBackFlag}
                                {this.state.showOperatingPower ? (<div>
                                    {showBatteryOperatingPower}
                                    <label className="checkbox-label-align">Maximum Power in {defaultOperatingPowerValue}mW Units :
                                    <input type="text" id="opConfigControllerRequestMessageMaximumPowerInputField" className="request-input-field-width" value={this.state.operatingPowerMaximumValue} onChange={(e) => this.handlechangeMaximumPower(e)}></input>
                                        <p>{this.state.operatingPowerMaximumValue * defaultOperatingPowerValue}mW</p>
                                    </label>
                                </div>) :
                                    (<div>
                                        {showBatteryOperatingPower}
                                        <label className="checkbox-label-align">Minimum Power in {defaultOperatingPowerValue}mW Units:
                                        <input type="text " id="opConfigControllerRequestMessageMinimumPowerInputField" className="request-input-field-width" value={this.state.operatingPowerMinimumValue} onChange={(e) => this.handlechangeMinimumPower(e)}></input>
                                            <p>{this.state.operatingPowerMinimumValue * defaultOperatingPowerValue}mW</p>
                                        </label>
                                    </div>)
                                }
                            </>
                        ) : (null)}

                        {this.state.SupplyTypes === "PPS" ? (
                            <>
                                <label className="checkbox-label-align">Output Voltage in {ppsDefaultOutputVoltage}mV units
                            < input type="text" className="request-input-field-width" id="opConfigControllerRequestMessageOutputVoltageInputField" value={this.state.outputVoltage} onChange={(e) => this.handleChangeOutputVoltage(e)}></input>
                                    <p>{this.state.outputVoltage * ppsDefaultOutputVoltage}mV</p>
                                </label>
                                <label className="checkbox-label-align">Operating Current {ppsDefaultOperatingCurrent}mA units
                              <input type="text" className="request-input-field-width" id="opConfigControllerRequestMessageOpeartingCurrentInputField" value={this.state.ppsOperatingCurrent} onChange={(e) => this.handleChangePpsOperatingCurrent(e)}></input>
                                    <p>{this.state.ppsOperatingCurrent * ppsDefaultOperatingCurrent}mA</p>
                                </label>
                            </>) : null
                        }

                        <FlexView className="panel-padding checkbox-text-align request-sub-container" column>
                            <label className="checkbox-label-align">
                                <input type="checkbox" id="opConfigControllerRequestMessageCapabilityMismatchCheckBox" className="checkbox-text-align" checked={this.state.isCheckedCapabilityMismatch} onChange={this.toggleChangeCapabilityMismatch} />
                                Capability Mismatch
                            </label>

                            <label className="checkbox-label-align">
                                <input type="checkbox" id="opConfigControllerRequestMessageUSBCommunicationsCableMismatchCheckBox" className="checkbox-text-align" checked={this.state.isCheckedUsbCommunication} onChange={this.toggleChangeUsbCommunication} />
                                USB Communications Cable Mismatch
                            </label>

                            <label className="checkbox-label-align">
                                <input type="checkbox" id="opConfigControllerRequestMessageNoUsbSuspendCheckBox" className="checkbox-text-align" checked={this.state.isCheckedNoUsb} onChange={this.toggleChangeNoUsb} />
                                NO USB Suspend
                            </label>

                            <label className="checkbox-label-align">
                                <input type="checkbox" id="opConfigControllerRequestMessageUnchunckedExtendMessageSupportCheckBox" className="checkbox-text-align" checked={this.state.isCheckedUnchunkedExtend} onChange={this.toggleChangeUnchunkedExtend} />
                                Unchuncked Extend Message Support
                        </label>

                            <OverlayTrigger placement="bottom" overlay={<Tooltip> {CO_REQUEST_BTN} </Tooltip>}>
                                <Button disabled id="opConfigControllerRequestMessageRequestBtn" className="grl-button config-request-grl-button-align" onClick={this.requestMessage.bind(this)}>Request</Button>
                            </OverlayTrigger>
                        </FlexView>
                    </div >

                </FlexView >

            )
        }
    })
export default RequestMessage;