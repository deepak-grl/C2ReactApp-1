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

    render() {

      var progressBar = null;
      if (mainstore.testExecutionProgressPercentage) {
        progressBar = (
          <CircularProgressbar
            value={mainstore.testExecutionProgressPercentage}
            text={`${mainstore.testExecutionProgressPercentage}%`}
            background
            backgroundPadding={6}
            className ="circular-progressbar-padding"
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
              <Navbar.Collapse>
                <Nav className="mr-auto">
                  {
                    this.dynamicNavItems()
                  }
                </Nav>
                <Nav>
                  <NavItem className="navbar-header mobile-header">
                    <FlexView column hAlignContent='right'>
                      <p className="navbar-primaryText">USB Power Delivery and USB Type-C<sup>&trade;</sup> Test Software ({mainstore.softwareVersion})</p>
                      <FlexView>
                        <p className="navbar-secondaryText">GRL-USB-PD-C2</p>
                      </FlexView>
                    </FlexView>
                  </NavItem>
                  <NavItem href="#" className="navbar-container">
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
