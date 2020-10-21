import React from 'react';
import FlexView from 'react-flexview/lib';
import { Dropdown, Table } from 'react-bootstrap';
import * as Constants from '../../Constants';
import { mainstore } from '../../modals/BaseModal';
import { observer } from 'mobx-react';

const SPTConfig = observer((props) => {
  let dpconfiginfo = mainstore.testConfiguration.dpAltModeConfiguration;

  const portTypeDropDownOnChange = (eventKey) => {
    dpconfiginfo.dpAltModeDeviceType = eventKey;
  }
  const deviceCapsDropDownOnChange = (eventKey) => {
    dpconfiginfo.dpAltModeDeviceCaps = eventKey;
  }

  const sinkTypeDropDownOnChange = (eventKey) => {
    dpconfiginfo.dpAltModeSinkType = eventKey;
  }

  return (
    <FlexView column style={{ display: props.display }}>
      <p className='panelHeading'>DisplayPort Alternate Mode Test Configuration</p>
      <FlexView column>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className="panellabel">DP Device Type</td>
              <td className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="tcDisplayPortDPDeviceTypeComboBox">{dpconfiginfo.dpAltModeDeviceType}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.DPDeviceType.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={portTypeDropDownOnChange} >{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>

            {dpconfiginfo.dpAltModeDeviceType === "DP_Source" ? null :
              <>
                <tr>
                  <td className="panellabel">DP Device Capability</td>
                  <td className="dropdown-config">
                    <Dropdown >
                      <Dropdown.Toggle className="dropdowncustom" variant="success" id="tcDisplayPortDPDeviceCapabilityComboBox" >{dpconfiginfo.dpAltModeDeviceCaps}</Dropdown.Toggle>
                      <Dropdown.Menu>
                        {
                          Constants.DPDeviceCaps.map((uutType, index) => {
                            return <Dropdown.Item key={index} eventKey={uutType} onSelect={deviceCapsDropDownOnChange} >{uutType}</Dropdown.Item>
                          })
                        }
                      </Dropdown.Menu>
                    </Dropdown >
                  </td>
                </tr>

                <tr>
                  <td className="panellabel">DP Sink Type</td>
                  <td className="dropdown-config">
                    <Dropdown >
                      <Dropdown.Toggle className="dropdowncustom" variant="success" id="tcDisplayPortDPSinkTypeComboBox" >{dpconfiginfo.dpAltModeSinkType}</Dropdown.Toggle>
                      <Dropdown.Menu>
                        {
                          Constants.DPAltModeSinkType.map((uutType, index) => {
                            return <Dropdown.Item key={index} eventKey={uutType} onSelect={sinkTypeDropDownOnChange} >{uutType}</Dropdown.Item>
                          })
                        }
                      </Dropdown.Menu>
                    </Dropdown >
                  </td>
                </tr>
              </>
            }

          </tbody>
        </Table>
      </FlexView>
    </FlexView>
  )
}
)

export default SPTConfig;