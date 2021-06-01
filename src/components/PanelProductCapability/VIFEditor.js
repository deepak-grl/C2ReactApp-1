import React from 'react';
import FlexView from "react-flexview/lib";
import { Table, DropdownButton, Dropdown } from 'react-bootstrap';
import { mainstore, basemodal } from '../../ViewModel/BaseModal';
import { VIFDataModal, VIFRowData } from '../../modals/VIFDataModal';
import * as VIF_ENUMS from '../../Constants/VIF_ENUMS';
import utils from '../../utils';
import { observe } from 'mobx';
import { observer } from 'mobx-react';
import * as Constants from '../../Constants';
import toastNotification from '../../utils/toastNotification'


class VIFRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = { textVal: '*', rowChanged: false }
        this.handleTextChange = this.handleTextChange.bind(this);
    }
    handleTextChange(event) {

        var val = event.target.value;
        var isChangeHappened = this.props.vIFRowData.fileElement.setVIFElementDecodedValue(val);
        var rowchangedVal = (isChangeHappened) ? true : false;

        //if(minmaxvalid)
        this.setState({ textVal: val, rowChanged: rowchangedVal });
        this.props.vIFEditor.updateVIFDataInUI();

    }

    showToastMessage = () => {
        if (mainstore.vifEditorEditable === true) {
            if (mainstore.productCapabilityProps.executionMode !== "ComplianceMode") {
                if (mainstore.editVifValuesNotification) {
                    mainstore.editVifValuesNotification.checkForDuplicates("Enable Edit VIF ")
                }
                else {
                    mainstore.editVifValuesNotification = new toastNotification("Enable Edit VIF ", Constants.TOAST_WARN, 3000);
                    mainstore.editVifValuesNotification.show();
                }
            }
            else {
                if (mainstore.editVifValuesNotification) {
                    mainstore.editVifValuesNotification.checkForDuplicates("VIF can't be edited in compliance mode")
                }
                else {
                    mainstore.editVifValuesNotification = new toastNotification("VIF can't be edited in compliance mode", Constants.TOAST_WARN, 3000);
                    mainstore.editVifValuesNotification.show();
                }
            }
        }
    }

    createFileComponent(fileElement, index) {
        if (fileElement.isIgnore()) { return null; }
        let textStyle = "";
        let invalidDecodedValueStyle = "";
        //let textStyle = (fileElement.isInValidValue()) ? "invalid-style" : "";
        //let invalidDecodedValueStyle = (fileElement.decodedValueValidation()) ? "invalid-decoded-value-style" : "";

        var disableVifTextBox = '';
        var disableVifComboBox = '';
        if (mainstore.vifEditorEditable) {
            disableVifTextBox = 'disable-inputfield';
            disableVifComboBox = 'disable-dropdownfield'
        }
        else {
            disableVifTextBox = '';
            disableVifComboBox = '';
        }

        var me = this;
        if (fileElement.isDropDown()) {
            var listitems = fileElement.comboBoxEntries();
            var fileStrigify = "";//JSON.stringify(fileElement);
            var ddb = <DropdownButton id={disableVifComboBox} key={"ddb-" + index} title={fileElement.getTextValueForDropDown()} onClick={(e) => { this.showToastMessage(e) }} className={textStyle} >
                {listitems.map((valItem, index) => {
                    if (!valItem.includes("Unused")) {   //*Not displaying the dropdown menu option called "Unused" in UI 
                        //return <Dropdown.Item key={index + valItem} eventKey={JSON.stringify(fileElement)} onSelect={this.vifDropDownSelect}>{valItem}</Dropdown.Item>
                        return <Dropdown.Item key={index + valItem} className={disableVifComboBox + "index"}
                            eventKey={fileStrigify}
                            onSelect={function () {
                                //fileItem.setCurrentValue(index);
                                fileElement.setSelectedIndex(index);
                                me.props.vIFEditor.updateVIFDataInUI();
                            }}
                        > {valItem} </Dropdown.Item>
                    }
                })
                }
            </DropdownButton>;
            return ddb;
        }
        else {
            const showFileElementTextBoxUnits = fileElement.getUnitsForTextBox()

            return <div className="split-inputBox">
                < input title={mainstore.toolTipForVifEditor} type="text" name="name" onClick={(e) => { this.showToastMessage(e) }} readOnly={mainstore.vifEditorEditable} className={disableVifTextBox + textStyle + " " + invalidDecodedValueStyle} value={fileElement.getVIFElementValueForTextBox()} onChange={this.handleTextChange} />
                {showFileElementTextBoxUnits ? (
                    <span className="vif-textboxunits">{fileElement.getUnitsForTextBox()}</span>) : null
                }
            </div>
        }
    }

    createDeviceComponent(deviceItem) {
        var typeOfEle = basemodal.metaData.getElementValue(deviceItem.elementName, Constants.VIF_ELEMENT_TYPE);
        var displayVal = "";
        var deviceElementUnits = "";
        if (deviceItem.ignore)
            return null;

        displayVal = deviceItem.getVIFElementValueForTextBox();
        if (deviceItem.json) {
            if (typeOfEle === 2) {
                var comboBoxEntriesForCurrentEle = basemodal.metaData.getElementValue(deviceItem.elementName, Constants.VIF_METADATA_COMBOBOXENTRY);
                if (!isNaN(displayVal))
                    var displayVal = comboBoxEntriesForCurrentEle[parseInt(displayVal)];
            }
        }

        if (displayVal)
            deviceElementUnits = deviceItem.getUnitsForTextBox();

        return <div>{displayVal} {deviceElementUnits} </div>
    }

    render() {
        var misMatchedValClass = (this.props.vIFRowData.isValueMisMatched()) ? "vifrow-changed" : "";
        //var rowClass = (this.state.rowChanged) ? 'vifrow-changed' : '';
        var p = this.props;
        //p.vIFRowData.printlog();
        var rowName = utils.replaceAll(p.vIFRowData.getElementName(), "_", " ");
        return (<tr key={p.categoryName + p.index} className={misMatchedValClass}>
            <td>{rowName}</td>
            <td className="panel-input">{this.createFileComponent(p.vIFRowData.fileElement, p.index)}</td>
            {mainstore.productCapabilityProps.executionMode !== "ComplianceMode" ?
                <td className="panel-input">{this.createDeviceComponent(p.vIFRowData.deviceElement, p.index)}</td> : null}
        </tr>);
    }
}

class VIFEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vifDataChanged: 1,
            vifEditable: true,
            vifModified: 1,

            isVifExpanded: true,
            isComponentExpanded: true,
            isCategoryExpanded: true,

            isVifRowDataEmpty: false
        };
        var me = this;
        const vifobser = observe(mainstore, "vifEditorDataUpdated", (change) => {
            me.updateVIFDataInUI();
        });
        const vifobseredit = observe(mainstore, "vifEditorEditable", (change) => {
            me.setState({
                vifEditable: !me.vifEditable
            });
        });
        const vifMisMatch = observe(mainstore, "filePdPortTypeValue", (change) => {
            me.vifFieldsMisMatchToast()
        });
        const deviceMisMatch = observe(mainstore, "devicePdPortTypeValue", (change) => {
            me.vifFieldsMisMatchToast()
        });
    }

    vifFieldsMisMatchToast() {
        var showPdPortTypeMisMatchToast = null;
        if (mainstore.filePdPortTypeValue !== null && mainstore.devicePdPortTypeValue !== null){
            if (mainstore.filePdPortTypeValue !== mainstore.devicePdPortTypeValue) {
                showPdPortTypeMisMatchToast = new toastNotification(`"PD_Port_Type" value in the loaded VIF doesn't match with Device data`, Constants.TOAST_ERROR, 5000);
                showPdPortTypeMisMatchToast.show();
                mainstore.devicePdPortTypeValue = null;
                mainstore.filePdPortTypeValue = null
            }
        }
    }

  
   


    renderVifEditor() {
        var dm = basemodal.vifDataModal;
        var res = [];
        if (dm.initialized) {
            var comps = dm.getCurrentPort(mainstore.currentPortIndex).vif.getComponents();
            res.push(this.renderVif(dm.getCurrentPort(mainstore.currentPortIndex).vif));
            comps.forEach((eachComp, index) => {
                res.push(this.renderPort(eachComp, index));
                if (eachComp.UI_isPortExpanded) {
                    res.push(this.renderComponent(eachComp, index));
                    if (eachComp.getSrcPdoList().fileJson && eachComp.getSrcPdoList().fileJson.SrcPDO && eachComp.getSrcPdoList().fileJson.SrcPDO.length > 0) {
                        res.push(this.renderCategoryList(eachComp.getSrcPdoList()));
                    }
                    else if (eachComp.getSrcPdoList().deviceJson && eachComp.getSrcPdoList().deviceJson.SrcPDO && eachComp.getSrcPdoList().deviceJson.SrcPDO.length > 0) {
                        res.push(this.renderCategoryList(eachComp.getSrcPdoList()));
                    }
                    if (eachComp.getSnkPdoList().fileJson && eachComp.getSnkPdoList().fileJson.SnkPDO && eachComp.getSnkPdoList().fileJson.SnkPDO.length > 0) {
                        res.push(this.renderCategoryList(eachComp.getSnkPdoList()));
                    }
                    else if (eachComp.getSnkPdoList().deviceJson && eachComp.getSnkPdoList().deviceJson.SnkPDO && eachComp.getSnkPdoList().deviceJson.SnkPDO.length > 0) {
                        res.push(this.renderCategoryList(eachComp.getSnkPdoList()));
                    }
                    if (eachComp.getCableSVIDList().fileJson && eachComp.getCableSVIDList().fileJson.CableSVID && eachComp.getCableSVIDList().fileJson.CableSVID.length > 0) {
                        res.push(this.renderCategoryList(eachComp.getCableSVIDList()));
                    }
                    else if (eachComp.getCableSVIDList().deviceJson && eachComp.getCableSVIDList().deviceJson.CableSVID && eachComp.getCableSVIDList().deviceJson.CableSVID.length > 0) {
                        res.push(this.renderCategoryList(eachComp.getCableSVIDList()));
                    }
                    if (eachComp.getSOPSVIDList().fileJson && eachComp.getSOPSVIDList().fileJson.SOPSVID && eachComp.getSOPSVIDList().fileJson.SOPSVID.length > 0) {
                        res.push(this.renderCategoryList(eachComp.getSOPSVIDList()));
                    }
                    else if (eachComp.getSOPSVIDList().deviceJson && eachComp.getSOPSVIDList().deviceJson.SOPSVID && eachComp.getSOPSVIDList().deviceJson.SOPSVID.length > 0) {
                        res.push(this.renderCategoryList(eachComp.getSOPSVIDList()));
                    }
                }
            });
        }
        if (res.length > 0)
            mainstore.isVifXmlLoaded = true
        else
            mainstore.isVifXmlLoaded = false
        return res;


    }
    updateVIFDataInUI() {
        this.setState({
            vifDataChanged: this.state.vifDataChanged + 1
        });
    }
    renderVif(vif) {
        var title = <tr key={"tr-title"} >
            <td className="vifeditor-heade-row" onClick={() => { this.setState({ isVifExpanded: !this.state.isVifExpanded }) }}>{this.state.isVifExpanded ? <i className="fa fa-fw fa-chevron-down  align-vif-table-toggle-icons"></i> : <i className="fa fa-fw fa-chevron-right align-vif-table-toggle-icons"></i>}{vif.displayName}</td>
            <td></td>
            {mainstore.productCapabilityProps.executionMode !== "ComplianceMode" ?
                < td ></td> : null
            }
        </tr>;

        var items = [title];
        vif.getAllRowDatas().forEach((vIFRowData, index) => {
            var vifRow = <VIFRow key={index}
                categoryName="VIF"
                index={index}
                vIFRowData={vIFRowData}
                vIFEditor={this}
                editable={this.state.vifEditable}
            ></VIFRow>
            if (this.state.isVifExpanded) {
                if (vifRow) {
                    if (basemodal.metaData.getElement(vIFRowData.elementName) !== null)
                        items.push(vifRow);
                }
            }
        });
        return items;
    }
    renderPort(vifComp) {
        let items = [];
        let portLabelElement = vifComp.getElementByName(VIF_ENUMS.Port_Label);
        let portLabelElementVal = (portLabelElement && portLabelElement.elementName !== undefined) ? portLabelElement.getVIFElementValueForTextBox() : '';
        items.push(<tr><td className="vifeditor-heade-row"
            onClick={() => { vifComp.UI_isPortExpanded = !vifComp.UI_isPortExpanded; basemodal.vifDataModal.vifDataModified(); }}>
            {vifComp.UI_isPortExpanded ? <i className="fa fa-fw fa-chevron-down align-vif-table-toggle-icons"></i> : <i className="fa fa-fw fa-chevron-right align-vif-table-toggle-icons"></i>}
            {"Port Label" + " [" + portLabelElementVal + "]"} </td>
            <td></td>
            {mainstore.productCapabilityProps.executionMode !== "ComplianceMode" ?
                < td ></td> : null
            }
        </tr>);
        return items;
    }
    renderComponent(vifComp, index) {
        var title = <tr key={vifComp.title + "tr"} >
            <td className="vifeditor-heade-row vifeditor-heade-row-child" onClick={() => {
                vifComp.UI_isComponentExpanded = !vifComp.UI_isComponentExpanded; basemodal.vifDataModal.vifDataModified();
            }
            }>{vifComp.UI_isComponentExpanded ? <i className="fa fa-fw fa-chevron-down align-vif-table-toggle-icons"></i> : <i className="fa fa-fw fa-chevron-right align-vif-table-toggle-icons"></i>}{vifComp.displayName}</td>
            <td></td>
            {mainstore.productCapabilityProps.executionMode !== "ComplianceMode" ?
                < td ></td> : null
            }
        </tr>;

        var items = [];

        items.push(title);
        vifComp.getAllRowDatas().forEach((vIFRowData, index) => {
            var vifRow = <VIFRow key={index}
                categoryName="Component"
                index={index}
                vIFRowData={vIFRowData}
                vIFEditor={this}
            ></VIFRow>
            if (vifComp.UI_isComponentExpanded) {
                if (basemodal.metaData.getElement(vIFRowData.elementName) !== null)
                    items.push(vifRow);
            }
        });

        return items;
    }
    renderCategoryList(categoryList) {
        var res = [];
        var title = <tr key={categoryList.categoryType + "tr"} >
            <td className="vifeditor-heade-row vifeditor-heade-row-child" onClick={() => {
                categoryList.UI_isCategoryListExpanded = !categoryList.UI_isCategoryListExpanded;
                basemodal.vifDataModal.vifDataModified();
            }}>{!categoryList.UI_isCategoryListExpanded ? <i className="fa fa-fw fa-chevron-down align-vif-table-toggle-icons"></i> : <i className="fa fa-fw fa-chevron-right align-vif-table-toggle-icons"></i>} {categoryList.displayName}</td>
            <td></td>
            {mainstore.productCapabilityProps.executionMode !== "ComplianceMode" ?
                < td ></td> : null
            }
        </tr>;

        res.push(title);
        categoryList.getCategoryListSpecificRowDatas().forEach((vIFRowData, index) => {
            var vifRow = <VIFRow key={index}
                categoryName={categoryList.name}
                index={index}
                vIFRowData={vIFRowData}
                vIFEditor={this}
            ></VIFRow>
            if (!categoryList.UI_isCategoryListExpanded) {
                if (basemodal.metaData.getElement(vIFRowData.elementName) !== null)
                    res.push(vifRow);
            }
        });
        var me = this;
        var categoryArray = categoryList.getCategoriesArray();
        if (categoryArray)
            categoryArray.forEach(category => {
                if (!categoryList.UI_isCategoryListExpanded) {
                    res.push(me.renderCategory(category));
                }
            });

        return res;
    }

    renderCategory(category) {
        var title = <tr key={category.categoryType + "tr"} >
            <td className="vifeditor-heade-row vifeditor-heade-row-child category-padding" onClick={() => { this.setState({ isCategoryExpanded: !this.state.isCategoryExpanded }) }}>{category.displayName}</td>
            <td></td>
            {mainstore.productCapabilityProps.executionMode !== "ComplianceMode" ?
                < td ></td> : null
            }
        </tr>;
        var items = [title];

        category.getAllRowDatas().forEach((vIFRowData, index) => {
            var vifRow = <VIFRow key={index}
                categoryName={category.name}
                index={index}
                vIFRowData={vIFRowData}
                vIFEditor={this}
            ></VIFRow>
            if (basemodal.metaData.getElement(vIFRowData.elementName) !== null)
                items.push(vifRow);

        });
        // render mode categoryList's
        this.renderModeCategoryList(category.getModeCategoryList(), items);
        return items;
    }

    renderModeCategoryList(categoryList, items) {
        if (!categoryList) {
            return;
        }
        var title = <tr key={categoryList.categoryType + "tr"} className="vifeditor-heade-row-modes">
            <td>{categoryList.categoryType + "List"}</td>
            <td></td>
            {mainstore.productCapabilityProps.executionMode !== "ComplianceMode" ?
                < td ></td> : null
            }
        </tr>;
        items.push(title);
        categoryList.getCategoryListSpecificRowDatas().forEach((vIFRowData, index) => {
            var vifRow = <VIFRow key={index}
                categoryName={categoryList.name}
                index={index}
                vIFRowData={vIFRowData}
                vIFEditor={this}
            ></VIFRow>
            if (basemodal.metaData.getElement(vIFRowData.elementName) !== null)
                items.push(vifRow);
        });
        var me = this;
        var categoryArray = categoryList.getCategoriesArray();
        if (categoryArray)
            categoryArray.forEach(category => {
                items.push(me.renderCategory(category));
            });
        //return items;
    }

    render() {
        return (
            <FlexView onWheel={(e) => utils.listenScrollEvent(e)} className="product-capability-panel scroll">
                <Table id="vif-table" className="vendor-table table-sticky" striped bordered condensed='true' size='sm' hover>
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>VIF Data</th>
                            {mainstore.productCapabilityProps.executionMode !== "ComplianceMode" ?
                                <th>Device Data</th>
                                : null}
                        </tr>
                    </thead>
                    <tbody id='vif-edit-table' key="vif_tbody">
                        {
                            this.renderVifEditor()
                        }
                    </tbody>
                </Table>
            </FlexView>
        );
    }
}

export default VIFEditor;