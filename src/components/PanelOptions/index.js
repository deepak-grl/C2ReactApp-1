import React from 'react'
import PortTesting from '../5PortTesting'
import IrDropCalibration from '../IrDropCalibration'
import ConfigController from '../ConfigController'
import FlexView from 'react-flexview/lib'
import { Tab, Tabs } from 'react-bootstrap';
import DpAuxSniffer from '../DpAuxSniffer'

class PanelOptions extends React.Component {

    render() {
        return (
            <>
                <FlexView className="panel-options-width">
                    <Tabs defaultActiveKey="0" className="options-tab-pane options-panel-heading">
                        <Tab eventKey="0" title="Five Port Testing" className="five-port-tab-pane-align">
                            <PortTesting />
                        </Tab>
                        <Tab eventKey="1" title="Config Controller" className="config-control-tab-pane">
                            <ConfigController />
                        </Tab>
                        <Tab eventKey="2" title="Cable IR Drop Calibration" className="ir-drop-tab-pane">
                            <IrDropCalibration />
                        </Tab>
                        {/* <Tab eventKey="3" title="DP AUX Sniffer" className="dp-aux-tab-pane">
                            <DpAuxSniffer />
                        </Tab> */}
                    </Tabs>
                </FlexView>
            </>
        )
    }
}

export default PanelOptions;