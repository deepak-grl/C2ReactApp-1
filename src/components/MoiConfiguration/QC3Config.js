import React from 'react';
import FlexView from 'react-flexview/lib';
import { Form, Dropdown, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Constants from '../../Constants';
import { mainstore } from '../../modals/BaseModal';
import { observer } from 'mobx-react';
import { CAR_CHARGER } from '../../Constants/tooltip';

const QC3Config = observer((props) => {
  const qc3Info = mainstore.testConfiguration.qc3Configuration;

  const uutTypeDropDownOnChange = (eventKey) => {
    qc3Info.dutType = eventKey;

    if (qc3Info.dutType === "QC4Plus")
      qc3Info.connectorType = Constants.QC3Connectortype[1]
  }
  const connectorTypeDropDownOnChange = (eventKey) => {
    qc3Info.connectorType = eventKey;
  }
  const connectorTypeCableDropDownOnChange = (eventKey) => {
    qc3Info.connectorTypeCable = eventKey;
  }
  const porttypeDropDownOnChange = (eventKey) => {
    qc3Info.ports = eventKey;
  }
  const irDropTextBoxOnChange = (event) => {
    qc3Info.irDrop = event.target.value.replace(/[^0-9.]/g, "")        //to allow only positive and decimal numbers;
  }
  const ratedCurrent5VTextBoxOnChange = (event) => {
    qc3Info.ratedCurrent5V = event.target.value.replace(/[^0-9.]/g, "")        //to allow only positive and decimal numbers;
  }
  const ratedCurrent9VTextBoxOnChange = (event) => {
    qc3Info.ratedCurrent9V = event.target.value.replace(/[^0-9.]/g, "")        //to allow only positive and decimal numbers;
  }
  const ratedCurrent12VTextBoxOnChange = (event) => {
    qc3Info.ratedCurrent12V = event.target.value.replace(/[^0-9.]/g, "")        //to allow only positive and decimal numbers;
  }
  const ratedCurrent20VTextBoxOnChange = (event) => {
    qc3Info.ratedCurrent20V = event.target.value.replace(/[^0-9.]/g, "")        //to allow only positive and decimal numbers;
  }
  const dutRatedPowerTextBoxOnChange = (event) => {
    qc3Info.dutRatedPower = event.target.value.replace(/[^0-9.]/g, "")        //to allow only positive and decimal numbers;
  }
  const pdsupportedDropDownOnChange = (eventKey) => {
    qc3Info.pdSupported = eventKey;
  }

  const qcDutTypeDropDownOnChange = (eventKey) => {
    qc3Info.qcDUTtype = eventKey;
  }

  const inputsupplyvoltageTextBoxOnChange = (event) => {
    qc3Info.inputSupplyVoltage = event.target.value.replace(/[^0-9.]/g, "")        //to allow only positive and decimal numbers;
  }

  const isTweleveRatedCurrentEnabled = (event) => {
    qc3Info.isUUTSupports20V = event.target.checked;
  }

  return (
    <FlexView column style={{ display: props.display }} >
      <p className='panelHeading'>Quick Charger 3.0 Test Configuration</p>
      <FlexView column>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className="panellabel">QC 2.0/3.0 DUT Type</td>
              <td colSpan="2" className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="dropdown-basic">{qc3Info.dutType}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.QC3DutTypes.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={uutTypeDropDownOnChange}>{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>

            <tr>
              <td className="panellabel">Connector Type</td>
              <td colSpan="2" className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle disabled={qc3Info.dutType === "QC4Plus"} className="dropdowncustom" variant="success" id="dropdown-basic">{qc3Info.dutType === "QC4Plus" ? Constants.QC3Connectortype[1] : qc3Info.connectorType}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.QC3Connectortype.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={connectorTypeDropDownOnChange} >{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>

            <tr>
              <td className="panellabel">Connector Type Cable</td>
              <td colSpan="2" className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="dropdown-basic">{ qc3Info.connectorTypeCable}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.CONNECTOR_TYPE_CABLE.map((cable, index) => {
                        return <Dropdown.Item key={index} eventKey={cable} onSelect={connectorTypeCableDropDownOnChange} >{cable}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>

            {qc3Info.connectorType === Constants.QC3Connectortype[0] ?
              < tr >
                <td className="panellabel"> Cable IR drop</td>
                <td className="panel-input" ><Form.Control className="panelcontrol textbox" onChange={irDropTextBoxOnChange} type="text" value={qc3Info.irDrop} disabled={qc3Info.connectorType === "TypeC_TypeC"} placeholder="" /></td>
                <td className="alignlabel">(ohm)</td>
              </tr>
              : null}

            <tr>
              <td className="panellabel" >5V Max  Current</td>
              <td className="panel-input" ><Form.Control type="text" className="panelcontrol textbox" onChange={ratedCurrent5VTextBoxOnChange} value={qc3Info.ratedCurrent5V} placeholder="" /></td>
              <td className="alignlabel">(A)</td>
            </tr>

            <tr>
              <td className="panellabel">9V Max Current</td>
              <td className="panel-input"><Form.Control type="text" className="panelcontrol textbox" onChange={ratedCurrent9VTextBoxOnChange} value={qc3Info.ratedCurrent9V} placeholder="" /></td>
              <td className="alignlabel">(A)</td>
            </tr>

            <tr>
              <td>
                <p className="panellabel">
                  12V Max Current</p></td>
              <td className="panel-input"><Form.Control type="text" className="panelcontrol textbox" onChange={ratedCurrent12VTextBoxOnChange} value={qc3Info.ratedCurrent12V} placeholder="" /></td>
              <td className="alignlabel">(A)</td>
            </tr>

            <tr>
              <td className="panellabel">  <Form.Check inline onChange={isTweleveRatedCurrentEnabled} type='checkbox' />20V Max Current</td>
              <td className="panel-input"><Form.Control type="text" className="panelcontrol textbox" onChange={ratedCurrent20VTextBoxOnChange} value={qc3Info.ratedCurrent20V} placeholder="" disabled={!qc3Info.isUUTSupports20V} /></td>
              <td className="alignlabel">(A)</td>
            </tr>

            <tr>
              <td className="panellabel">DUT Rated Power</td>
              <td className="panel-input"><Form.Control type="text" className="panelcontrol textbox" onChange={dutRatedPowerTextBoxOnChange} value={qc3Info.dutRatedPower} placeholder="" /></td>
              <td className="alignlabel">(W)</td>
            </tr>

            <tr>
              <td className="panellabel">Ports</td>
              <td colSpan="2" className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="dropdown-basic">{qc3Info.ports}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.NoOfPorts.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={porttypeDropDownOnChange}>{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>

            <tr>
              <td className="panellabel">PD Support</td>
              <td colSpan="2" className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="dropdown-basic">{qc3Info.pdSupported}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.PDSupport.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={pdsupportedDropDownOnChange}>{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>

            <tr>
              <td className="panellabel">QC DUT Type</td>
              <td colSpan="2" className="dropdown-config">
                <Dropdown >
                  <Dropdown.Toggle className="dropdowncustom" variant="success" id="dropdown-basic">{qc3Info.qcDUTtype}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      Constants.QCDutCategory.map((uutType, index) => {
                        return <Dropdown.Item key={index} eventKey={uutType} onSelect={qcDutTypeDropDownOnChange}>{uutType}</Dropdown.Item>
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown >
              </td>
            </tr>
            {qc3Info.qcDUTtype === Constants.QCDutCategory[2] ?   // showing the ISV only in QC3+ test cases
              <tr>
                <td className="panellabel">Input Supply Voltage</td>
                <td className="panel-input"><Form.Control className="panelcontrol textbox" type="text" value={qc3Info.inputSupplyVoltage} onChange={inputsupplyvoltageTextBoxOnChange} placeholder="" /></td>
                <td className="alignlabel">
                  (V)
                  <OverlayTrigger placement="bottom" popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} overlay={<Tooltip className="car-charger-tooltip-inner-content-align">{CAR_CHARGER}</Tooltip>}>
                    <img src="../../images/sleep-info.png" alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
                  </OverlayTrigger>
                </td>
              </tr>
              : null
            }

          </tbody>
        </Table>
      </FlexView>
    </FlexView >
  )
}
)

export default QC3Config;