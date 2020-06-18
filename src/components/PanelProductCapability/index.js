import React from 'react';
import FlexView from 'react-flexview';
import ProductCapabilityComponent from "./ProductCapabilityComponent"
import * as Constants from '../../Constants';
import { observer } from 'mobx-react';
import { Button} from 'react-bootstrap';

const PanelProductCapability = observer(
  class PanelProductCapability extends React.Component {
    render() {
      return (<>
        <FlexView column style={{ height: Constants.MAX_PANEL_HEIGHT }} className="panel-setWidth">
          <FlexView className="port-flex">
            <ProductCapabilityComponent />
          </FlexView>
        </FlexView>
      </>);
    }
  }
);

export default PanelProductCapability;
