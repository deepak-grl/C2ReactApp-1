import React from 'react';
import FlexView from 'react-flexview/lib';
import { Table } from 'react-bootstrap';

const LicenseInfo = (props) => {
  if (props.licenses) {
    return (
      <FlexView className="mobile-align-items align-license-info" style={{ flexFlow: 'wrap' }}>
        <Table >
          <thead>
            <tr>
              <th className="license-header">Module Name</th>
              <th className="license-header"> License Type</th>
              <th className="license-header">License Period</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="license-right-border">
                {props.licenses.map((license, index) => {
                  return (<FlexView className="vhcenter-items border-license-info-vhcenter-items " key={index}>
                    <div className={"vhcenter-items color-box box-" }>{license["moduleName"]}</div>
                  </FlexView>)
                })}
              </td>
              <td className="license-right-border">
                {props.licenses.map((license, index) => {
                  return (<FlexView className="vhcenter-items border-license-info-vhcenter-items" key={index}>
                    <div className={"vhcenter-items color-box box-" + license["moduleStatus"]}>{license["moduleStatus"]}</div>
                  </FlexView>)
                })}
              </td>
              <td className="license-right-border">
                {props.licenses.map((license, index) => {
                  return (<FlexView className="vhcenter-items border-license-info-vhcenter-items" key={index}>
                    <div className={"vhcenter-items color-box box-" }>{license["remainingDays_TempLicense"] === 0 ? "-" : license["remainingDays_TempLicense"]}</div>
                  </FlexView>)
                })}
              </td>
            </tr>
          </tbody>


        </Table>

      </FlexView>
    )
  }
  return null;
}

export default LicenseInfo;