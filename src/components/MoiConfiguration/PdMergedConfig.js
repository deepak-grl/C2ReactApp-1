import React from 'react';
import FlexView from 'react-flexview/lib';
import { Dropdown, Table, Form } from 'react-bootstrap';
import * as Constants from '../../Constants';
import { mainstore } from '../../modals/BaseModal';
import { observer } from 'mobx-react';

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
                                            <label className="checkbox-label-width">
                                                <input type="checkbox" id="tcPdMergeConnectFixtureCheckBox" className="checkbox-align-custom" onChange={onEprTestFixtureEnabledChange} checked={pdMergedConfig.isEPRFixtureConnected} /> Connect EPR Test Fixture
                                             </label>
                                        </td>
                                    </tr> : null
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