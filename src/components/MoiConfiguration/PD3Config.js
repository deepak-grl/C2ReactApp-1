import React from 'react';
import FlexView from 'react-flexview/lib';
import { Table, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { observer } from 'mobx-react';
import * as Constants from '../../Constants';
import { mainstore } from '../../modals/BaseModal';
import { FRSWAP_TEST_INFO, VCONN_INFO, PD3_VCONN_INFO } from '../../Constants/tooltip';

const PD3Config = observer((props) => {
    const pd3Info = mainstore.testConfiguration.pd3Configuration;

    const pd3VconnVoltageDropDownOnChange = (eventKey) => {
        pd3Info.vconnVoltage_PD3 = eventKey
    }

    const isFrSwapCheckBoxOnchange = () => {
        pd3Info.isFrSwapIncluded = !pd3Info.isFrSwapIncluded
    }

    return (
        <>
            {mainstore.productCapabilityProps.ports[Constants.PORTA].getDutType() === Constants.USBPDDeviceType[5] || mainstore.productCapabilityProps.ports[Constants.PORTA].getDutType() === Constants.USBPDDeviceType[4] || mainstore.productCapabilityProps.ports[Constants.PORTA].getDutType() === Constants.USBPDDeviceType[2] ?
                <FlexView column style={{ display: props.display }}>
                    <p className='panelHeading'>Power Delivery 3.0 Test Configuration</p>
                    <FlexView column>
                        <Table striped bordered hover>
                            <tbody>
                                {mainstore.productCapabilityProps.ports[Constants.PORTA].getDutType() === Constants.USBPDDeviceType[5] ?
                                    <tr>
                                        <td className="panellabel">Vconn Voltage</td>
                                        <td className="dropdown-config vconn-volt-info-div">

                                            <Dropdown className="vconn-volt-info-img">
                                                <Dropdown.Toggle className="dropdowncustom" variant="success" id="dropdown-basic">{pd3Info.vconnVoltage_PD3}</Dropdown.Toggle>
                                                <Dropdown.Menu className='pd3-moi-dropdwon-menu'>
                                                    {
                                                        Constants.CommunicationEngineVconnVoltageLevel.map((uutType, index) => {
                                                            return <Dropdown.Item key={index} eventKey={uutType} onSelect={pd3VconnVoltageDropDownOnChange} >{uutType}</Dropdown.Item>
                                                        })
                                                    }
                                                </Dropdown.Menu>
                                            </Dropdown >
                                            <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">{PD3_VCONN_INFO}</Tooltip>}>
                                                <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
                                            </OverlayTrigger>

                                        </td>
                                    </tr> : null}
                                {(mainstore.productCapabilityProps.ports[Constants.PORTA].getDutType() === Constants.USBPDDeviceType[4] || mainstore.productCapabilityProps.ports[Constants.PORTA].getDutType() === Constants.USBPDDeviceType[2]) && mainstore.productCapabilityProps.executionMode === Constants.INFORMATIONAL_MODE ?
                                    <tr>
                                        <td className="fr-swap-connected-info">
                                            <label className="checkbox-label-width">
                                                <input type="checkbox" className="checkbox-align-custom" disabled={mainstore.productCapabilityProps.executionMode === Constants.COMPLIANCE_MODE}
                                                    onChange={isFrSwapCheckBoxOnchange} type='checkbox' checked={pd3Info.isFrSwapIncluded} />FR_Swap AUTO Box Connected
                                          </label>
                                            <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">{FRSWAP_TEST_INFO}</Tooltip>}>
                                                <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
                                            </OverlayTrigger>
                                        </td>
                                    </tr> : null}
                            </tbody>
                        </Table>
                    </FlexView>
                </FlexView> : null}
        </>
    )
}
)

export default PD3Config;