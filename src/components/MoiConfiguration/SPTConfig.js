import React from 'react';
import FlexView from 'react-flexview/lib';
import { Dropdown, Table } from 'react-bootstrap';
import * as Constants from '../../Constants';
import { mainstore } from '../../ViewModel/BaseModal';
import { observer } from 'mobx-react';

const SPTConfig = observer((props) => {
  let sptconfiginfo = mainstore.testConfiguration.sptConfiguration;

  const portTypeDropDownOnChange = (eventKey) => {
    sptconfiginfo.portType = eventKey;
  }

  return (
    <FlexView column style={{ display: props.display }}>
      <p className='panelHeading'>Source Power Test Configuration</p>
      <FlexView column>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className="panellabel">Port Type</td>
              <td className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="tcSorcePowerPortTypeComboBox">{sptconfiginfo.portType}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.NoOfPorts.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={portTypeDropDownOnChange} >{uutType}</Dropdown.Item>
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

export default SPTConfig;