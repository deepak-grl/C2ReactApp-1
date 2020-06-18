import React from 'react';
import FlexView from 'react-flexview/lib';
import PanelConnectionSetup from '../PanelConnectionSetup';
import PanelProductCapability from '../PanelProductCapability';
import PanelTestConfig from '../PanelTestConfig';
import PanelResults from '../PanelResults';
import PanelHelp from '../PanelHelp';
import PanelReportConfig from '../PanelReportConfig';
import PanelPlot from '../PanelPlot';
import SplitPane from 'react-split-pane';
import { basemodal, mainstore } from '../../modals/BaseModal';
import * as Constants from '../../Constants';
import { PacketDetails } from '../Chart/CcPacket'
import PopUpManager from '../PopUpManager/PopUpManager'
import { ToastContainer } from 'react-toastify';
import { customNavbarOnSpitterMoves } from '../../utils/index';
import html2canvas from 'html2canvas';
import PanelOptions from '../PanelOptions';
import { observe } from 'mobx';

class MainArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayChart: false,
      windowSize: window.innerHeight - 65,
      reRender: 0,
    };
    this.panleRefs = [];
    this.scrollRef = React.createRef();
    this.panelHeight = 360;
    this.windowHeight = window.innerWidth;
    this.lastScrollEventTime = (new Date()).getTime();
    // this.panel_height = window.innerHeight - 65 + 'px';
    this.showPacketDetails = false;
    this.showPacketResults = false;

    const disposer1 = observe(mainstore.popUpInputs, "displayPopUp", (change) => {
      this.setState({ reRender: this.state.reRender + 1 })
    });
  }
  componentDidMount() {
    this.splitPaneResizer();
    //Custom navbar button to show/hide PlotToolbar.
    document.getElementById('navbar_icon_img').addEventListener('click', function () {
      if (document.getElementsByClassName('hideToolbar')[0]) {
        document.getElementsByClassName('chart-plottoolbar')[0].classList.remove("hideToolbar");
      } else {
        document.getElementsByClassName('chart-plottoolbar')[0].classList.add("hideToolbar");
      }
    });

    window.addEventListener("resize", this.handleResizeBrowser.bind(this));

    this.getScreenShot();
  }

  componentWillUnmount() {
    window.addEventListener("resize", null);
  }
  handleResizeBrowser() {
    this.setState({ windowSize: window.innerHeight - 65 })
  }

  getScreenShot() {
    /*var options = {
      useCORS: true,
      dpi: 10,
    }*/
    document.getElementById('btn_screenshot').addEventListener("click", function () {
      html2canvas(document.getElementsByClassName("panelplot-container")[0]).then(canvas => {                 // Can't move to utils because we need to import html2canvas.
        //dowload code
        if (canvas.msToBlob) { //for IE
          var blob = canvas.msToBlob();
          window.navigator.msSaveBlob(blob, 'screenshot.png');
        } else {      // for other browsers (chrome etc.)
          var a = document.createElement('a');
          a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
          a.download = 'screenshot.png';
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      });
    });
  }


  splitPaneResizer() {
    var me = this;
    document.querySelector(".plotSplitPane .Resizer").setAttribute("title", "Double click to hide/show test results");
    /*** Event Listening from SplitPane ClassName (special case) :: Split pane is not providing OnDoubleClick ***/
    document.querySelector(".plotSplitPane .Resizer").addEventListener("dblclick", function (event) {
      if (this.showPacketResults) {
        document.querySelector(".plotSplitPane2 .Pane1").style.width = "30%";
      } else {
        document.querySelector(".plotSplitPane2 .Pane1").style.width = "0px";
      }
      this.showPacketResults = !this.showPacketResults;
      setTimeout(() => { me.updatePacketPanelwidth() }, 100);
    });

    document.querySelector(".plotSplitPane > .Resizer").setAttribute("title", "Double click to hide/show packet details");
    document.querySelector(".plotSplitPane > .Resizer").addEventListener("dblclick", function (event) {
      if (this.showPacketDetails) {
        document.querySelector(".plotSplitPane > .Pane1").style.width = "75%";
      } else {
        document.querySelector(".plotSplitPane > .Pane1").style.width = "99.5%";
      }
      this.showPacketDetails = !this.showPacketDetails;
      setTimeout(() => { me.updatePacketPanelwidth() }, 100);
    });
  }
  updatePacketPanelwidth() {
    var chartModal = basemodal.chartModal;
    var panelWidth = chartModal.getDrawableAreaWidth();
    chartModal.currentDrawableAreaWidth = panelWidth;
    chartModal.getTestChannel();
    if (chartModal.allChannels[0] !== undefined) {
      chartModal.calc_PacketDistanceMultiplier();
    }
    chartModal.requestChartRerender();
    customNavbarOnSpitterMoves(Constants.PLOTTOOLBAR_ICON_TOTAL_WIDTH);
    setTimeout(() => {
      mainstore.markerTimeDiffernce = mainstore.markerTimeDiffernce + 1   //to rerender the marker while clcicking on the packet
    }, 300)
  }


  onMouseScroll(event) {
    if (mainstore.status.appState === Constants.BUSY)
      return;

    var currentTime = (new Date()).getTime();
    if (currentTime - this.lastScrollEventTime > 500) {
      this.lastScrollEventTime = currentTime;
      let nextIndex = 0;
      if (event.deltaY > 0) {
        nextIndex = parseInt(this.props.currentPanelIndex) + 1;
      }
      else {
        nextIndex = parseInt(this.props.currentPanelIndex) - 1;
      }

      if ((nextIndex >= 0) && (nextIndex < this.panleRefs.length)) {
        this.props.setCurrentPanelIndex(nextIndex);
      }
    }
  }

  scrollTo(cpanelIndex) {
    this.panleRefs[cpanelIndex].current.scrollIntoView({
      block: "start"
    });
  }
  componentDidUpdate() {
    if (!this.state.displayChart) {
      this.scrollTo(this.props.currentPanelIndex);
      var panelIndex = 0;
      for (panelIndex = 0; panelIndex < this.panleRefs.length; panelIndex++)
        this.panleRefs[panelIndex].current.className = "scroll-content-disabled"
      this.panleRefs[this.props.currentPanelIndex].current.className = ""
    }
  }

  configScrollArea = () => {
    var allPanels = [];
    var panelCS = <PanelConnectionSetup />;
    var WPanelCS = this.wrapPanel(panelCS, 0);
    allPanels.push(WPanelCS);

    var panelPC = <PanelProductCapability />;
    var WPanelPC = this.wrapPanel(panelPC, 1);
    allPanels.push(WPanelPC);

    var panelTestConfig = <PanelTestConfig />;
    var WPanelTestConfig = this.wrapPanel(panelTestConfig, 2);
    allPanels.push(WPanelTestConfig);

    var panelResults = this.getSplitter();
    var WPanelResults = this.wrapPanel(panelResults, 3)
    allPanels.push(WPanelResults);

    /*var panelPlot = <PanelPlot />
    var WPanelPlot = this.wrapPanel(panelPlot, 4)
    allPanels.push(WPanelPlot);*/

    var PanelRC = <PanelReportConfig />
    var wPanelReportConfig = this.wrapPanel(PanelRC, 4)
    allPanels.push(wPanelReportConfig);

    var panelOptions = <PanelOptions />
    var WPanelOptions = this.wrapPanel(panelOptions, 5)
    allPanels.push(WPanelOptions);

    var panelHelp = <PanelHelp />
    var WPanelHelp = this.wrapPanel(panelHelp, 6)
    allPanels.push(WPanelHelp);



    return (
      <div ref={this.scrollRef} onWheel={this.onMouseScroll.bind(this)} className="scroll-area">
        <FlexView column key='flexview-scroll' >
          {allPanels}
        </FlexView>
      </div>
    );
  }

  getSplitter() {
    return (<SplitPane split="vertical" className="plotSplitPane" minSize={0} defaultSize="99.5%"
      onDragFinished={() => this.updatePacketPanelwidth()}>
      <SplitPane split="vertical" minSize={0} defaultSize="30%" className="plotSplitPane2"
        onDragFinished={() => this.updatePacketPanelwidth()}>
        <PanelResults />
        <PanelPlot />
      </SplitPane>
      <PacketDetails />
    </SplitPane>);
  }


  // ---------------------------- Wrapper Higher-Order Component  {
  wrapPanel = (Wrappanel, index) => {
    this.panleRefs.push(React.createRef());
    var disabledClass;
    index === this.props.currentPanelIndex ? disabledClass = "" : disabledClass = "scroll-content-disabled"

    return (
      <div ref={this.panleRefs[index]} key={index} className={disabledClass} >
        <FlexView className="scroll-panel panel-container mobile-container" style={{ height: this.state.windowSize }}>
          {Wrappanel}
        </FlexView>
      </div>
    );
  };
  // ---------------------------- Wrapper Higher-Order Component  }

  render() {
    this.panleRefs = [];
    var mainarea = null;
    mainarea = this.configScrollArea();
    return (<FlexView column className="main-area" >
      <ToastContainer />
      {mainarea}
      <PopUpManager />
      <GlassPanel />
    </FlexView>);
  }
}


export default MainArea;

class GlassPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reRender: 1,
    };
    const disposer1 = observe(mainstore, "renderGlassPaneWhileGetcaps", (change) => {
      this.setState({ reRender: this.state.reRender + 1 })
    });
  }
  render() {
    var isGlasspaneActive = false;
    if (mainstore.isCalibratedButtonClicked === true && mainstore.currentPanelIndex !== 5)
      isGlasspaneActive = true
    else if (mainstore.currentPanelIndex !== 3 && mainstore.status.appState === Constants.BUSY) {
      isGlasspaneActive = true;
    }

    if (mainstore.enableGlassPaneIfFivePortSelected === true && mainstore.currentPanelIndex === 5 && mainstore.status.appState === Constants.BUSY) {
      isGlasspaneActive = false;
    }

    return (
      <>
        {mainstore.popUpInputs.displayPopUp === false ?
          <div className={isGlasspaneActive && this.state.reRender > 0 ? "custom-glasspane" : ''}></div>          //reRender state used to render the glasspane after completing the getcaps 
          : null}
      </>
    )
  }
} 