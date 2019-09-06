import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    BackHandler,
    Platform,
    Animated,
    Easing,
    Image
  } from 'react-native';

import TouchableButton from "../../theme/components/TouchableButton";
import Theme from '../../theme/styles';

import deepGet from "lodash/get";
import PepoApi from "../../services/PepoApi";
import StorePayments from "../../services/StorePayments";
import pepoTxIcon from "../../assets/pepo-tx-icon.png";
import toastError from '../../assets/toast_error.png';
import pepoIcon from '../../assets/self-amount-pepo-icon.png';
import mailIcon from '../../assets/mail-filled.png';

import inlineStyles from './styles';

class StoreProductsScreen extends PureComponent{

    constructor(props){
        super(props); 

        this.state = {
            loadingProducts : true,
            isPurchasing : false,
            rotate: new Animated.Value(0),
            scale: new Animated.Value(0.1)
        }

        this.productIds = [];
        this.products = [];
        this.isProductFetchError = false;
        this.maxThresholdReached = false;
        this.fetchProducts();
    }

    componentDidMount(){
        StorePayments.events.on("paymentProcessed" , this.onPaymentProcessed);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount(){
        this.onFetchSuccess = () => {};
        this.onFetchError = () => {};
        this.onFetchStoreProductSuccess = () => {};
        this.onPaymentProcessed = () => {};
        StorePayments.events.removeListener('paymentProcessed');
        BackHandler.removeEventListener('hardwareBackPress');
    }

    fetchProducts = () => {
       const params = {"os": Platform.OS.toLowerCase()};
       new PepoApi('/users/available-products')
        .get(params)
        .then((res) => {
            if(res && res.success){
                this.onFetchSuccess(res);
            }else{
                this.onFetchError(res);
            }
        })
        .catch((error) => {
            this.onFetchError(error);
        })
    }

    onFetchSuccess(res){
        this.setProductIds(res);
        this.maxThresholdReached = this.isMaxLimitReached(res) ;
        this.fetchProductsFromStore();
    }

    isMaxLimitReached( res ){
        const limits =  deepGet(res, 'data.limits_data') || {} ; 
        for (var key in limits) {
            if (limits[key] == 1) {
              return true;
            }
        }
        return false ;
    }

    setProductIds( res ){
        const   result_type = deepGet(res, 'data.result_type'),
                products = deepGet(res, `data.${result_type}`); 
        this.productIds = products.map( (product) => {
            return product.id ; 
        }); 
    }

    fetchProductsFromStore = () =>{
        StorePayments.getProductsFromStore(this.productIds , this.onFetchStoreProductSuccess , this.onFetchError )
    }

    onFetchStoreProductSuccess = ( products ) => {
        this.products = products ;  
        this.setState({ loadingProducts : false});
    }

    onFetchError = (error) => {
        this.isProductFetchError =  true ;
        this.setState({ loadingProducts : false});
    }

    onRequestPurchase = ( skuId ) => {
        this.productId = skuId ; 
        this.setState({isPurchasing: true});
          //View controll ends here. 
        StorePayments.requestPurchase( skuId );
    }

    onPaymentProcessed = ( ) => {
        this.setState({isPurchasing: false});
    }

    getAnimation(){
        return Animated.sequence([
          Animated.delay(800),
          Animated.timing(this.state.rotate, {
            toValue: 1,
            easing:Easing.elastic(1.5),
            useNativeDriver: true
          }),
          Animated.loop(
            Animated.timing(this.state.scale, {
              duration: 1200,
              easing:Easing.inOut(Easing.ease),
              useNativeDriver: true
            })
          )
        ])
      };

    getLoadingMarkup = () => {
        const rotateData = this.state.rotate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg','-135deg'],
          });
          const scaleData = this.state.scale.interpolate({
            inputRange: [0.11, 0.5, 1],
            outputRange: [1, Platform.OS == 'ios' ? 1.15 : 1.3, 1]
          });
          let animationStyle = {
            transform: [
              {scale: scaleData},
              {rotate: rotateData}
            ],
          };
          this.getAnimation().start() ;
        return (
            <View style={inlineStyles.viewWrapper}>
                <Animated.Image
                  style={[ animationStyle, {width: 40, height: 40, marginBottom: 20} ]}
                  source={pepoTxIcon}/>
                <Text>Fetching Topup Options</Text>
            </View>
        )
    }

    getErrorMarkup = () => {
        return (
            <View style={inlineStyles.viewWrapper}>
                <Image source={toastError} style={{ width: 30, height: 30, marginBottom: 20}}></Image>
                <Text style={{textAlign: "center"}}>Topup not available at this time, we are looking into in. Please check back later</Text>
            </View>
        )  
    }

    getThresholdReachedMarkUp = () => {
        return (
            <View style={[inlineStyles.viewWrapper,  {flexDirection: "row" , alignItems: "center" , padding: 30}]} >
               <Image source={mailIcon} style={{ width: 30, height: 30, marginBottom: 20}}></Image>
               <Text style={{textAlign: "center" , marginLeft: 10}}>
                You have exceeded the Topup limit of $50
                Contact us on info@pepo.com to increase your topup limit.
               </Text>
            </View>
        )
    }

    getNoProductsMarkUp = () => {
        return this.getErrorMarkup();
    }

    getProductsMarkUp = () => {
        return (
            <View style={inlineStyles.poductListWrapper}>
                <View style={inlineStyles.headerWrapper}>
                    <Text style={inlineStyles.modalHeader}>Top-Up Pepo Coins</Text>
                </View>
                {this.products.map(( product ) => (
                    <View key={ product.productId } style={inlineStyles.poductListRow}>
                        <View style={{flexDirection: "row", alignItems: 'center'}}>
                            <Image source={pepoIcon} style={{ width: 25, height: 25 }}/>
                            <Text style={{marginRight: 10}}>{product.title}</Text>
                        </View>
                        <TouchableButton
                                disabled={this.state.isPurchasing}
                                TouchableStyles={[Theme.Button.btnPink , inlineStyles.pepoBtnStyle]}
                                TextStyles={[Theme.Button.btnPinkText]}
                                text={this.state.isPurchasing && this.productId == product.productId ? "..." : product.price}
                                onPress={() => {this.onRequestPurchase(product.productId) }}
                        />
                    </View>
                ))}
            </View>    
        )
    }

    getMarkUp = () => {
        this.getAnimation().stop() ;
        if(this.isProductFetchError){
            return this.getErrorMarkup();
        } else if(this.maxThresholdReached){
            return this.getThresholdReachedMarkUp(); 
        }else if(this.products.length <  1 ){
            return this.getNoProductsMarkUp(); 
        }else{
            return this.getProductsMarkUp(); 
        }
    }

    closeModal = () => {
        if(this.state.isPurchasing){
            return true ; 
        }
        this.props.navigation.goBack();
        return false ;
    }

    handleBackButtonClick = () => {
        this.closeModal();
    }

    render(){
        return (
            <TouchableWithoutFeedback onPressOut={this.closeModal}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={[inlineStyles.container]}>
                        {this.state.loadingProducts && this.getLoadingMarkup()}                   
                        {!this.state.loadingProducts && this.getMarkUp()}
                    </View>     
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

export default StoreProductsScreen  ;