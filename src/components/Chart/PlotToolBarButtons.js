import React from 'react'
import * as Constants from '../../Constants';
import { chartstore } from '../../modals/ChartStoreModal';
import { Button } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class PlotToolBarButtons extends React.Component {

    render() {
        var offlineMode = (chartstore.AppState === Constants.READY) ? false : true;
        let disableToolBarButton;
        if (offlineMode === true) {
            disableToolBarButton = 'disabledbutton ';
        }
        else {
            disableToolBarButton = '';
        }
        var toolbarBtnDiv = ["toolbar_btn_div", disableToolBarButton].join(' ');
        return (
            <>
                <div className={toolbarBtnDiv + this.props.separtorClassName}>
                    <OverlayTrigger popperConfig={{ modifiers: { preventOverflow: { enabled: false } } }} placement="auto" overlay={<Tooltip>{this.props.tooltip}</Tooltip>}>
                        <Button id={this.props.buttonId} className="plot-toolbar-btn" disabled={offlineMode}>
                            <img src={this.props.img} alt={this.props.alt} className={"plot-toolbar-img " + this.props.className} onClick={this.props.clickHandler} />
                        </Button>
                    </OverlayTrigger>
                </div>
            </>
        );
    }
}
export default PlotToolBarButtons;