import React from 'react'
import FlexView from 'react-flexview/lib';
import Iframe from 'react-iframe';
import { mainstore } from '../../modals/BaseModal';
import { observer } from 'mobx-react';
import * as Constants from '../../Constants';
import ResultManager from './ResultManager';

const ReportHTML = observer(
class ReportHTML extends React.Component {
        
    render() {
            let Url = Constants.URL_Current_Report + mainstore.currentReportFileName                                
            let uiElement = (
                <p className="report-notificationtext">View report after test execution.</p>
            )
            if (mainstore.currentReportFileName) {
                uiElement = (<Iframe url={Url}
                    width="100%"
                    height="95% !important"
                    id="myId"
                    className="myClassname"
                    display="initial"
                    position="relative" />)
            }

            return (<>
                <FlexView column className="panel-padding resultsmanager-container">
                    <ResultManager />
                    {uiElement}
            </FlexView>
            </>)
    }
    });

export default ReportHTML;