import React from 'react';
import { Nav, Navbar, NavItem, Button } from 'react-bootstrap';
import * as Constants from '../../Constants';
import { basemodal, mainstore } from '../../modals/BaseModal';
import { chartstore } from '../../modals/ChartStoreModal';
import { observer } from 'mobx-react';
import { mouseBusy } from '../../utils';
import FlexView from 'react-flexview/lib';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Switch from "react-switch";


// use the global store in any component without passing it
// down through the chain of props from the root node
const TopNavBar = observer(
  class TopNavBar extends React.Component {
    state = {
      showDropDown: false,
    };
    dynamicNavItems = () => {
      return <>
        <NavItem className="navbar-customcolor" href="#">
          <FlexView>
            <FlexView><img src="./GRL_Banner.jpg" className="grl-bannerImg" alt="GRL" /></FlexView>
          </FlexView>
        </NavItem>
      </>;
    }

    //TODO @Thiru remove the below code as this as been moved to test execution button
    runHandler = () => {
      mouseBusy(true);
      setTimeout(function () { mouseBusy(false); }, 3000);
      var runTest = !(mainstore.status.appState === Constants.BUSY ? true : false)
      if (runTest) {
        mainstore.status.appState = Constants.BUSY;
        chartstore.AppState = Constants.BUSY;
        basemodal.syncDataToServer();
        // basemodal.postSelectedTestList();
        this.props.setCurrentPanelIndex(3);//3 is the results panel
        basemodal.chartModal.resetPlot();
      }
      else {
        basemodal.getStopTestExecution();
        mainstore.status.appState = Constants.READY;
        chartstore.AppState = Constants.READY;
      }
      mainstore.chartPollEnabled = runTest;
    }

    appModeSelection = (event) => {
      if (event)
        basemodal.showPopUp(Constants.CTS_MODE_MESSAGE, null, 'Info', null, false, 'OKCancel', null, this.switchedAppMode.bind(this, event))
      else
        basemodal.showPopUp(Constants.API_MODE_MESSAGE, null, 'Info', null, false, 'OKCancel', null, this.switchedAppMode.bind(this, event))
    }

    switchedAppMode = (event) => {
      if (mainstore.popUpInputs.responseButton === "Ok") {
        basemodal.forceStopCurrentExecution()
        mainstore.apiMode.isAppModeAPI = event;
        basemodal.putAppMode()
        if (mainstore.apiMode.isAppModeAPI) {
          mainstore.currentPanelIndex = 3;
        } else {
          mainstore.currentPanelIndex = 0;
        }
      } else {
        mainstore.apiMode.isAppModeAPI = !event   //to stay in the previous mode
      }
    }


    render() {

      var progressBar = null;
      if (mainstore.testExecutionProgressPercentage) {
        progressBar = (
          <CircularProgressbar
            value={mainstore.testExecutionProgressPercentage}
            text={`${mainstore.testExecutionProgressPercentage}%`}
            background
            backgroundPadding={6}
            className="circular-progressbar-padding"
            styles={buildStyles({
              backgroundColor: "white",
              textSize: '25px',
              textColor: "#002075",
              pathColor: "#002075",
              trailColor: "transparent",
            })} />
        )
      }
      //var runBtnIcon = mainstore.c2AppState === 'BUSY' ? "fa fa-stop-circle menu-button-icon-stop menu-button-icon" : "fa fa-play-circle menu-button-icon";
      return (
        <>
          <header>
            <Navbar className="topnav" variant="dark" collapseOnSelect>
              <Navbar.Collapse className=" nav-bar-parent">
                <Nav>
                  {
                    this.dynamicNavItems()
                  }
                </Nav>

                <Nav>
                  <NavItem className="navbar-header mobile-header">
                    <FlexView column hAlignContent='right' className="nav-bar-second-text-div" >
                      <p className="navbar-primaryText">USB Power Delivery and USB Type-C<sup>&trade;</sup> Test Software ({mainstore.softwareVersion})</p>
                      <FlexView >
                        <p className="navbar-secondaryText">GRL-USB-PD-C2</p>
                      </FlexView>
                    </FlexView>
                  </NavItem>
                </Nav>
                <Nav>
                  <NavItem href="#" >
                    <div className="app-modetoggle-switch">
                      <span className="app-mode-label"> Set App Mode : </span>
                      <p className="set-app-mode-labels">CTS</p>
                      <Switch
                        className="app-mode-switch-btn"
                        checked={mainstore.apiMode.isAppModeAPI}
                        onChange={this.appModeSelection}
                        onColor="#0000ff"
                        offColor="#c1c1c1"
                        offHandleColor="#06789a"
                        onHandleColor="#06789a"
                        handleDiameter={20}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={50}
                        uncheckedIcon={<div style={{ color: "white", fontSize: "14px", paddingLeft: "3px" }}>  </div>}
                        checkedIcon={<div style={{ color: "white", fontSize: "14px", paddingLeft: "3px" }}>  </div>}
                      // disabled={mainstore.productCapabilityProps.vifFileName === Constants.VIF_LOAD_BTN_DEFAULT}
                      />
                      <p className="set-app-mode-labels">API</p>
                    </div>
                  </NavItem>
                  <NavItem href="#" className="progress-bar-nav-div" >
                    {progressBar}
                  </NavItem>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </header>
        </>);
    }
  })

export default TopNavBar;
