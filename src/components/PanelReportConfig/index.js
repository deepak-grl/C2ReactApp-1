import React from 'react';
import ReportHTML from './ReportHTML';
import FlexView from 'react-flexview/lib';
import * as Constants from '../../Constants';

class PanelReportConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            r: "0.00MB"
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        if (e.target.files[0]) {
            this.setState({
                r: Math.ceil((e.target.files[0].size) / 1024) + "MB"
            })
        }
        else {
            this.setState({
                r: "0.00MB"
            })
        }
    }

    render() {
        return (
            <FlexView className="panel-setWidth" style={{height: Constants.MAX_PANEL_HEIGHT }}>
                <FlexView grow className="right-border panel-padding" className="custom-mobile-padding">
                    <ReportHTML/>
                </FlexView>                
            </FlexView>
        )
    }
}

export default PanelReportConfig;