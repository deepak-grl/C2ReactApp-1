import React from 'react';
import FlexView from 'react-flexview/lib';
import { Form, Dropdown, Table, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import * as Constants from '../../Constants';
import { mainstore, basemodal } from '../../modals/BaseModal';
import { observer } from 'mobx-react';
import { MFILIGHTNINGCABLE } from '../../Constants/tooltip';

const MifiChargerConfig = observer((props) => {
    let mfiInfo = mainstore.testConfiguration.mfiChargerConfiguration;

    const mfiTypeDropDownOnChange = (eventKey) => {
        mainstore.selectedEload = eventKey;
    }

    const isCaptiveLightningPlugChanged = (event) => {
        mfiInfo.isCaptiveLightningPlugChecked = event.target.checked;
    }

    const scanEloads = () => {
        basemodal.getEloadsOnScan();
    }
    const connectEload = () => {
        basemodal.putSelectedEload(basemodal.getEloadConnected());
        mainstore.isEloadAdressLoaded = true;
    }

    const eLoadChannelDropDownOnChange = (eventKey) => {
        mfiInfo.selectedEloadChannel = eventKey
    }
    return (
        <FlexView column style={{ display: props.display }}>
            <p className='panelHeading'>MFi Test Configuration</p>
            <FlexView column>
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <td colSpan={2} className="mfi-table-td">
                                <FlexView>
                                    <label className="checkbox-label-width">
                                        <input type="checkbox" id="tcMfiChargerHasCaptiveLightningPlugCheckBox" className="checkbox-align-custom" onChange={(e) => isCaptiveLightningPlugChanged(e)} checked={mfiInfo.isCaptiveLightningPlugChecked} />Charger has captive lightning plug
                                </label>
                                    <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">{MFILIGHTNINGCABLE}</Tooltip>}>
                                        <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
                                    </OverlayTrigger>
                                </FlexView>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <span>E-Load Channel</span>
                                <Dropdown className="eload-dropdown e-load-channel-dropdown">
                                    <Dropdown.Toggle className="dropdowncustom e-load-channel-div" variant="success" id="tcMfiChargerELoadChannelComboBox" >{mfiInfo.selectedEloadChannel}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            Constants.ELOAD_CHANNEL.map((channel, index) => {
                                                return <Dropdown.Item key={index} eventKey={channel} onSelect={eLoadChannelDropDownOnChange}>{channel}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} >
                                <OverlayTrigger placement="top" overlay={<Tooltip> Refresh Instrument Connection </Tooltip>}>
                                    <Button onClick={scanEloads} id="tcMfiScanEloadBtn" className="grl-button mfi-scan-btn" >Scan Eload</Button>
                                </OverlayTrigger>
                            </td>
                        </tr>
                        <tr>
                            <td className="panel-label" style={{ border: 'none' }}>
                                <span>External eLoad VISA Address</span>
                                <Dropdown className="eload-dropdown">
                                    <Dropdown.Toggle className="dropdowncustom eload-visa-dropdown" variant="success" id="tcMfiExternalEloadVisaComboBox" >{mainstore.selectedEload}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            (mainstore.mfi_Eloads).map((mfiType, index) => {
                                                return <Dropdown.Item key={index} eventKey={mfiType} onSelect={mfiTypeDropDownOnChange}>{mfiType}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </td>
                            <td className="mfi-table-td mfi-eload-connect-btn-div">
                                <OverlayTrigger placement="top" overlay={<Tooltip> Connect </Tooltip>}>
                                    <Button onClick={connectEload} id="tcMfiConnectBtn" className="grl-eload-connect-button grl-button">Connect</Button>
                                </OverlayTrigger>
                                {mainstore.isEloadAdressLoaded === true ?
                                    mainstore.isMfiEloadConnected ?
                                        <OverlayTrigger placement="top" overlay={<Tooltip>ELoad Connected</Tooltip>}>
                                            <img src="images/pass.png" className="check-status-icon mfi-eload-connect-status" alt='PASS' ></img>
                                        </OverlayTrigger> :
                                        <OverlayTrigger placement="top" overlay={<Tooltip>ELoad Not Connected</Tooltip>}>
                                            <img src="images/fail.png" className="check-status-icon mfi-eload-connect-status" alt='FAIL' ></img>
                                        </OverlayTrigger> : null}
                            </td>

                        </tr>
                        {mainstore.isEloadAdressLoaded ?
                            <tr>
                                <td>
                                    <p>{mainstore.eLoadResponseData}</p>
                                </td>
                                <td></td>
                            </tr> : null}
                    </tbody>

                </Table>

            </FlexView>
        </FlexView >
    )
}
)

export default MifiChargerConfig;