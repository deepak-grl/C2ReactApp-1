import React from 'react';
import FlexView from 'react-flexview/lib';
import { Form, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { USB_C_FUNCTIONAL_MOI_INFO, USB_FUNCTIONAL_DEVICE_URL, USB_TYPE_B_PORT, USB_TYPE_C_PORT, USB_HUB_CONNECTED } from '../../Constants/tooltip';
import { observer } from 'mobx-react';
import * as Constants from '../../Constants';
import { mainstore, basemodal } from '../../modals/BaseModal';


const FunctionalConfig = observer((props) => {
  var showSetupImg = "";
  var showDeadBatteryCheckBox, showTypeCHubCheckBoxes;
  const funcInfo = mainstore.testConfiguration.functionalConfiguration;

  const OnisHSValidationEnabledChange = (event) => {
    funcInfo.isHSValidationEnabled = event.target.checked;
  }

  const OnisValidationAutomatedEnabledChange = (event) => {
    funcInfo.isValidationAutomated = event.target.checked;
  }

  const serverURLTextBoxOnChange = (event) => {
    funcInfo.serverURL = event.target.value
  }
  const isBatteryConnectedToTheDut = (event) => {
    funcInfo.isBatteryConnectedToTheDut = event.target.checked;
  }

  const showUsbCManualTestSetupImagePopUp = (event) => {

    if (funcInfo.isHSValidationEnabled === false && funcInfo.isValidationAutomated === false)
      showSetupImg = "Functional_non_data";
    else if (funcInfo.isHSValidationEnabled === true && funcInfo.isValidationAutomated === false)
      showSetupImg = "USB_C_Manual_Functional_Test_Setup"
    else if (funcInfo.isHSValidationEnabled === true && funcInfo.isValidationAutomated === true)
      showSetupImg = "Functional_HS_Automated_TestSetup"

    basemodal.showPopUp(null, null, 'USB-C Functional Test Setup', null, false, null, showSetupImg + ".png", null)
  }

  const OnisFrSwapBoardConnectedEnabledChange = (event) => {
    funcInfo.isFrSwapBoardConnected = event.target.checked;
  }

  const usbTypeCPortOnchange = (event) => {
    funcInfo.numberofType_C_Ports = event.target.value.replace(/[^0-9.]/g, "")        //to allow only positive and decimal numbers
  }

  const usbTypeBPortOnchange = (event) => {
    funcInfo.numberofMicroBPorts = event.target.value.replace(/[^0-9.]/g, "")        //to allow only positive and decimal numbers
  }

  const isConnectedHub = (event) => {
    funcInfo.isConnectedHub = event.target.checked;
  }

  const makeDeadBatteryVisible = () => {
    var selectedTestCaseList = mainstore.testConfiguration.selectedTestList;
    if (selectedTestCaseList.includes(Constants.USBFunctionalDeadBatteryTest)) {
      showDeadBatteryCheckBox = <FlexView>
        <label className="checkbox-label-width">
          <input type="checkbox" id="tcUSB-CFunctionalIsBatteryConnectedToDutCheckBox" className="functional-moi-checkbox" checked={funcInfo.isBatteryConnectedToTheDut} onChange={isBatteryConnectedToTheDut} />Is Battery Connected to DUT
       </label>
        <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">{USB_C_FUNCTIONAL_MOI_INFO}</Tooltip>}>
          <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
        </OverlayTrigger>
      </FlexView>
    }

    if (selectedTestCaseList.includes(Constants.USBFunctionalHubPortTypesTest)) {
      makeTypeCHubCheckBoxVisible()
    }
  }

  const makeTypeCHubCheckBoxVisible = () => {
    showTypeCHubCheckBoxes = <>
      <tr>
        <td className="usb-panel-label">Number of USB Type-C ports</td>
        <td className="usb-td-label">
          <input className="usbPanelcontrol textbox" id="tcUSB-CFunctionalNumberofUSBTypeCPortsInputField" value={funcInfo.numberofType_C_Ports} onChange={usbTypeCPortOnchange} />
          <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">{USB_TYPE_C_PORT}</Tooltip>}>
            <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
          </OverlayTrigger>
        </td>
      </tr>

      <tr>
        <td className="usb-panel-label">Number of USB Type-B/Micro-B receptacle or Type-A plug </td>
        <td className="usb-td-label">
          <input className="usbPanelcontrol textbox" id="tcUSB-CFunctionalNumberofUSBType-BReceptaclesInputField" value={funcInfo.numberofMicroBPorts} onChange={usbTypeBPortOnchange} />
          <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">{USB_TYPE_B_PORT}</Tooltip>}>
            <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
          </OverlayTrigger>
        </td>
      </tr>

      <tr>
        <td></td>
        <td>
          <FlexView>
            <label className="checkbox-label-width">
              <input type="checkbox" id="tcUSB-CFunctionalIsConnectedHubIsEmbeddedCheckBox" className="functional-moi-checkbox" checked={funcInfo.isConnectedHub} type='checkbox' onChange={isConnectedHub} />Is connected Hub is embedded
          </label>
            <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">{USB_HUB_CONNECTED}</Tooltip>}>
              <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
            </OverlayTrigger>
          </FlexView>

        </td>
      </tr>
    </>
  }

  return (
    <>
      {makeDeadBatteryVisible()}
      <FlexView column style={{ display: props.display }}>
        <p className='panelHeading'>USB-C Functional Test Configuration</p>
        <FlexView>

          <Table striped bordered hover>
            <tbody>
              <tr>
                <td col="true"></td>
                <td>
                  <label className="checkbox-label-width">
                    <input type="checkbox" id="tcUSB-CFunctionalEnableUSBDataValidationCheckBox" className="checkbox-align-custom" disabled={mainstore.productCapabilityProps.executionMode === "ComplianceMode" ? true : funcInfo.typeCCanActAsHostValue === 0 && funcInfo.typeCCanActAsDeviceValue === 0}
                      onChange={OnisHSValidationEnabledChange} type='checkbox' checked={funcInfo.isHSValidationEnabled} /> Enable USB Data Validation
                </label>
                </td>
              </tr>
              <tr>
                <td col="true"></td>
                <td>
                  <label className="checkbox-label-width">
                    <input type="checkbox" id="tcUSB-CFunctionalAutomateUSBDataValidationCheckBox" className="checkbox-align-custom" disabled={funcInfo.isHSValidationEnabled === false} onChange={OnisValidationAutomatedEnabledChange} type='checkbox' checked={funcInfo.isValidationAutomated} />Automate USB Data Validation
                  </label>
                  <a href="javascript:void(0);" id="tcUSB-CFunctionalAutomateUSBDataValidationSetupImageLinkLabel" onClick={showUsbCManualTestSetupImagePopUp} className="connection-setup-image usbc-setup-image">Setup Image</a>
                </td>
              </tr>
              {/* <tr>
                <td></td>
                <td> <Form.Check  inline label="DUT Power Supply Control Board" checked={funcInfo.isFrSwapBoardConnected} onChange={OnisFrSwapBoardConnectedEnabledChange} type='checkbox' /></td>
                INFO ICON - To automate TD 4.1.2 Unpowered CC Voltage Test case, connect DUT power supply from DUT Power Supply Control Board as shown below test setup image,
             </tr> */}

              <tr>
                <td >Device URL </td>
                <td className="usb-td-label">  {/*className="panel-input"*/}
                  <input type="text" id="tcUSB-CFunctionalDeviceURLInputField" className="usbPanelcontrol textbox" disabled={funcInfo.isValidationAutomated === false} value={funcInfo.serverURL} onChange={serverURLTextBoxOnChange} placeholder="" />
                  <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">{USB_FUNCTIONAL_DEVICE_URL}</Tooltip>}>
                    <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
                  </OverlayTrigger>
                </td>
              </tr>
              {funcInfo.typeCCanActAsHostValue === 0 ?
                <tr>
                  <td colSpan={2}>
                    <p><strong>Prerequisite : Please Install CV tool in DUT </strong></p>
                  </td>
                </tr> : null}

              {funcInfo.typeCPortOnHub !== undefined && funcInfo.typeCPortOnHub !== 0 ?
                <>
                  {showTypeCHubCheckBoxes}
                </>
                : null}

              {showDeadBatteryCheckBox ?
                <tr>
                  <td></td>
                  <td>
                    {showDeadBatteryCheckBox}
                  </td>
                </tr> : null}
            </tbody>
          </Table>
        </FlexView>
      </FlexView>
    </>
  )
}
)

export default FunctionalConfig;