import { observer } from 'mobx-react';
import React from 'react';
import { Dropdown, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import * as Constants from '../../Constants';
import { PDM_EPR_TEST_INFO } from '../../Constants/tooltip';
import { mainstore } from '../../modals/BaseModal';

const PdMergedConfig = observer((props) => {
    let pdMergedConfig = mainstore.testConfiguration.pdMergedConfig;

    const cableEndTypeDropDownOnChange = (eventKey) => {
        pdMergedConfig.cableEnd = eventKey;
    }

    const noiseTypeDropDownOnChange = (eventKey) => {
        pdMergedConfig.noiseType = eventKey;
    }

    const onEprTestFixtureEnabledChange = (event) => {
        pdMergedConfig.isEPRFixtureConnected = event.target.checked;;
    }

    return (
        <>

            <FlexView column style={{ display: props.display }}>
                <p className='panelHeading'>PD Merged Test Configuration</p>
                <FlexView column>
                    <Table striped bordered hover>
                        <tbody>
                            {
                                mainstore.productCapabilityProps.ports[Constants.PORTA].getDutType() === Constants.USBPDDeviceType[5] ?
                                    <tr>
                                        <td className="panellabel">Cable End</td>
                                        <td className="dropdown-config">
                                            <Dropdown >
                                                <Dropdown.Toggle className="dropdowncustom" variant="success" id="tcPdMergedCableEndComboBox">{pdMergedConfig.cableEnd}</Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {
                                                        Constants.PDMergedCableEnd.map((cableType, index) => {
                                                            return <Dropdown.Item key={index} eventKey={cableType} onSelect={cableEndTypeDropDownOnChange} >{cableType}</Dropdown.Item>
                                                        })
                                                    }
                                                </Dropdown.Menu>
                                            </Dropdown >
                                        </td>
                                    </tr>
                                    : null}

                            <tr>
                                <td className="panellabel">Noise Type</td>
                                <td className="dropdown-config">
                                    <Dropdown >
                                        <Dropdown.Toggle className="dropdowncustom" variant="success" id="tcPdMergedNoiseTypeComboBox">{pdMergedConfig.noiseType}</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {
                                                Constants.PD2Noise.map((noiseType, index) => {
                                                    return <Dropdown.Item key={index} eventKey={noiseType} onSelect={noiseTypeDropDownOnChange} >{noiseType}</Dropdown.Item>
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown >
                                </td>
                            </tr>

                            {
                                mainstore.selectedMoiTestCase.includes(Constants.PdMerged_EPR_SRC_Tests) || mainstore.selectedMoiTestCase.includes(Constants.PdMerged_EPR_SNK_Tests) ?
                                    <tr>
                                        <td col="true"></td>
                                        <td>
                                            <FlexView>
                                                <label className="checkbox-label-width">
                                                    <input type="checkbox" id="tcPdMergeConnectFixtureCheckBox" className="functional-moi-checkbox" onChange={onEprTestFixtureEnabledChange} checked={pdMergedConfig.isEPRFixtureConnected} /> Connect EPR Test Fixture
                                             </label>
                                                <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">{PDM_EPR_TEST_INFO}</Tooltip>}>
                                                    <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
                                                </OverlayTrigger>
                                            </FlexView>
                                        </td>
                                    </tr>
                                    : null
                            }
                        </tbody>
                    </Table>
                </FlexView>
            </FlexView>
        </>
    )
}
)

export default PdMergedConfig;