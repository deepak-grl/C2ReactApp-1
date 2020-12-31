import _ from "lodash";
import { observe } from 'mobx';
import { observer } from 'mobx-react';
import Tree, { TreeNode } from 'rc-tree';
import React from 'react';
import { Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import FlexView from 'react-flexview/lib';
import { Input } from "semantic-ui-react";
import * as Constants from '../../Constants';
import { TC_CLEARFILTERS, TC_FAILEDTESTCASES, TC_INCOMPLETETESTCASE, TC_PASSTESTCASES, TC_WARNINGTESTCASES } from '../../Constants/tooltip';
import '../../css/draggable.css';
import '../../css/rc_tree.css';
import { basemodal, mainstore } from '../../modals/BaseModal';
import utils from '../../utils';
import MoiComponents from '../MoiConfiguration';
import Report from './Report';
import TestExecutionButton from './TestExecutionButton';

let searchedNodes = [];
let orderedTestList = [];
let selectedTestCase = [];
var selectedFilters = []
let selectedMoi = [];
let parentNodes = [];
let selectedTestCaseCount = []
let testCaseListWithoutMoiName = []
let checkTestCaseNameIsNotEmpty = " ";
const PanelTestConfig = observer(
  class PanelTestConfig extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        gData: mainstore.testConfiguration.testList,
        expanded: ['C2 Test Cases'],
        searchString: "",
        selectedCertFilter: Constants.CERTIFICATION_FILTER[0],
        autoExpandParent: true,
        expandedKeys: ['C2 Test Cases'],
        reRender: false,
        checkedKeys: {},
        isMoiDragged: false,
        expandAllTestList: false,
      };
      var me = this;
      const disposer = observe(mainstore.testConfiguration, "selectedCertifiedFilter", (change) => {
        me.setState({ selectedCertFilter: change.newValue });

      });
    }

    //Method to select all child and parent from MOI name
    onSelectItem = (checked, targetNode) => {
      orderedTestList = []   //ordered test list not updating while test list gets updated  , so clearing here and updating the ordered list in getmoiorder method
      this.setState({ reRender: !this.state.reRender, checkedKeys: checked })
      mainstore.testConfiguration.selectedTestList = checked;
      selectedTestCaseCount = checked;
      if (targetNode.checked === false) {
        mainstore.selectedMoiTestCase = [];
        mainstore.selectedMoiTestCase.push(...checked)
        mainstore.selectedMoiTestCase.push(...targetNode.halfCheckedKeys)
      }

      else {
        mainstore.selectedMoiTestCase.push(...checked)
        mainstore.selectedMoiTestCase.push(...targetNode.halfCheckedKeys)
        //Removing the QC_LEGACY Second Parent in the selected test list
        for (var i = 0; i < Constants.QC_LEGACY_PARENT_NAMES.length; i++) {
          if (mainstore.testConfiguration.selectedTestList.includes(Constants.QC_LEGACY_PARENT_NAMES[i])) {
            var removeParentName = mainstore.testConfiguration.selectedTestList.indexOf(Constants.QC_LEGACY_PARENT_NAMES[i]);
            if (removeParentName !== -1)
              mainstore.testConfiguration.selectedTestList.splice(removeParentName, 1)
          }
        }
      }
    }

    createTreeNodes(nodes) {
      let parent = [];
      for (let n of nodes) {
        let children = [];
        if (n.children.length > 0) {
          children = this.createTreeNodes(n.children);
        }
        if (children.length === 0) {
          parent.push(<TreeNode disabled={mainstore.connectionInfo.testerStatus !== "Connected"} className={this.disableQCLegacyTestCases(n.title)} key={n.title} title={n.title} />)
          checkTestCaseNameIsNotEmpty = n.title
        }
        else {
          parent.push(<TreeNode className={n.title} disableCheckbox={mainstore.connectionInfo.testerStatus !== "Connected"} key={n.title} title={n.title}  >{children}</TreeNode>)
          if (!parentNodes.includes(n.title))
            parentNodes.push(n.title)
        }
      }
      this.getMoiOrder(parent, parentNodes);
      this.removeTestCaseParentNameForCount(parentNodes)
      return parent;
    }

    disableQCLegacyTestCases = (testCaseName) => {
      for (var i = 0; i < mainstore.qcLegacyTestCase.length; i++) {
        if (testCaseName === mainstore.qcLegacyTestCase[i])
          return "qc-legacy-test-case "
      }
    }

    removeTestCaseParentNameForCount = (name) => {
      for (let i = 0; i < name.length; i++) {
        if (selectedTestCaseCount.includes(name[i])) {
          let removeMoiName = selectedTestCaseCount.indexOf(name[i]);
          if (removeMoiName !== -1)
            selectedTestCaseCount.splice(removeMoiName, 1)
        }
      }
    }

    //Re-ordering the Moi list order while dragging
    getMoiOrder = (parent, parentName) => {
      for (let n of parent) {
        if (!(orderedTestList.includes(n.key)))
          orderedTestList.push(n.key)
      }
      testCaseListWithoutMoiName = orderedTestList.slice(0);
      for (let i = 0; i < parentName.length; i++) {
        if (testCaseListWithoutMoiName.includes(parentName[i])) {
          let removedTestCaseMoiName = testCaseListWithoutMoiName.indexOf(parentName[i]);
          if (removedTestCaseMoiName !== -1)
            testCaseListWithoutMoiName.splice(removedTestCaseMoiName, 1)
        }
      }
    }

    certFilterDropDownOnChange = eventKey => {
      this.setState({ selectedCertFilter: eventKey })
      mainstore.testConfiguration.selectedCertifiedFilter = eventKey
      basemodal.putCertificationFilter(eventKey, this.updateTestList.bind(this));
      mainstore.selectedMoiTestCase = [];
    }

    updateTestList = () => {
      basemodal.getTestList()
    }

    selectTestCase = (resultsToSelect) => {
      var index, testName;
      var testCaseResultList = mainstore.results.testResultsList;
      if (!(selectedFilters.includes(resultsToSelect)))
        selectedFilters.push(resultsToSelect)
      else {
        var filterIndex = selectedFilters.indexOf(resultsToSelect);
        if (filterIndex !== -1) {
          selectedFilters.splice(filterIndex, 1)
        }
      }
      for (index = 0; index < testCaseResultList.length; index++) {
        var child = testCaseResultList[index].children;
        for (var i = 0; i < child.length; i++) {
          if (child[i].result === resultsToSelect) {
            testName = this.getTestCaseName(child[i].displayString, mainstore.testConfiguration.testList, testCaseResultList[index].displayString)
            if (!(selectedTestCase.includes(child[i].displayString))) {
              selectedTestCase.push(testName);
              selectedMoi.push(testCaseResultList[index].displayString)
            }
            else {
              this.clearSelectedTestCases(testName, testCaseResultList[index].displayString)
            }
          }
          else if (child[i].result !== 'PASS' && child[i].result !== 'WARNING' && child[i].result !== 'INCOMPLETE' && child[i].result !== 'NA' && !resultsToSelect) {
            testName = this.getTestCaseName(child[i].displayString, mainstore.testConfiguration.testList, testCaseResultList[index].displayString)
            if (!(selectedTestCase.includes(child[i].displayString))) {
              selectedTestCase.push(testName);
              selectedMoi.push(testCaseResultList[index].displayString)
            }
            else {
              this.clearSelectedTestCases(testName, testCaseResultList[index].displayString)
            }
          }
        }
      }
      mainstore.selectedMoiTestCase = selectedMoi
      mainstore.testConfiguration.selectedTestList = selectedTestCase
      this.setState({ checkedKeys: mainstore.testConfiguration.selectedTestList })
    }

    clearSelectedTestCases = (testCaseName, testCaseMoiName) => {
      var i = selectedTestCase.indexOf(testCaseName);
      if (i !== -1) {
        selectedTestCase.splice(i, 1);
        selectedMoi.splice(testCaseMoiName)
      }
    }

    getTestCaseName(testResultString, testCaseNameList, testCaseParentName) {
      if (testCaseParentName !== undefined) {
        mainstore.testConfiguration.selectedTestList = [];
        // mainstore.selectedMoiTestCase.push(testCaseParentName)
      }

      var testCaseName = "";
      for (var i = 0; i < testCaseNameList.length; i++) {
        var testCase = testCaseNameList[i]
        if (testResultString.indexOf(testCase.title) === 0) {
          return testCase.title;
        }
        if (testCase.children.length > 0) {
          testCaseName = this.getTestCaseName(testResultString, testCase.children)
          if (testCaseName !== "")

            return testCaseName;
        }
      }
      return testCaseName;
    }

    clearFiltersTestCase() {
      mainstore.testConfiguration.selectedTestList = []
      mainstore.selectedMoiTestCase = [];
      selectedTestCase = []
      selectedMoi = []
      selectedFilters = []
      this.setState({ checkedKeys: mainstore.testConfiguration.selectedTestList, selectedFilters: [] })
    }

    onRepeatInputChange(valueAsNumber) {
      mainstore.testExecutionRepeat = valueAsNumber;
    }

    onDragStart = info => {
      this.setState({ reRender: !this.state.reRender })
    };

    onDragEnter = info => {
    };

    sortMoiOrder = (callback) => {
      var sortingArray = [];
      var result = [];
      for (let n of orderedTestList) {
        if (mainstore.testConfiguration.selectedTestList.includes(n)) {
          if (!(sortingArray.includes(n)))
            sortingArray.push(n)
          result = sortingArray.filter((el) => (mainstore.testConfiguration.selectedTestList.indexOf(el) > -1));
        }
      }
      mainstore.testConfiguration.selectedTestList = result
      callback();
    }

    onDrop = info => {
      const dropKey = info.node.props.eventKey;
      const dragKey = info.dragNode.props.eventKey;
      const dropPos = info.node.props.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

      if (dropPos.length > 2) {
        const loop = (data, key, callback) => {
          data.forEach((item, index, arr) => {
            if (item.key === key) {
              callback(item, index, arr);
              return;
            }
            if (item.children) {
              loop(item.children, key, callback);
            }
          });
        };
        const data = [...searchedNodes];


        // Find dragObject
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
          arr.splice(index, 1);
          dragObj = item;
        });

        if (
          (info.node.props.children || []).length > 0 && // Has children
          info.node.props.expanded && // Is expanded
          dropPosition === 1 // On the bottom gap
        ) {
          loop(data, dropKey, item => {
            item.children = item.children || [];
            item.children.unshift(dragObj);
          });
        } else {
          // Drop on the gap
          let ar;
          let i;
          loop(data, dropKey, (item, index, arr) => {
            ar = arr;
            i = index;
          });
          if (dropPosition === -1) {
            ar.splice(i, 0, dragObj);
          } else {
            ar.splice(i + 1, 0, dragObj);
          }
        }

        this.setState({
          gData: data,
          isMoiDragged: true,
        });
      }
    };

    onExpand = expandedKeys => {
      this.setState({
        expandedKeys,
      });
    };

    expandOrCollapseTestList = () => {
      this.setState({ expandAllTestList: !this.state.expandAllTestList }, () => { this.setExpandedKeysForAllTestCases() })
    }

    setExpandedKeysForAllTestCases = () => {
      if (this.state.expandAllTestList)
        this.setState({ expandedKeys: parentNodes })
      else
        this.setState({ expandedKeys: [] })
    }

    render() {
      searchedNodes = this.state.searchString.trim()
        ? this.keywordFilter(_.cloneDeep(mainstore.testConfiguration.testList), this.state.searchString)
        : mainstore.testConfiguration.testList;
      var loop = this.createTreeNodes(searchedNodes);

      let certFilter = (<>
        {<Dropdown className="dut-port-align cert-filter-dropdown" >
          <Dropdown.Toggle className="dropdowncustom setwidth" variant="success" id="tcCertificationComboBox">{this.state.selectedCertFilter}</Dropdown.Toggle>
          <Dropdown.Menu>
            {
              Constants.CERTIFICATION_FILTER.map((certName, index) => {
                return <Dropdown.Item key={index} eventKey={certName} onSelect={this.certFilterDropDownOnChange}>{certName}</Dropdown.Item>
              })
            }
          </Dropdown.Menu>
        </Dropdown >}

      </ >);

      let disableTestCaseList = ""
      if (mainstore.connectionInfo.testerStatus !== 'Connected' && checkTestCaseNameIsNotEmpty !== "" && loop[0] !== undefined) {
        disableTestCaseList = " disable-test-case-list "
      }
      else {
        disableTestCaseList = " "
      }
      return (
        <>
          <FlexView column className="right-border panel-padding test-selectioncontainer" style={{ height: Constants.MAX_PANEL_HEIGHT, width: Constants.LEFT_PANEL_WIDTH }}>
            <div className="panel-div">
              <p className="panelHeading">Test Selection</p>
              {/* {mainstore.showReRunTestCase ? */}
              <div className="testselection-toolbar">
                <div className="toolbar_btn_div selection-label"> <p> Filter Selection</p></div>
                <div className="toolbar_btn_div" ><OverlayTrigger placement="auto" overlay={<Tooltip> {TC_PASSTESTCASES} </Tooltip>}><Button id="tcFilterSelectionPassBtn" className={"test-selection-toolbar-btn " + (selectedFilters.includes("PASS") ? "pass-filter" : null)}><img src="../../images/pass.png" alt="passed-testCase" className="plot-toolbar-img" onClick={() => this.selectTestCase('PASS')} /></Button></OverlayTrigger></div>
                <div className="toolbar_btn_div" ><OverlayTrigger placement="auto" overlay={<Tooltip> {TC_FAILEDTESTCASES} </Tooltip>}><Button id="tcFilterSelectionFailBtn" className={"test-selection-toolbar-btn " + (selectedFilters.includes(undefined) ? "fail-filter" : null)} ><img src="../../images/fail.png" alt="failed-testCase" className="plot-toolbar-img" onClick={() => this.selectTestCase()} /></Button></OverlayTrigger></div>
                <div className="toolbar_btn_div" ><OverlayTrigger placement="auto" overlay={<Tooltip> {TC_INCOMPLETETESTCASE} </Tooltip>}><Button id="tcFilterSelectionIncompleteBtn" className={"test-selection-toolbar-btn " + (selectedFilters.includes("INCOMPLETE") ? "incomplete-filter" : null)} ><img src="../../images/skip_incomplete.png" alt="incomplete-testCase" className="plot-toolbar-img" onClick={() => this.selectTestCase("INCOMPLETE")} /></Button></OverlayTrigger></div>
                <div className="toolbar_btn_div" ><OverlayTrigger placement="auto" overlay={<Tooltip> {TC_WARNINGTESTCASES} </Tooltip>}><Button id="tcFilterSelectionWarningBtn" className={"test-selection-toolbar-btn " + (selectedFilters.includes("WARNING") ? "warning-filter" : null)}><img src="../../images/warning.png" alt="warning-testCase" className="plot-toolbar-img" onClick={() => this.selectTestCase('WARNING')} /></Button></OverlayTrigger></div>
                <div className="toolbar_btn_div" ><OverlayTrigger placement="auto" overlay={<Tooltip> {TC_CLEARFILTERS} </Tooltip>}><Button id="tcFilterSelectionClearFiltertn" className={"test-selection-toolbar-btn"}><img src="../../images/clear-filters.png" alt="clear-filters" className="plot-toolbar-img" onClick={() => this.clearFiltersTestCase()} /></Button></OverlayTrigger></div>
                {/* <div className="sleep-info-icon-test-config" ><OverlayTrigger placement="bottom" overlay={<Tooltip className="tooltip-inner-content-align">Click the required filter to select all test cases under the particular category</Tooltip>}><img src="../../images/sleep-info.png" alt="info-irdrop" className="info-img-irdrop" /></OverlayTrigger></div> */}
              </div>
              {/* : null} */}
              <div className="testselection-toolbar">
                <FlexView className="align-testconfig-execution-btn">
                  {/* <OverlayTrigger placement="top" overlay={<Tooltip> {TC_REPEAT} </Tooltip>}><p className="repeat-text-align">Repeat: <NumericInput min={1} max={100} value={mainstore.testExecutionRepeat} style={{ width: '10px' }} onChange={this.onRepeatInputChange} /></p></OverlayTrigger> */}
                  <TestExecutionButton sortMoiOrder={this.sortMoiOrder} isMoiDragged={this.state.isMoiDragged} />
                  <div className="sleep-info-icon-test-config" ><OverlayTrigger placement="bottom" overlay={<Tooltip className="tooltip-inner-content-align">Please change PC sleep setting</Tooltip>}><img src="../../images/sleep-info.png" alt="info-irdrop" className="info-img-irdrop" /></OverlayTrigger></div>
                  <div className="new-projectBtn-testConfig-align">
                    {/* <NewProjectButton /> */}
                  </div>
                </FlexView>
              </div>
              <FlexView>
                {certFilter}
                <Input
                  id="tcSearchTestCaseInputField"
                  className='panel-search-input '
                  placeholder=" &#xf002; Search"
                  onChange={(event, data) => {
                    this.onSearchKeywordChange(event, data, searchedNodes);
                  }}
                />
              </FlexView>
              <FlexView>
                <label className="checkbox-label-width expand-test-list-checkbox">
                  <input type="checkbox" id="tcExpandTestListCheckBox" className="functional-moi-checkbox" checked={this.state.expandAllTestList} onChange={(e) => { this.expandOrCollapseTestList(e) }} />Expand Test List
               </label>
                <FlexView className="selected-test-count-div">
                  <span>Selected Tests: <strong>{selectedTestCaseCount.length + "/" + testCaseListWithoutMoiName.length} </strong></span>
                </FlexView>
              </FlexView>
            </div>
            {mainstore.connectionInfo.testerStatus !== 'Connected' ? <div className="test-cases-title">*Please connect to a GRL-C2 to execute the available test cases</div> : null}
            <FlexView column className="c2-treeview-nodes test-selection-treeview-container ">
              <div onWheel={(e) => utils.listenScrollEvent(e)} className={"scroll " + disableTestCaseList}>
                {this.state.reRender ? null : null}      { /* to rerender tree component*/}
                {checkTestCaseNameIsNotEmpty !== "" && loop[0] !== undefined ?     //Not displaying tree while test case title is empty
                  <Tree
                    expandedKeys={this.state.expandedKeys}
                    checkable
                    onCheck={this.onSelectItem}
                    onExpand={this.onExpand}
                    draggable={true}
                    onDragStart={this.onDragStart}
                    onDragEnter={this.onDragEnter}
                    onDrop={this.onDrop}
                    showIcon={false}
                    selectable={false}
                    checkedKeys={mainstore.testConfiguration.selectedTestList}
                  >
                    {loop}
                  </Tree>
                  : null}
              </div>
            </FlexView>
          </FlexView>
          <FlexView column className="right-border panel-padding report-generation-container" style={{ height: Constants.MAX_PANEL_HEIGHT }}>
            <FlexView className="panel-div moi-maincontainer">
              <FlexView column hAlignContent='center' vAlignContent='center' height='100%'>
                <MoiComponents selectedMoi={mainstore.testConfiguration.selectedTestList} />
              </FlexView>
            </FlexView>
          </FlexView>

          <FlexView className="right-border panel-padding report-generation-container" column >
            <FlexView className="panel-div moi-maincontainer">
              <FlexView column hAlignContent='center' vAlignContent='center' height='100%'>
                <Report />
              </FlexView>
            </FlexView>
          </FlexView>
        </>);
    }

    // Search Region
    keywordFilter = (nodes, searchString) => {
      let filteredNodes = [];
      for (let n of nodes) {
        if (n.children) {
          const nextNodes = this.keywordFilter(n.children, searchString);
          if (nextNodes.length > 0) {
            n.children = nextNodes;
          } else if (n.title.toLowerCase().includes(searchString.toLowerCase())) {
            n.children = nextNodes.length > 0 ? nextNodes : [];
          }
          if (nextNodes.length > 0 || n.title.toLowerCase().includes(searchString.toLowerCase())) {
            // n.title = this.highlightSearchKey(n.title, searchString);
            filteredNodes.push(n);
          }
        }
        else {
          if (n.title.toLowerCase().includes(searchString.toLowerCase())) {
            // n.title = this.highlightSearchKey(n.title, searchString);
            filteredNodes.push(n);
          }
        }
      }
      return filteredNodes;
    };

    onSearchKeywordChange = (event, data, searchedNodes) => {
      this.setState(prevState => {
        if (prevState.searchString.trim() && !data.value.trim()) {
          return {
            expandedKeys: [],
            searchString: data.value
          };
        }
        return {
          expandedKeys: this.getAllTreeNodes(searchedNodes, true),
          searchString: data.value
        };
      });
    };

    highlightSearchKey = (text, searchString) => {
      const startIndex = text.toLowerCase().indexOf(searchString.toLowerCase());
      return startIndex !== -1 ? (
        <span>
          {text.substring(0, startIndex)}
          <span className="search-text">
            {text.substring(startIndex, startIndex + searchString.length)}
          </span>
          {text.substring(startIndex + searchString.length)}
        </span>
      ) : (
          <span>{text}</span>
        );
    };

    getAllTreeNodes = (nodes, firstLevel) => {
      if (firstLevel) {
        const values = [];
        for (let n of nodes) {
          values.push(n.key);
          if (n.children) {
            values.push(...this.getAllTreeNodes(n.children, false));
          }
        }
        return values;
      } else {
        const values = [];
        for (let n of nodes) {
          values.push(n.key);
          if (n.children) {
            values.push(...this.getAllTreeNodes(n.children, false));
          }
        }
        return values;
      }
    };

    // shouldComponentUpdate(nextProps, nextState) {
    //   if (this.state.searchString !== nextState.searchString) {
    //     return true;
    //   }
    //   if (!_.isEqual(this.state.checked, nextState.checked)) {
    //     return true;
    //   }
    //   if (this.state.selectedCertFilter !== nextState.selectedCertFilter) {
    //     return true;
    //   }
    //   if (_.isEqual(this.state.expanded, nextState.expanded)) {
    //     return false;
    //   }
    //   return true;
    // }

    // Search Region End
  }
)

export default PanelTestConfig;
