import React from 'react';
import TopNavBar from './components/TopNavBar';
import LeftNavBar from './components/LeftNavBar';
import MainArea from './components/MainArea';
import FlexView from 'react-flexview/lib';
import { mainstore, basemodal } from './ViewModel/BaseModal';
import { chartstore } from './modals/ChartStoreModal';
import { observe } from 'mobx';
import * as Constants from './Constants';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPanelIndex: 0//Kept to avoid making the whole app as observer
    };
    basemodal.syncDataFromServer();
    const disposer = observe(mainstore, "currentPanelIndex", (change) => {
      this.setState({
        currentPanelIndex: mainstore.currentPanelIndex
      });
      // update chartstore value when currentPanelIndex value changes.
      if (mainstore.currentPanelIndex === 3) {
        chartstore.isPlotResultActive = true;
      } else {
        chartstore.isPlotResultActive = false;
      }
    });
  }

  setCurrentPanelIndex = (currentIndex) => {
    this.setState({
      currentPanelIndex: currentIndex
    });
    mainstore.currentPanelIndex = currentIndex;
  }

  render() {
    return (
      <FlexView column className="app-area" hAlignContent='center'>
        <FlexView className="app-area-top" >
          <TopNavBar currentPanelIndex={this.state.currentPanelIndex} setCurrentPanelIndex={this.setCurrentPanelIndex} />
        </FlexView>
        <FlexView className="app-area-bottom" hAlignContent='left' vAlignContent='top'>
          <LeftNavBar currentPanelIndex={this.state.currentPanelIndex} setCurrentPanelIndex={this.setCurrentPanelIndex} />
          <MainArea currentPanelIndex={this.state.currentPanelIndex} setCurrentPanelIndex={this.setCurrentPanelIndex} />
        </FlexView>
      </FlexView>
    );
  }
}

export default App;
