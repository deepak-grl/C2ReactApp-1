import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { basemodal, mainstore } from '../../modals/BaseModal';
import { PC_NEW_PROJECT_SAVE_BTN } from '../../Constants/tooltip';
import * as Constants from '../../Constants';
import { observer } from 'mobx-react';
import { PC_NEW_PROJECT_BTN } from '../../Constants/tooltip';
import FlexView from 'react-flexview/lib';

const NewProjectButton = observer(
    class NewProjectButton extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                enableSaveButton: false
            };
        }
        onProjectNameInputChange = (event) => {
            mainstore.productCapsProjectName = event.target.value
            this.setState({ enableSaveButton: true })
        }

        saveProjectname() {
            basemodal.putProjectFolderName();
            this.setState({ enableSaveButton: false })
        }

        handleKeyPress = (target) => {
            if (target.charCode == 13) {
                this.saveProjectname();
            }
        }
        render() {
            var enableBorder = " ";
            if (this.state.enableSaveButton) {
                enableBorder = " project-name-border-color"
            }
            return (
                <FlexView className="project-input-field">
                    <span className="project-name-label">Project Name </span>
                    <input type="text" className={"project-name-input" + enableBorder} id="pcNewProjectNameInputField" value={mainstore.productCapsProjectName} onKeyPress={this.handleKeyPress} onChange={(e) => this.onProjectNameInputChange(e)} />
                    {this.state.enableSaveButton ?
                        <OverlayTrigger placement="auto" overlay={<Tooltip> {PC_NEW_PROJECT_SAVE_BTN} </Tooltip>}>
                            <Button className="grl-button btn-primary project-name-save-btn" id="pcNewProjectNameSaveBtn" onClick={() => this.saveProjectname()}>Save</Button>
                        </OverlayTrigger> : null}
                </FlexView>
            );
        }
    })
export default NewProjectButton;