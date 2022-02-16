import { LightningElement, wire } from 'lwc';
import {getPicklistValues, getObjectInfo} from 'lightning/uiObjectInfoApi'
import CAR_OBJECT from '@salesforce/schema/Car__c'

//car Schema
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'

//constanst
const CATEGORY_ERROR_MESSAGE = 'Error loading categories list'
const MAKE_ERROR_MESSAGE = 'Error loading make list'

//Lightning Message Service and a message channel (LMS)
import {publish, MessageContext} from 'lightning/messageService'
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c'

export default class CarFilter extends LightningElement {

    filters = {
        searchKey:'',
        maxPrice:999999
    }
    categoryErrorMessage = CATEGORY_ERROR_MESSAGE
    makeErrorMessage = MAKE_ERROR_MESSAGE
    timer

    /* Load context for LMS */
    @wire(MessageContext)
    messageContext
    /* Method Publish data to target Component */
    sendDataToCarTileList(){
        //publish(this.messageContext, CARS_FILTERED_MESSAGE, {filters:this.filters})
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(() => {
            publish(this.messageContext, CARS_FILTERED_MESSAGE, {filters:this.filters})
        }, 400);
        
    }

    @wire(getObjectInfo, {objectApiName:CAR_OBJECT})
    carObjectInfo

    @wire(getPicklistValues, {recordTypeId : '$carObjectInfo.data.defaultRecordTypeId', 
    fieldApiName:CATEGORY_FIELD})categoryValues

    @wire(getPicklistValues, {recordTypeId : '$carObjectInfo.data.defaultRecordTypeId', 
    fieldApiName:MAKE_FIELD})makeValues


    handleSearchKeyChange(event){
        console.log('SearchKey:', event.target.value);
        //NEVER UPDATE DIRECTLY. do a copy and update the copy
        this.filters = {...this.filters, "searchKey":event.target.value}
        this.sendDataToCarTileList(); // publish data when this method is executed
    }

    handleMaxPriceChange(event){
        console.log('Max Price:', event.target.value);
        //NEVER UPDATE DIRECTLY. do a copy and update the copy
        this.filters = {...this.filters, "maxPrice":event.target.value}
        this.sendDataToCarTileList(); // publish data when this method is executed
    }

    handleCheckBox(event){
        //console.log('handleCheckBox:', variable);
        if(!this.filters.categoryValues){
            console.log('this.filters.categoryValues:', this.filters.categoryValues);
            const categoryValues = this.categoryValues.data.values.map((item) => item.value);
            const makeValues = this.makeValues.data.values.map((item) => item.value);
            this.filters = {...this.filters, categoryValues:categoryValues, makeValues:makeValues}
        }
        
        const {name, value} = event.target.dataset;

        //checked is a property tell is a checkbox is true or false
        if(event.target.checked){
            /*is true-> I will check if exist inside filters property
            name = categoryValues or makeValues
            if NOT exist I will add that key/value pair to filters
            */
            if(!this.filters[name].includes(value)){
                this.filters[name] = [...this.filters[name], value]
            }
            } else {
                this.filters[name] = this.filters[name].filter((item) => item !== value)
            }
        this.sendDataToCarTileList(); // publish data when this method is executed
    }

}