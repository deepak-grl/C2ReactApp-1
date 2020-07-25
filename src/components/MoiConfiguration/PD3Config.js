import React from 'react';
import FlexView from 'react-flexview/lib';
import { Table, Dropdown } from 'react-bootstrap';
import { observer } from 'mobx-react';
import * as Constants from '../../Constants';
import { mainstore } from '../../modals/BaseModal';

const PD3Config = observer((props) => {
    const pd3Info = mainstore.testConfiguration.pd3Configuration;

    const pd3VconnVoltageDropDownOnChange = (eventKey) => {
        pd3Info.vconnVoltage_PD3 = eventKey
    }

    const isFrSwapCheckBoxOnchange = () => {
        pd3Info.isFrSwapIncluded = !pd3Info.isFrSwapIncluded
    }

    return (
        <FlexView column style={{ display: props.display }}>
            <p className='panelHeading'>Power Delivery 3.0 Test Configuration</p>
            <FlexView column>
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <td className="panellabel">Vconn Voltage</td>
                            <td className="dropdown-config">

                                <Dropdown >
                                    <Dropdown.Toggle className="dropdowncustom" variant="success" id="dropdown-basic">{pd3Info.vconnVoltage_PD3}</Dropdown.Toggle>
                                    <Dropdown.Menu className='pd3-moi-dropdwon-menu'>
                                        {
                                            Constants.CommunicationEngineVconnVoltageLevel.map((uutType, index) => {
                                                return <Dropdown.Item key={index} eventKey={uutType} onSelect={pd3VconnVoltageDropDownOnChange} >{uutType}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >

                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <label className="checkbox-label-width">
                                    <input type="checkbox" className="checkbox-align-custom"
                                        onChange={isFrSwapCheckBoxOnchange} type='checkbox' checked={pd3Info.isFrSwapIncluded} />Is FR_Swap Included
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </FlexView>
        </FlexView>
    )
}
)

export default PD3Config;