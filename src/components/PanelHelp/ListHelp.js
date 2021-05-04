import React from 'react';
import { basemodal } from '../../ViewModel/BaseModal';

class ListHelp extends React.Component {

    downloadDebuglogs() {
        basemodal.getDebugLogs();
    }
    render() {
        return (
            <div className="panel-setWidth">
                <div className="panelHeading"><p>Support</p></div>
                <div className="help"><img alt="Website" src='images/website_48px.png' /><a className="help" id="hpGraniteRiverLabsSupportDeskLinkLabel" rel="noopener noreferrer" target="_blank" href="https://graniteriverlabs.freshdesk.com/support/login/">Granite River Labs Support Desk</a></div>
                <div className="help"><img alt='Email' src='images/email_48px.png' /><a className="help" id="hpEmailCustomerSupportLinkLabel" rel="noopener noreferrer" href="mailto:support@graniteriverlabs.com?">Email Customer Support</a></div>
                <div className="help"><img alt='Email' src='images/file-download.png' /><a className="help" id="hpDownloadDebugLogsLinkLabel" rel="noopener noreferrer" href="javascript:void(0);" onClick={this.downloadDebuglogs}>Download Debug Logs</a></div>
                {/* <div className="help"><img alt='User Guide' src='images/infoGuide_48px.png' /><span className="help">C2 Test Solution Software Quick Start Guide</span></div>
                <div className="help"><img alt="API Guide" src='images/api_48px.png' /><span className="help">C2 API Documentation</span></div> */}
            </div>
        )
    }
}

export default ListHelp;
