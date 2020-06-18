import React from 'react';
import FlexView from 'react-flexview/lib';
import { Dropdown, Table } from 'react-bootstrap';
import * as Constants from '../../Constants';
import { mainstore } from '../../modals/BaseModal';
import { observer } from 'mobx-react';


const PD2CommunicationConfig = observer((props) => {
  let pd2ConfigInfo = mainstore.testConfiguration.pd2Configuration;
  let dutType = mainstore.productCapabilityProps.ports[Constants.PORTA].dutType;

  const portTypeDropDownOnChange = (eventKey) => {
    pd2ConfigInfo.noiseType = eventKey;
  }
  const vconnVoltageDropDownOnChange = (eventKey) => {
    pd2ConfigInfo.vconnVoltage_CE = eventKey
  }

  var vconnVoltage = dutType === Constants.USBPDDeviceType[5] ? (<tr>
    <td className="panellabel">Vconn Voltage</td>
    <td className="dropdown-config">
      <Dropdown >
        <Dropdown.Toggle className="dropdowncustom" variant="success" id="dropdown-basic">{pd2ConfigInfo.vconnVoltage_CE}</Dropdown.Toggle>
        <Dropdown.Menu>
          {
            Constants.CommunicationEngineVconnVoltageLevel.map((uutType, index) => {
              return <Dropdown.Item key={index} eventKey={uutType} onSelect={vconnVoltageDropDownOnChange} >{uutType}</Dropdown.Item>
            })
          }
        </Dropdown.Menu>
      </Dropdown >
    </td>
  </tr>) : null

  if (mainstore.productCapabilityProps.executionMode === "ComplianceMode") {
    var disableNoiseTypeInCompliance;
    disableNoiseTypeInCompliance = Constants.PD2Noise.indexOf("Square Wave Noise")
    if (disableNoiseTypeInCompliance > -1) {
      Constants.PD2Noise.splice(disableNoiseTypeInCompliance, 1)
    }
    else {
      if (!Constants.PD2Noise.includes("Square Wave Noise"))
        Constants.PD2Noise.push("Square Wave Noise")
    }
  }

  return (
    <FlexView column style={{ display: props.display }}>
      <p className='panelHeading'>PD2 Communication Engine Test Configuration</p>
      <FlexView column>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className="panellabel">Noise Type</td>
              <td className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="dropdown-basic">{pd2ConfigInfo.noiseType}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.PD2Noise.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={portTypeDropDownOnChange} >{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>
            {vconnVoltage}
          </tbody>
        </Table>
      </FlexView>
    </FlexView>
  )
}
)

export default PD2CommunicationConfig;