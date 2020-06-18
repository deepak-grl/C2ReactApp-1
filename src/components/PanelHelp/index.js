import React from 'react'
import ListHelp from './ListHelp.js'
import DocHelp from './DocHelp'
import FlexView from 'react-flexview/lib';
import * as Constants from '../../Constants';

class PanelHelp extends React.Component {
    render() {
        return (
            <FlexView className="mobile-container" style={{ width: '100%', height: Constants.MAX_PANEL_HEIGHT }}>
                <FlexView className="right-border panel-padding mobile-setwidth" style={{ width: Constants.LEFT_PANEL_WIDTH }}>
                    <ListHelp />
                </FlexView>
                <FlexView className="panel-padding doc-helpcontainer">
                    <DocHelp />
                </FlexView>
            </FlexView>
        )
    }
}

export default PanelHelp;