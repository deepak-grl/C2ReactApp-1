import React from 'react';
import FlexView from 'react-flexview/lib';
import { Form, Dropdown, Table } from 'react-bootstrap';
import * as Constants from '../../Constants';
import { mainstore } from '../../modals/BaseModal';
import { observer } from 'mobx-react';

const QC4Config = observer((props) => {
  let qc4Info = mainstore.testConfiguration.qc4Configuration;

  const uutTypeDropDownOnChange = (eventKey) => {
    qc4Info.dutType = eventKey;
  }
  const roomTempTextBoxOnChange = (event) => {
    qc4Info.roomTemperature = event.target.value.replace(/[^0-9.]/g, "")        //to allow only positive and decimal numbers
  }

  return (
    <FlexView column style={{ display: props.display }}>
      <p className='panelHeading'>Quick Charge 4 Test Configuration</p>
      <FlexView column>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className="panellabel">QC4 DUT Type</td>
              <td className="dropdown-config">
                <Dropdown>
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="dropdown-basic">{qc4Info.dutType}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.QC4DutTypes.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={uutTypeDropDownOnChange}>{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>

            <tr>
              <td className="panellabel">Room Temperature </td>
              <td className="panel-input"><Form.Control className="panelcontrol textbox" value={qc4Info.roomTemperature} onChange={roomTempTextBoxOnChange} placeholder="" /></td>
              <td className="alignlabel">(&#x2103;)</td>
            </tr>

          </tbody>
        </Table>
      </FlexView>
    </FlexView >
  )
}
)

export default QC4Config;