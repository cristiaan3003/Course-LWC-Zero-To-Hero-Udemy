public with sharing class CarController {

    //wrapper class
    public class Filters {
            
        @AuraEnabled
        public String searchKey {get;set;}
        @AuraEnabled
        public Decimal maxPrice {get;set;}
        @AuraEnabled
        public String[] categoryValues {get;set;}
        @AuraEnabled
        public String[] makeValues {get;set;}
        
    }

    @AuraEnabled(cacheable=true)
    public static List<Car__c> getCars(Filters filters){

        String key, whereClause = '';
        Decimal maxPrice;
        String[] categoryValues, makeValues, criteria = new List<String>();

        if(filters != null){

            maxPrice = filters.maxPrice;
            categoryValues = filters.categoryValues;
            makeValues = filters.makeValues;
            
            if(!String.isEmpty(filters.searchKey)){

                key = '%'+filters.searchKey+'%';
                criteria.add('Name LIKE :key');
            }

            if(filters.maxPrice >= 0){

                criteria.add('MSRP__c <= :maxPrice');
            }

            if(filters.categoryValues != null){

                criteria.add('Category__c IN :categoryValues');
            }

            if(filters.makeValues != null){

                criteria.add('Make__c IN :makeValues');
            }
            
            if (criteria.size() > 0){

                whereClause = 'WHERE ' + String.join(criteria, ' AND ');
            }

        }

        // String.escapeSingleQuotes --> prevent ApexSOQLInjection
        String query = String.escapeSingleQuotes('SELECT Id, Name, Category__c, Control__c, Description__c, '+
        'Fuel_Type__c, Make__c, MSRP__c, Number_of_Seats__c, OwnerId, '+
        'Picture_URL__c, SystemModstamp '+
        'FROM Car__c '+ whereClause + ' '+
        'WITH SECURITY_ENFORCED '+
        'ORDER BY Name');

        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static List<Car__c> getSimilarCars(Id carId, String[] makeType){
        return [SELECT Id, Name, Category__c, Control__c, Description__c, Fuel_Type__c, Make__c, MSRP__c, Number_of_Seats__c, Picture_URL__c FROM Car__c  WHERE Make__c IN :makeType AND Id != :carId WITH SECURITY_ENFORCED];
    }


}
