import { observe } from 'mobx';
import { observer } from 'mobx-react';
import Select from 'rc-select';
import React from 'react';
import { Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { ClipLoader } from 'react-spinners';
import * as Constants from '../../Constants';
import { CS_CONNECT_BTN, CS_IPDISCOVER_BTN, FIRMWARE_UPDATE, UPDATE_ELOAD_FIRMWARE } from '../../Constants/tooltip';
import { CS_CONNECTION_BTN, CS_SCAN_NETWORK_BTN, CS_UPDATE_ELOAD_FIRMWARE_BTN, CS_UPDATE_FIRMWARE_BTN } from '../../Constants/uilabels';
import '../../css/rc-table.css';
import { basemodal, mainstore } from '../../ViewModel/BaseModal';
import utils, { mouseBusy } from '../../utils';
import LicenseInfo from "./LicenseInfo";

let connectionInfoClone = {}
let connectionStatus = " "
let updateFirmwareSpinnerDescription = '';
let connectSpinnerDescription = '';
let scanNetworkSpinnerDescription = '';
let eloadSpinnerDescription = '';
const PanelConnectionSetup = observer(
  class PanelConnectionSetup extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        autoDiscoverLoading: false,
        showIpAddressDropDown: false,
        firmwareUpdateLoading: false,
        eLoadFirmwareUpdateLoading: false,
        isNetworkScanned: false,
      };

      const disposer = observe(mainstore, "currentPanelIndex", (change) => {
        if (this.state.showIpAddressDropDown && mainstore.currentPanelIndex !== 0)
          this.onIpDropDownBlur()
        else if (this.state.isNetworkScanned && mainstore.currentPanelIndex === 0) {
          this.onIpDropDownFocus()
        }
      })
    }

    doneConnecting() {
      mainstore.connectionStatusLoader = false
      connectSpinnerDescription = ''
      mouseBusy(false);
      this.setState({ isNetworkScanned: false })
    }

    tryConnectWithC2 = () => {
      this.onIpDropDownBlur()
      mainstore.connectionStatusLoader = true
      mouseBusy(true);
      connectionInfoClone.testerIpAddress = mainstore.connectionInfo.testerIpAddress
      if (mainstore.connectionInfo.testerStatus === "Connected") {
        mainstore.connectionInfo = {}
        mainstore.connectionInfo.testerIpAddress = connectionInfoClone.testerIpAddress        //cleared connection info object,if try to connect again in connection status, for that cloned tester ip address 
        basemodal.setIPAddress(mainstore.connectionInfo.testerIpAddress, this.doneConnecting.bind(this));
      }
      else {
        basemodal.setIPAddress(mainstore.connectionInfo.testerIpAddress, this.doneConnecting.bind(this));
      }
      basemodal.getSoftwareVersion()
    }

    onClickDiscoverIP = () => {
      this.setState({ autoDiscoverLoading: true, isNetworkScanned: true });
      basemodal.discoverIPAddress(this.doneC2Discovery.bind(this));
    }

    firmwareUpdate = () => {
      this.setState({ firmwareUpdateLoading: true })
      mainstore.popUpPolling = true;
      basemodal.getFirmwareUpdate(this.doneFirmWareUpdate.bind(this));
    }

    doneFirmWareUpdate = () => {
      this.setState({ firmwareUpdateLoading: false })
      updateFirmwareSpinnerDescription = ""
    }

    updateEloadFirmware = () => {
      this.setState({ eLoadFirmwareUpdateLoading: true })
      mainstore.popUpPolling = true;
      basemodal.updateEloadFirmware(this.doneEloadFirmWareUpdate.bind(this));
    }

    doneEloadFirmWareUpdate = () => {
      eloadSpinnerDescription = ""
      this.setState({ eLoadFirmwareUpdateLoading: false })
    }

    ipAddressChange = (value, option) => {
      mainstore.connectionInfo.testerIpAddress = value
    }

    doneC2Discovery = () => {
      mainstore.connectionInfo.testerIpAddress = ""
      scanNetworkSpinnerDescription = ''
      this.setState({ autoDiscoverLoading: false });
      this.onIpDropDownFocus()
    }
    getAllIpAddresses = () => {
      return mainstore.IPAddressHistory.map((item, id) => (<Select.Option key={item.ipAddress}><option value={item.ipAddress}>{item.ipAddress}</option>{item.isActive === true ? <img alt="pass" className="ipaddress-icon plot-toolbar-img" src="../../images/pass.png" /> : <img alt="fail" className="ipaddress-icon plot-toolbar-img" src="../../images/fail.png" />}</Select.Option>))
    }

    onIpDropDownSelected = (event) => {
      mainstore.connectionInfo.testerIpAddress = event;
      setTimeout(() => {
        this.onIpDropDownBlur()
      }, 50);//* Hack done as onFocus event is being fired from the internals of Select module
      this.tryConnectWithC2()
    }

    onIpDropDownFocus = () => {
      this.setState({ showIpAddressDropDown: true })
    }

    onIpDropDownBlur = () => {
      this.setState({ showIpAddressDropDown: false })
    }

    showSetupImagePopUp() {
      basemodal.showPopUp("Please Connect the UUT to Port1", null, 'C2 Setup Diagram', null, false, null, "Static.png", null)
    }

    showFirmwareUpdateInstructionPopup() {
      basemodal.showPopUp(Constants.MANUAL_UPDATE_FIRMWARWE_INSTRUCTIONS, null, 'Update C2 Firmware Instruction', null, false, null, "C2FWUpdate.png", null)
    }

    checkFirmwareVersion() {
      if (mainstore.connectionInfo !== undefined && Object.keys(mainstore.connectionInfo).length > 1) {
        var c2FirmwareVersion = mainstore.connectionInfo.firmwareVersion.split(" ");
        var c2LatestFirmVer = mainstore.latestFirmwareVersion ? mainstore.latestFirmwareVersion.split(" ") : "";
        var compareFwResult = c2FirmwareVersion[0].localeCompare(c2LatestFirmVer[0]);
        if (mainstore.connectionInfo.testerStatus === "Connected") {
          if (compareFwResult !== 0) {
            return <>
              <OverlayTrigger placement="auto" overlay={<Tooltip> Please update the firmware version. The version compatible with this build is {mainstore.latestFirmwareVersion} </Tooltip>}>
                <img alt="warning" className="firmware-version-icon" src="../../images/warning.png" />
              </OverlayTrigger >
            </>
          }
        }
      }
    }

    settingSpinnerDescriptions = () => {
      if (mainstore.popUpInputs.spinnerID === 7)
        updateFirmwareSpinnerDescription = mainstore.popUpInputs.spinnerDesc
      else if (mainstore.popUpInputs.spinnerID === 1)
        connectSpinnerDescription = mainstore.popUpInputs.spinnerDesc
      else if (mainstore.popUpInputs.spinnerID === 2)
        scanNetworkSpinnerDescription = mainstore.popUpInputs.spinnerDesc
      else if (mainstore.popUpInputs.spinnerID === 9)
        eloadSpinnerDescription = mainstore.popUpInputs.spinnerDesc

    }

    callConnectButtonAfterUpdatingFirmware = () => {
      if (mainstore.popUpInputs.spinnerDesc === "Sucessfully Updated") {
        basemodal.setIPAddress(mainstore.connectionInfo.testerIpAddress, this.doneConnecting.bind(this));
      }
    }

    compareCurrentDateWithCalibrationEndDate() {
      var calibrationEndDate = mainstore.connectionInfo.calibration_Sp_Date.substring(0, mainstore.connectionInfo.calibration_Sp_Date.indexOf("T"))
      var currentDate = new Date();
      return <>
        <p>
          {calibrationEndDate}
          {/* {Date.parse(currentDate) > Date.parse(calibrationEndDate) ?
            <OverlayTrigger placement="auto" overlay={<Tooltip className="calibration-end-date-tooltip">Tester Calibration Expired, Please Contact Granite River Labs(support@graniteriverlabs.com) </Tooltip>}>
              <img className="firmware-version-icon" src="../../images/warning.png" />
            </OverlayTrigger >
            : null
          } */}
        </p>
      </>
    }

    checkCalibrationStatus = () => {
      for (var key in mainstore.irDropTableValues) {
        if (key === "Loc_1" || "Loc_2")
          return <div className="right-spacing-tester"><b className="calibrated-success-status">Calibrated</b></div>
        else
          return <div className="right-spacing-tester"><b className="calibrated-not-success-status">Not Calibrated, Please calibrate the test cable and then proceed to test execution</b></div>
      }
    }

    render() {

      if (mainstore.connectionInfo.testerStatus === "Connected") {
        connectionStatus = " connection-status-color"
      }
      else {
        connectionStatus = " "
      }

      this.callConnectButtonAfterUpdatingFirmware();
      this.settingSpinnerDescriptions();

      const ci = mainstore.connectionInfo;
      return (<FlexView className="main-mobile-container" style={{ width: '100%', height: Constants.MAX_PANEL_HEIGHT }}>
        <FlexView column className="right-border panel-padding connectiondetails-mobile" style={{ width: Constants.LEFT_PANEL_WIDTH }}>
          {/* <div className="panel-div">Connection-Type</div> */}
          <div className="panel-div">Ethernet Connection Settings </div>
          <FlexView className="set_button_position">
            <OverlayTrigger placement="bottom" overlay={<Tooltip> {CS_IPDISCOVER_BTN} </Tooltip>}>
              <Button disabled={this.state.firmwareUpdateLoading || this.state.eLoadFirmwareUpdateLoading || mainstore.connectionStatusLoader} onClick={this.onClickDiscoverIP} className="grl-button connectionsetup-leftsideSetWidth" id="csScanNetworkBtn">{CS_SCAN_NETWORK_BTN}</Button>
            </OverlayTrigger>
            <div className="connection-setup-cliploader-div">
              <ClipLoader sizeUnit={"px"} size={25} color={'#123abc'} loading={this.state.autoDiscoverLoading} />
            </div>
          </FlexView>
          <p className="firmware-spinner-status">{scanNetworkSpinnerDescription}</p>
          <div className="panel-div">C2 IP Address</div>
          <FlexView>
            <Select onFocus={this.onIpDropDownFocus} onBlur={this.onIpDropDownBlur}
              open={this.state.showIpAddressDropDown} className="ip-address-textbox" value={ci.testerIpAddress} showSearch={false}
              onSearch={null} onChange={this.ipAddressChange} onSelect={this.onIpDropDownSelected} allowClear placeholder="Please enter/select C2 address" combobox>
              {
                this.getAllIpAddresses()
              }
            </Select>
            <OverlayTrigger placement="auto" overlay={<Tooltip> {CS_CONNECT_BTN} </Tooltip>}>
              <Button disabled={this.state.firmwareUpdateLoading || this.state.eLoadFirmwareUpdateLoading || this.state.autoDiscoverLoading} onClick={this.tryConnectWithC2} className="grl-connect-button grl-button connectionsetup-leftsideSetWidth" id="csConnectBtn">{CS_CONNECTION_BTN}</Button>
            </OverlayTrigger>
            <div>
              <ClipLoader sizeUnit={"px"} size={30} color={'#123abc'} loading={mainstore.connectionStatusLoader} />
            </div>
          </FlexView>
          <FlexView>
            <a href="javascript:void(0);" onClick={this.showSetupImagePopUp} id="csSetupDiagramLinkLabel" className="connection-setup-image">Setup Diagram</a>
          </FlexView>
          <FlexView className="connection-status-description">
            <p className="connect-spinner-status">{connectSpinnerDescription}</p>
          </FlexView>

          <FlexView column className="connectionsetup-leftsideSetWidth tool-updatescontainer">
            <div className="panel-div">Tool Updates</div>
            <FlexView className="update-firmware-btn-div">
              <OverlayTrigger placement="auto" trigger="hover" overlay={<Tooltip>{FIRMWARE_UPDATE}  </Tooltip>}>
                <Button disabled={mainstore.isTesterStatusNotConnected || this.state.eLoadFirmwareUpdateLoading || this.state.autoDiscoverLoading || mainstore.connectionStatusLoader} className="grl-button grl-button update-firmware-btn-width" id="csUpdateFirmwareBtn" onClick={this.firmwareUpdate}>{CS_UPDATE_FIRMWARE_BTN}</Button>
              </OverlayTrigger>
              {
                mainstore.firmwareVersionTooltip ?
                  <OverlayTrigger placement="auto" overlay={<Tooltip> Please update the firmware version. The version compatible with this build is {mainstore.firmwareVersionTooltip} </Tooltip>}>
                    <img alt="warning" className="firmware-version-icon" src="../../images/warning.png" />
                  </OverlayTrigger >
                  : null}
              <div className="update-firmware-btn-cliploader-div">
                <ClipLoader sizeUnit={"px"} size={25} color={'#123abc'} loading={this.state.firmwareUpdateLoading} />
              </div>
              <a href="javascript:void(0);" onClick={this.showFirmwareUpdateInstructionPopup} id="csFirmwareUpdateInstructionsLinkLabel" className="update-firmware-label">Firmware Update Instructions</a>
            </FlexView>
            <p className="firmware-spinner-status"> {updateFirmwareSpinnerDescription}</p>

            <FlexView className="update-firmware-btn-div">
              <OverlayTrigger placement="auto" trigger="hover" overlay={<Tooltip> {UPDATE_ELOAD_FIRMWARE} </Tooltip>}>
                <Button disabled={mainstore.isTesterStatusNotConnected || this.state.firmwareUpdateLoading || this.state.autoDiscoverLoading || mainstore.connectionStatusLoader} className="grl-button update-eloadFirmware" id="csUpdateEloadFirmwareBtn" onClick={this.updateEloadFirmware}>{CS_UPDATE_ELOAD_FIRMWARE_BTN}</Button>
              </OverlayTrigger>
              {/* <OverlayTrigger placement="auto" trigger="hover" overlay={<Tooltip> </Tooltip>}>
              <Button disabled className="grl-button" id="connectionsetup_update_software_button">{CS_UPDATE_SOFTWARE_BTN}</Button>
            </OverlayTrigger> */}
              {
                mainstore.eloadVersionTooltip ?
                  <OverlayTrigger placement="auto" overlay={<Tooltip> Please update the firmware version. The version compatible with this build is {mainstore.eloadVersionTooltip} </Tooltip>}>
                    <img alt="warning" className="firmware-version-icon" src="../../images/warning.png" />
                  </OverlayTrigger >
                  : null}

              <div className="update-firmware-btn-cliploader-div">
                <ClipLoader sizeUnit={"px"} size={25} color={'#123abc'} loading={this.state.eLoadFirmwareUpdateLoading} />
              </div>
            </FlexView>
            <p className="firmware-spinner-status"> {eloadSpinnerDescription}</p>
          </FlexView>

        </FlexView >
        <FlexView column className="connectionsetup-rightsidecontainer">
          <FlexView className="device-details-container">
            <FlexView column className="panel-padding sub-container">
              <Table className="device-details-margin">
                <tbody>
                  <tr>
                    <th className="panel-connection-setup-tester-info device-details-border">Tester Status</th>
                    <td className="panel-connection-setup-tester-info tester-info-border device-details-border">
                      <div className={"right-spacing-tester" + connectionStatus}><b>{ci.testerStatus}</b></div>
                    </td>
                  </tr>

                  <tr>
                    <th className="panel-connection-setup-tester-info device-details-border">Serial Number</th>
                    <td className="panel-connection-setup-tester-info tester-info-border  device-details-border">
                      <div className="right-spacing-tester"><b>{ci.serialNumber}</b></div>
                    </td>
                  </tr>

                  <tr>
                    <th className="panel-connection-setup-tester-info device-details-border">Firmware Version </th>
                    <td className="panel-connection-setup-tester-info tester-info-border  device-details-border">
                      <div className="right-spacing-tester"><b>{ci.firmwareVersion}</b>
                        {/* {mainstore.connectionInfo.firmwareVersion ? this.checkFirmwareVersion() : null} */}
                      </div>
                    </td>
                  </tr>
                  {/* 
                  <tr>
                    <th className="panel-connection-setup-tester-info device-details-border">Port Info </th>
                    <td className="panel-connection-setup-tester-info tester-info-border  device-details-border">
                      <div className="right-spacing-tester"> <b>{ci.portInfo}</b> </div>
                    </td>
                  </tr> */}

                  <tr>
                    <th className="panel-connection-setup-tester-info device-details-border">Tester IP Address Info</th>
                    <td className="panel-connection-setup-tester-info tester-info-border  device-details-border">
                      <div className="right-spacing-tester"><b>{ci.testerIpAddress}</b></div>
                    </td>
                  </tr>
                  <tr>
                    <th className="panel-connection-setup-tester-info device-details-border">Last Calibration Date</th>
                    <td className="panel-connection-setup-tester-info tester-info-border  device-details-border">
                      <div className="right-spacing-tester"><b>{ci.calibration_Sp_Date !== undefined && ci.testerStatus === "Connected" ? ci.calibration_St_Date.substring(0, ci.calibration_St_Date.indexOf("T")) : "-"}</b></div>
                    </td>
                  </tr>
                  <tr>
                    <th className="panel-connection-setup-tester-info device-details-border">Next Calibration Due Date</th>
                    <td className="panel-connection-setup-tester-info tester-info-border  device-details-border">
                      <div className="right-spacing-tester"><b>{ci.calibration_Sp_Date !== undefined && ci.testerStatus === "Connected" ? this.compareCurrentDateWithCalibrationEndDate() : "-"}</b></div>
                    </td>
                  </tr>
                  <tr>
                    <th className="panel-connection-setup-tester-info device-details-border">Test Cable Calibration Status
                    <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">Navigate to "Options" panel and then "Cable IR Drop Calibration" tab and then click on "Calibrate" button</Tooltip>}>
                        <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
                      </OverlayTrigger>
                    </th>
                    <td className="panel-connection-setup-tester-info tester-info-border  device-details-border">
                      {
                        this.checkCalibrationStatus()
                      }
                    </td>
                  </tr>
                  <tr>
                    <th className="panel-connection-setup-tester-info device-details-border">C2 Tester Calibration</th>
                    <td className="panel-connection-setup-tester-info tester-info-border  device-details-border">
                      <div className="right-spacing-tester"><b>{ci.boardCalibration}</b></div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </FlexView>
          </FlexView>

          <FlexView column className="panel-padding etched-grey-panel grey-panel-align">
            <div className="license-info-header"><strong>License Info</strong></div>
            <FlexView className="license-info-align">
              <div onWheel={(e) => utils.listenScrollEvent(e)} className="scroll-license-info">
                <LicenseInfo licenses={ci.licenseInfo}></LicenseInfo>
              </div>
            </FlexView>
          </FlexView>
        </FlexView>
      </FlexView >);
    }
  }
);

export default PanelConnectionSetup;
