import React from 'react';
import FlexView from 'react-flexview/lib';
import QC3Config from './QC3Config';
import QC4Config from './QC4Config';
import SPTConfig from './SPTConfig';
import TBTConfig from './TBTConfig';
import DpAltModeConfig from './DpAltModeConfig';
import VconnConfig from './VconnConfig'
import FunctionalConfig from './FunctionalConfig';
import PD2CommunicationConfig from './PD2CommunicationConfig';
import { observer } from 'mobx-react';
import { mainstore, basemodal } from '../../modals/BaseModal';
import utils from '../../utils';
import * as Constants from '../../Constants';
import MfgWwcConfig from './MfgWwcConfig';
import MifiChargerConfig from './MfiChargerConfig';
import Select from 'react-select';
import BCTestConfig from './BC1.2Config';
import PD3Config from './PD3Config';
import { ENABLEORDISABLEPOPUP, ENABLEDEBUGMODE } from '../../Constants/tooltip';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { observe, set } from 'mobx';

var isPopUpMoiTestCaseSelected = false;
const MoiComponents = observer(
    class MoiComponents extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                reRender: 0,
                value: [],
                isReRunSelected: false,
                selectedReRunCondition: [],
                copyDebugModeEnabled: false,
            }
            const disposer = observe(mainstore.productCapabilityProps, "executionMode", (change) => {
                if (mainstore.productCapabilityProps.executionMode === Constants.COMPLIANCE_MODE) {   //handling the checkboxe based on App mode and Reteving to prevoius selection state while switching from mode to mode
                    mainstore.commonMoiSetting.isDisableAllPopupChecked = false;
                    mainstore.commonMoiSetting.enableDebugMode = false
                }
                else {
                    mainstore.commonMoiSetting.enableDebugMode = mainstore.copyDebugModeEnabled
                    if (mainstore.copyisAllPopupDisabled) {
                        mainstore.commonMoiSetting.isDisableAllPopupChecked = mainstore.copyisAllPopupDisabled;
                    }
                    else {
                        mainstore.commonMoiSetting.isDisableAllPopupChecked = false
                    }
                }
            });
        }

        getReRunConditionsDefaultValues() {
            var getRepeatConditions = []
            if (mainstore.commonMoiSetting.reRunCondition) {
                for (var i = 0; i < mainstore.commonMoiSetting.reRunCondition.length; i++) {
                    getRepeatConditions.push({ "value": mainstore.commonMoiSetting.reRunCondition[i], "label": mainstore.commonMoiSetting.reRunCondition[i] })
                }
                this.setState({ selectedReRunCondition: getRepeatConditions, reRender: this.state.reRender + 1 })
            }
        }

        checkIfMoiIsSelected = (requiredMoi) => {
            var selectedMoiArray = this.props.selectedMoi
            if (this.props.selectedMoi !== null) {
                for (var i = 0; i < selectedMoiArray.length; i++) {
                    var currentMoiName = selectedMoiArray[i].value;
                    if (currentMoiName === requiredMoi) {
                        isPopUpMoiTestCaseSelected = true;
                        return true;
                    }
                }
            }
        }

        enableOrDisableAllPopup = (event) => {
            mainstore.commonMoiSetting.isDisableAllPopupChecked = event.target.checked
            mainstore.copyisAllPopupDisabled = mainstore.commonMoiSetting.isDisableAllPopupChecked
        }

        defaultTimerForPopupOnChange = (event) => {
            mainstore.commonMoiSetting.defaultTimerForPopup = event.target.value.replace(/\D/, '')        //to allow only positive numbers
            mainstore.popupTimer.restoreDefaultTimerValue = event.target.value
        }

        reRunSelectedTests = () => {
            this.setState({ isReRunSelected: !this.state.isReRunSelected })
            setTimeout(() => {                                  //state variable not updating immedeiately , so here using  settimeout 
                if (this.state.isReRunSelected)
                    mainstore.testExecutionRepeat = 1;
                else
                    mainstore.testExecutionRepeat = 0;
            }, 10);
            this.getReRunConditionsDefaultValues();
        }

        debugMode = (event) => {
            mainstore.commonMoiSetting.enableDebugMode = event.target.checked;
            mainstore.copyDebugModeEnabled = event.target.checked;
        }

        reRunSelectedTestsInputValue = (event) => {
            mainstore.testExecutionRepeat = event.target.value.replace(/\D/, '')        //to allow only positive numbers
        }

        reRunConditionOnChange = (event) => {
            this.setState({ selectedReRunCondition: event })
            var selectedCondition = []
            if (event)
                event.map(function (obj) { selectedCondition.push(obj.value); });
            mainstore.commonMoiSetting.reRunCondition = selectedCondition
        }

        render() {
            var showPD3Config = mainstore.selectedMoiTestCase.includes(Constants.Pd3Tests) && (mainstore.productCapabilityProps.ports[Constants.PORTA].getDutType() === Constants.USBPDDeviceType[5]) > 0 || this.checkIfMoiIsSelected(Constants.Pd3Tests);
            var showQC4Config = mainstore.selectedMoiTestCase.includes(Constants.Qc4Tests) || this.checkIfMoiIsSelected(Constants.Qc4Tests);
            var showqQC3Config = (mainstore.selectedMoiTestCase.includes(Constants.Qc3Tests) || mainstore.selectedMoiTestCase.includes(Constants.Qc3PlusTests)) || (this.checkIfMoiIsSelected(Constants.Qc3Tests) || this.checkIfMoiIsSelected(Constants.Qc3PlusTests));
            var showSptConfig = mainstore.selectedMoiTestCase.includes(Constants.SourcePowerTests) || this.checkIfMoiIsSelected(Constants.SourcePowerTests);
            var showTBTConfig = mainstore.selectedMoiTestCase.includes(Constants.TbtTests) || this.checkIfMoiIsSelected(Constants.TbtTests);
            var showfuncConfig = mainstore.selectedMoiTestCase.includes(Constants.FunctionalTests) || this.checkIfMoiIsSelected(Constants.FunctionalTests);
            var showDpAltModeConfig = mainstore.selectedMoiTestCase.includes(Constants.DpAltModeTests) || this.checkIfMoiIsSelected(Constants.DpAltModeTests);
            var showPd2Config = ((mainstore.selectedMoiTestCase.includes(Constants.Pd2DeterministicTests))) && (mainstore.productCapabilityProps.ports[Constants.PORTA].getDutType() === Constants.USBPDDeviceType[5]) > 0 || this.checkIfMoiIsSelected(Constants.Pd2DeterministicTests);
            var showPd2CommunicationConfig = mainstore.selectedMoiTestCase.includes(Constants.Pd2CommunicatonEngineTests) || this.checkIfMoiIsSelected(Constants.Pd2CommunicatonEngineTests);
            var showcbChargerConfig = mainstore.selectedMoiTestCase.includes(Constants.MfgWwcTests) || this.checkIfMoiIsSelected(Constants.MfgWwcTests);
            var showMfiTestConfig = mainstore.selectedMoiTestCase.includes(Constants.MFiTests) || this.checkIfMoiIsSelected(Constants.MFiTests)
            var showBC_1_2TestConfig = mainstore.selectedMoiTestCase.includes(Constants.BC_1_2Tests) || this.checkIfMoiIsSelected(Constants.BC_1_2Tests)

            let pd3Config = <PD3Config display={showPD3Config ? 'block' : 'none'} />
            let qc4Config = <QC4Config display={showQC4Config ? 'block' : 'none'} />
            let qc3Config = <QC3Config display={showqQC3Config ? 'block' : 'none'} />
            let sptConfig = <SPTConfig display={showSptConfig ? 'block' : 'none'} />
            let tbtConfig = <TBTConfig display={showTBTConfig ? 'block' : 'none'} />
            let funcConfig = <FunctionalConfig display={showfuncConfig ? 'block' : 'none'} />
            let dpAltModeConfig = <DpAltModeConfig display={showDpAltModeConfig ? 'block' : 'none'} />
            let pd2Config = <VconnConfig display={showPd2Config ? 'block' : 'none'} />
            let pd2CommunicationConfig = <PD2CommunicationConfig display={showPd2CommunicationConfig ? 'block' : 'none'} />
            let cbChargerConfig = <MfgWwcConfig display={showcbChargerConfig ? 'block' : 'none'} />
            let mfiChargerConfig = <MifiChargerConfig display={showMfiTestConfig ? 'block' : 'none'} />
            let bc_1_2TestConfig = <BCTestConfig display={showBC_1_2TestConfig ? 'block' : 'none'} />
            let ifTestCaseSelected = mainstore.selectedMoiTestCase.length > 0

            return (
                <>
                    <FlexView column className="panel-setWidth" column>
                        <div onWheel={(e) => utils.listenScrollEvent(e)} className="scroll moi-container" >

                            <FlexView>
                                <label className="checkbox-label-width">
                                    <input type="checkbox" disabled={mainstore.productCapabilityProps.executionMode === Constants.COMPLIANCE_MODE} className="functional-moi-checkbox" checked={mainstore.commonMoiSetting.isDisableAllPopupChecked} type='checkbox' onChange={(e) => { this.enableOrDisableAllPopup(e) }} />Timeout Pop-up Messages
                                            </label>
                                <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">{ENABLEORDISABLEPOPUP}</Tooltip>}>
                                    <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
                                </OverlayTrigger>

                                {mainstore.commonMoiSetting.isDisableAllPopupChecked ?
                                    <div className="popup-timer-div">
                                        <span>Popup Timer(sec)</span>
                                        <input type="textbox" className="popup-timer-input" value={mainstore.commonMoiSetting.defaultTimerForPopup} onChange={(e) => { this.defaultTimerForPopupOnChange(e) }} />
                                    </div>
                                    : null}
                            </FlexView>
                            <FlexView>
                                <label className="checkbox-label-width">
                                    <input type="checkbox" className="functional-moi-checkbox" disabled={mainstore.productCapabilityProps.executionMode === Constants.COMPLIANCE_MODE} checked={this.state.isReRunSelected} type='checkbox' onChange={(e) => { this.reRunSelectedTests(e) }} />Rerun Selected Tests
                                            </label>
                                <input type="textbox" className="popup-timer-input" disabled={!this.state.isReRunSelected} value={this.state.isReRunSelected ? mainstore.testExecutionRepeat : 0} onChange={(e) => { this.reRunSelectedTestsInputValue(e) }} />

                                <label className="debug-mode-checkbox checkbox-label-width">
                                    <input type="checkbox" className="functional-moi-checkbox" disabled={mainstore.productCapabilityProps.executionMode === Constants.COMPLIANCE_MODE} checked={mainstore.commonMoiSetting.enableDebugMode} type='checkbox' onChange={(e) => { this.debugMode(e) }} />Enable Debug Mode
                                 </label>
                                <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">{ENABLEDEBUGMODE}</Tooltip>}>
                                    <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
                                </OverlayTrigger>
                            </FlexView>
                            {/* {this.state.isReRunSelected ?
                                <FlexView>
                                    <span className="rerun-condition-label">ReRun Condition</span>
                                    <Select
                                        // autoFocus
                                        isMulti
                                        placeholder="Select Condition"
                                        className='rerun-condition-dropdown'
                                        value={this.state.selectedReRunCondition}
                                        onChange={this.reRunConditionOnChange}
                                        options={Constants.FAILURE_REPEAT_CONDITION.map((failureType, index) => {
                                            return { value: failureType, label: failureType }
                                        })}
                                        closeMenuOnSelect={false}
                                        isDisabled={!this.state.isReRunSelected}
                                        maxMenuHeight={190}
                                        menuPosition={"fixed"}
                                        menuPlacement={"auto"}
                                    />
                                </FlexView> : null} */}

                            <hr />
                            {ifTestCaseSelected ?
                                null
                                : <p className="panelHeading">MOI Configurations</p>
                            }

                            <p style={{ fontStyle: 'italic', display: (ifTestCaseSelected || isPopUpMoiTestCaseSelected) ? 'none' : 'block' }} className="panel-div">*Select test case for MOI Configurations</p>
                            {pd3Config}
                            {qc4Config}
                            {qc3Config}
                            {sptConfig}
                            {tbtConfig}
                            {dpAltModeConfig}
                            {funcConfig}
                            {pd2Config}
                            {pd2CommunicationConfig}
                            {cbChargerConfig}
                            {mfiChargerConfig}
                            {bc_1_2TestConfig}
                        </div>
                    </FlexView>
                </>
            );
        }
    }
);

export default MoiComponents;