import React, { Component } from "react"
import { Button, Modal } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import Configure from "./Configure";
import SendMessage from "./SendMessage";
import RequestMessage from "./RequestMessage";
import { mainstore } from '../../modals/BaseModal';
import { observer } from "mobx-react";

const ConfigController = observer(
    class ConfigController extends Component {

        handleClose = (eventKey) => {
            mainstore.showConfigPopup = false;
        }

        render() {
            return (
                <>
                    <FlexView className="control">
                        <Configure />
                        <SendMessage />
                        {/* </FlexView>
                        <FlexView column className="control"> */}
                        <RequestMessage />
                    </FlexView>
                    {/* <Button className="grl-button-blue" onClick={this.handleClose}>
                                Close
                            </Button> */}
                </>
            );
        }
    })

export default ConfigController;