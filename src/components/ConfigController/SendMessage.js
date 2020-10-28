import React, { Component } from "react";
import { Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import * as Constants from '../../Constants';
import { mainstore, basemodal } from '../../modals/BaseModal';
import { CO_SEND_BTN } from '../../Constants/tooltip';
import { ClipLoader } from 'react-spinners';
import { observe } from "mobx";
import { observer } from "mobx-react";

let sendConfigStatusDescription = ""
const SendMessage = observer(
    class SendMessage extends Component {
        constructor(props) {
            super(props);
            this.state = {
                SopTypes: mainstore.controllerCapability.port1.sopType,
                loading: false,

                MessageTypes: mainstore.controllerCapability.port1.messageType,
                //loading: false,

                messageArr: ['VDM Enter Mode Initiator', 'VDM Mode Initiator', 'VDM Exit Mode Initiator'],
                isSvidDisabled: true,

                value: "FF01",
                render: false,
            };
            var me = this;
            const disposer = observe(mainstore.configControl.sendMessage, "svid", (change) => {
                me.setState({ render: !this.state.render });
            });
        }


        componentDidMount() {
            var sopType = Constants.SOP_TYPES[mainstore.configControl.sendMessage.sopType];
            var messageType = Constants.MESSAGE_TYPES[mainstore.configControl.sendMessage.messageType];
            var svid = mainstore.configControl.sendMessage.svid;
            this.setState({ SopTypes: sopType, MessageTypes: messageType, value: svid });
        }


        dropDownOnChangeMessage(data, index, eventKey) {
            this.setState({ MessageTypes: eventKey })
            if (this.props.portnumber === Constants.PORTA) {
                mainstore.controllerCapability.messageType = eventKey;
            }
            else {
                mainstore.controllerCapability.messageType = eventKey;
            }


            if (this.state.messageArr.includes(data)) {
                this.setState({ isSvidDisabled: false });
            } else {
                this.setState({ isSvidDisabled: true });
            }
            mainstore.configControl.sendMessage.messageType = index;
        }

        dropDownOnChangeSop(index, eventKey) {
            this.setState({ SopTypes: eventKey })
            if (this.props.portnumber === Constants.PORTA) {
                mainstore.controllerCapability.sopType = eventKey;
            }
            else {
                mainstore.controllerCapability.sopType = eventKey;
            }
            mainstore.configControl.sendMessage.sopType = index;
        }

        handleChange(e) {
            this.setState({ [e.target.name]: e.target.value.replace(/[^A-Fa-f0-9]/gi, "") })
            // const binarytohex = ([e.target.name]);
            mainstore.configControl.sendMessage.svid = e.target.value.replace(/[^A-Fa-f0-9]/gi, "");
        }

        listenScrollEvent(e) {
            e.stopPropagation();
        }
        getdeviceinfo() {
            basemodal.putConfigSendMessage(this.doneSendConfigurations.bind(this));
        }

        doneSendConfigurations = () => {
            setTimeout(() => {
                this.setState({ loading: false })
                sendConfigStatusDescription = ""
            }, 3000);
        }


        render() {

            return (
                <>
                    <FlexView className="panel-padding config-controller-width send-message-container" column>
                        <p className="panelHeading">Send Message</p>
                        <div className="panel-div">
                            <span className="configure-label-padding">Sop Type
                        <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom sop-type" variant="success" id="opConfigControllerSendMessageSopTypeComboBox" >{this.state.SopTypes}</Dropdown.Toggle>
                                    <Dropdown.Menu className="config-dropdown-menu">
                                        {
                                            Constants.SOP_TYPES.map((data, index) => {
                                                return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.dropDownOnChangeSop.bind(this, index)}>{data}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </span>

                            <span className="configure-label-padding">Message Type
                        <Dropdown className="config-control-dropdown-flex">
                                    <Dropdown.Toggle className="dropdowncustom message-type" variant="success" id="opConfigControllerSendMessageMessageTypeComboBox">{this.state.MessageTypes}</Dropdown.Toggle>
                                    <Dropdown.Menu className="force-scroll config-dropdown-menu" onWheel={(e) => this.listenScrollEvent(e)}>
                                        {
                                            Constants.MESSAGE_TYPES.map((data, index) => {
                                                return <Dropdown.Item key={index} eventKey={data} value={data} onSelect={this.dropDownOnChangeMessage.bind(this, data, index)}>{data}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown >
                            </span>

                            {this.state.render ? null : null}
                            <label className="svid-align">SVID(0X0000)
                           <span className="svid-input-span-text-align">0X
                            </span>
                                <input type="text" id="opConfigControllerSendMessageSvidInputField" className="svid-input" name='value' maxLength={4} value={mainstore.configControl.sendMessage.svid} onChange={(e) => this.handleChange(e)}
                                    disabled={this.state.isSvidDisabled} />
                            </label>


                        </div>


                        <FlexView>
                            <OverlayTrigger placement="top" overlay={<Tooltip> {CO_SEND_BTN} </Tooltip>}>
                                <Button id="opConfigControllerSendMessageSendBtn" disabled={mainstore.isTesterStatusNotConnected} className="grl-button config-send-button" onClick={this.getdeviceinfo.bind(this)}>Send</Button>
                            </OverlayTrigger>
                            <div className="cliploader-div">
                                <ClipLoader
                                    sizeUnit={"px"}
                                    size={35}
                                    color={'#123abc'}
                                    loading={this.state.loading}
                                />
                            </div>
                        </FlexView>
                        <FlexView className="configure-apply-button">
                            <p className="firmware-spinner-status">{sendConfigStatusDescription}</p>
                        </FlexView>
                    </FlexView>
                </>
            );
        }
    })

export default SendMessage;