import { observer } from "mobx-react";
import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { basemodal } from "../../modals/BaseModal";

const DpAuxSniffer = observer(class DpAuxSniffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            snifferStarted: false,
        }
    }

    startSniffer = () => {
        this.setState({ snifferStarted: true })
        basemodal.putStartDpAuxSniffer()
    }

    endSniffer = () => {
        this.setState({ snifferStarted: false })
        basemodal.putEndDpAuxSniffer()
    }

    render() {
        var changeStartBtnColor = " "
        if (this.state.snifferStarted === true)
            changeStartBtnColor = "start-sniffer-btn-color"
        else
            changeStartBtnColor = " "

        return (
            <>
                <FlexView className="dp-aux-div">
                    <Button className={"grl-button dp-aux-start-btn " + changeStartBtnColor} onClick={() => this.startSniffer()}>Start</Button>
                    <Button className="grl-button dp-aux-end-btn" onClick={() => this.endSniffer()}>End</Button>
                </FlexView>
            </>
        );
    }
});

export default DpAuxSniffer;