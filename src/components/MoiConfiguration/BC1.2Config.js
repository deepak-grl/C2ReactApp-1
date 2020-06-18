import React from 'react';
import FlexView from 'react-flexview/lib';
import { Dropdown, Table ,Form} from 'react-bootstrap';
import * as Constants from '../../Constants';
import { mainstore } from '../../modals/BaseModal';
import { observer } from 'mobx-react';

const BCTestConfig = observer((props) => {
    let bc_1_2configinfo = mainstore.testConfiguration.bc_1_2TestConfiguration;

    const secondaryTypeDropDownOnChange = (eventKey) => {
        bc_1_2configinfo.secondary_detection = eventKey;
    }

    const maximumCurrentTextBoxOnChange = (event) => {
        bc_1_2configinfo.bC_1_2_MaxCurrent = event.target.value.replace(/[^0-9.]/g,"")        //to allow only positive and decimal numbers
    }

    return (
        <FlexView column style={{ display: props.display }}>
            <p className='panelHeading'>BC 1.2 Test Configuration</p>
            <FlexView column>
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <td className="panellabel">Secondary Detection</td>
                            <td className="dropdown-config">
                                <Dropdown >
                                    <Dropdown.Toggle className="dropdowncustom" variant="success" id="dropdown-basic">{bc_1_2configinfo.secondary_detection}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            Constants.BCDetectionTypes.map((detectType, index) => {
                                                return <Dropdown.Item key={index} eventKey={detectType} onSelect={secondaryTypeDropDownOnChange} >{detectType}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </td>
                        </tr>
                        <tr>
                            <td className="panellabel">Maximum Current</td>
                            <td className="panel-input"><Form.Control className="panelcontrol textbox" value={bc_1_2configinfo.bC_1_2_MaxCurrent} onChange={maximumCurrentTextBoxOnChange} placeholder="" /></td>
                        </tr>
                    </tbody>
                </Table>
            </FlexView>
        </FlexView>
    )
}
)

export default BCTestConfig;