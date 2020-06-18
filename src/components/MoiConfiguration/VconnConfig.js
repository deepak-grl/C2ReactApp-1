import React from 'react';
import FlexView from 'react-flexview/lib';
import { Dropdown, Table } from 'react-bootstrap';
import * as Constants from '../../Constants';
import { mainstore } from '../../modals/BaseModal';
import { observer } from 'mobx-react';

const VconnConfig = observer((props) => {
  let pd2ConfigInfo = mainstore.testConfiguration.pd2Configuration;
  let pd2DeterministicConfigInfo = mainstore.testConfiguration.deterministicConfig;

  // const portTypeDropDownOnChange = (eventKey) => {
  //   pd2ConfigInfo.noiseType = eventKey;
  // }

  const vconnVoltageDropDownOnChange = (eventKey) => {
    pd2DeterministicConfigInfo.vconnVoltage = eventKey
  }
  return (
    <FlexView column style={{ display: props.display}}>
      <p className='panelHeading'>PD2 Deterministic Test Configuration</p>
      <FlexView column>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className="panellabel">Vconn Voltage</td>
                <td className="dropdown-config">
                <Dropdown >
                    <Dropdown.Toggle className= "dropdowncustom" variant="success" id="dropdown-basic">{pd2DeterministicConfigInfo.vconnVoltage}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.DeterministicVconnVoltageLevel.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={vconnVoltageDropDownOnChange} >{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>

          </tbody>
        </Table>
      </FlexView>
    </FlexView>
  )
}
)

export default VconnConfig;