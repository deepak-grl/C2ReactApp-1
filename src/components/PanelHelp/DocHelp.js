import React from 'react'
import FlexView from 'react-flexview/lib';
import * as Constants from '../../Constants';
import { mainstore } from '../../modals/BaseModal';
import utils from '../../utils';

class DocHelp extends React.Component {   
    render() {
        return (
            <FlexView column className="panel-padding">
                <div onWheel={(e) => utils.listenScrollEvent(e)} className="scroll">
                <div className="help-container">
                    <img className="grl" src="./favicon.ico" alt="GRL" /><br />
                    <h2>GRL USB PD C2</h2>
                    <p>App Version : {mainstore.softwareVersion}</p>
                </div>

                <FlexView column className="help-container">
                    <strong><em>GRL-USB-PD-C2: The only instrument you need for USB Type-C Power Delivery and Alt Mode compliance testing.</em></strong>
                    <h2>Overview</h2>
                    <ul>
                        <li>Fully integrated - does the work of 5 instruments in one platform</li>
                        <li>Supports all USB Type-C Power Delivery 3.0 and 2.0 Compliance Tests</li>
                        <li>Two fully independent ports - Source/Sink up to 200W</li>
                        <li>Supports PHY test automation for DisplayPort and Thunderbolt 3 Alt Modes</li>
                        <li>Integrates Qualcomm Quick Charge 4+ and Thunderbolt 3-specific test items</li>
                    </ul>
                    <h2>Description</h2>
                    <strong>GRL-USB-PD-C2 (GRL-C2) is the only solution available that supports all compliance test
                        specifications for USB Power Delivery 3.0 and USB Type-C Alternate Mode designs, 
                        and enables product developers to quickly run full compliance and validation test suites at the push of a button.
                    </strong>
                    <p className="help-description">
                        GRL-C2 provides an automated, efficient, and fully-integrated way perform all required USB Power Delivery version 3.0 and 2.0
                        and related tests over the USB Type-C connector, as well as PHY test automation for USB Type-C Alternate Modes.
                        GRL-C2 automates all required USB PD compliance tests for power providers (chargers), consumers, dual-role ports, and cable
                        and adapter E-Markers; and is the only solution available that integrates Qualcomm Quick Charge 4+ and 
                        Intel Thunderbolt-specific test items. GRL-C2 also incorporates analyzer capability to sniff PD traffic.
                        GRL-C2 integrates all required USB PD tests into a single 2-port tester, including all tests supported on GRL’s USB-IF 
                        approved first generation solution introduced in 2015. Each port can be configured independently as a PD Provider or Consumer.
                        All other PD Protocol and Power tests are fully integrated, removing the need for external electronic loads.
                    </p>                   
                </FlexView>
                </div>
            </FlexView>
        )
    }
}

export default DocHelp;