import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import  { purchaseUpdatedListener,purchaseErrorListener } from 'react-native-iap';
import Toast from '../../theme/components/NotificationToast';
import StorePayments from "../../services/StorePayments";
import {ostErrors} from "../../services/OstErrors";
import CurrentUser from '../../models/CurrentUser';

let purchaseUpdateSubscription , purchaseErrorSubscription ;

const mapStateToProps = (state, ownProps) => {
    return {
      userId : CurrentUser.getUserId() 
    };
};

class PaymentWorker extends PureComponent {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        purchaseUpdateSubscription = purchaseUpdatedListener(( res ) => {
            this.onRequestPurchaseSuccess( res ); 
        });

        purchaseErrorSubscription = purchaseErrorListener((error) => {
            this.onRequestPurchaseError(error);
        });
    }

    componentWillUnmount(){
        if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove();
            purchaseUpdateSubscription = null;
        }
         if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove();
            purchaseErrorSubscription = null;
        }
    }

    componentDidUpdate( ){
        if(this.props.userId){
            StorePayments.snycPendingPayments( this.props.userId );
        }
    }

    onRequestPurchaseSuccess = ( res ) => {
        StorePayments.acknowledgeBEOnPurchaseSuccess( res , CurrentUser.getUserId() ) ; 
     }
 
     onRequestPurchaseError = ( error  ) => {
        StorePayments.acknowledgeBEOnPurchaseError( error , CurrentUser.getUserId() ) ; 
         Toast.show({
             text:  ostErrors.getUIErrorMessage("payment_failed_error"),
             icon: 'error'
         });
     }

     render(){
         return <React.Fragment />;
     }

}

export default connect(mapStateToProps)(PaymentWorker);