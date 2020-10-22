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

    return (
        <>
            {
                mainstore.productCapabilityProps.ports[Constants.PORTA].getDutType() === Constants.USBPDDeviceType[5] ?
                    <FlexView column style={{ display: props.display }}>
                        <p className='panelHeading'>PD Merged Test Configuration</p>
                        <FlexView column>
                            <Table striped bordered hover>
                                <tbody>
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
                                </tbody>
                            </Table>
                        </FlexView>
                    </FlexView> : null
            }
        </>
    )
}
)

export default PdMergedConfig;