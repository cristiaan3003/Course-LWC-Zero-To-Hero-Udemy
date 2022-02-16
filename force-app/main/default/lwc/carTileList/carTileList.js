import { LightningElement, wire } from 'lwc';
import getCars from '@salesforce/apex/CarController.getCars'

//constanst
const LOAD_CAR_ERROR_MESSAGE = 'Error when loading car list'

//Lightning Message Service and a message channel (LMS)
import {subscribe, publish, unsubcribe, MessageContext} from 'lightning/messageService'
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c'
import CAR_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c'

export default class CarTileList extends LightningElement {
    carList=[]
    error
    loadCarListErrorMessage = LOAD_CAR_ERROR_MESSAGE
    /*filters: I will update this property from Filter compoponent (carFilter.js),
    for that  I need use LMS publish on carFilter.js (source) and LMS subscribe here (target)*/
    filters = {} 
    carFilterSubscription
    
    /* Load context for LMS */
    @wire(MessageContext)
    messageContext
    /* Take date published form source component */
    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.carFilterSubscription = subscribe(this.messageContext,CARS_FILTERED_MESSAGE, (message) => this.handleFilterMessage(message))
    }

    handleFilterMessage(message){
        console.log('message:', message.filters);
        /* set data from source (carFilter.js) on "filters" property */
        this.filters = {...message.filters} // ALWAYS DO A COPY AND UPDATE A COPY
    }

    @wire(getCars, {filters:'$filters'})
    carListHandler({data, error}){
        if(data){
            this.carList = data
            console.log('carList:', this.carList)
        }
        if(error){
            console.log('error:', error)
            this.error = error
        }
    }

    handleCarSelected(event){
        console.log('selected car id:', event.detail.Id);
        publish(this.messageContext, CAR_SELECTED_MESSAGE, {
            car:event.detail
        })
    }

    disconnectedCallback(){
        unsubcribe(this.carFilterSubscription)
        this.carFilterSubscription = null
    }

}