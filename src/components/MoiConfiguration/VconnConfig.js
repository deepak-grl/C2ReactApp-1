import React from 'react';
import FlexView from 'react-flexview/lib';
import { Dropdown, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Constants from '../../Constants';
import { mainstore } from '../../ViewModel/BaseModal';
import { observer } from 'mobx-react';
import { VCONN_INFO } from '../../Constants/tooltip';

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
    <FlexView column style={{ display: props.display }}>
      <p className='panelHeading'>PD2 Deterministic Test Configuration</p>
      <FlexView column>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className="panellabel">Vconn Voltage</td>
              <td className="dropdown-config vconn-volt-info-div">
                <Dropdown className="vconn-volt-info-img">
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="tcPd2DeterministicVconnVoltageComboBox">{pd2DeterministicConfigInfo.vconnVoltage}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.DeterministicVconnVoltageLevel.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={vconnVoltageDropDownOnChange} >{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
                <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="bottom" overlay={<Tooltip className="usb-functional-moi-tooltip-inner-content-align">{VCONN_INFO}</Tooltip>}>
                  <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
                </OverlayTrigger>
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