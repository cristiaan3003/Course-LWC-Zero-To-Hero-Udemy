import { LightningElement, wire, api } from 'lwc';

//Navigation
import {NavigationMixin} from 'lightning/navigation'

//Car__c schema
import CAR_OBJECT from '@salesforce/schema/Car__c'
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__c'
import FUEL_TYPE_FIELD from '@salesforce/schema/Car__c.Fuel_Type__c'
import SEATS_FIELD from '@salesforce/schema/Car__c.Number_of_Seats__c'
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c'
import NAME_FIELD from '@salesforce/schema/Car__c.Name'
import PICTURE_URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c'
// This function is used for extract field values
import {getRecord, getFieldValue} from 'lightning/uiRecordApi'


//Lightning Message Service and a message channel (LMS)
import {subscribe, unsubcribe, MessageContext} from 'lightning/messageService'
import CAR_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c'


export default class CarCard extends NavigationMixin(LightningElement) {

    carSelectedSubcription
    // Expose a field to make it available in the template
    categoryField = CATEGORY_FIELD
    makeFiled = MAKE_FIELD
    msrpField = MSRP_FIELD
    fuelField = FUEL_TYPE_FIELD
    seatsField = SEATS_FIELD
    controlField = CONTROL_FIELD

    recordId

    // fields displayes with specific format
    carName
    carPictureUrl

    /* Load context for LMS */
    @wire(MessageContext)
    messageContext
    /* Take date published form source component */
    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.carSelectedSubcription = subscribe(this.messageContext, CAR_SELECTED_MESSAGE, (message) => this.handleCarSelectedMessage(message))
    }

    handleCarSelectedMessage(message){
        console.log('message:', message)
        this.recordId = message.car.Id
        /* set data from source (carFilter.js) on "filters" property */
        //this.filters = {...message.filters} // ALWAYS DO A COPY AND UPDATE A COPY
    }

    handleRecordLoaded(event){
        const {records} = event.detail
        const recordData = records[this.recordId]
        this.carName = getFieldValue(recordData, NAME_FIELD)
        this.carPictureUrl = getFieldValue(recordData, PICTURE_URL_FIELD)
 
    }

    disconnectedCallback(){
        unsubcribe(this.carSelectedSubcription)
        this.carSelectedSubcription = null
    }

    /* Navigate to record page: Navigation Mixin */
    handleNavigateToRecord(){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:this.recordId,
                objectApiName: CAR_OBJECT.objectApiName,
                actionName:'view'
            }
        })
    }


}