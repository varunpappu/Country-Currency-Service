# Country Currency Service
Used to get country and currency conversion rate.

FORMAT: 1A

# Running the application:

+ Step 1: git clone 
+ Step 2: cd Country-Currency-Service
+ Step 3: npm install 
+ Step 4: npm run build 
+ Step 5: npm run dev-server (Starting dev-server) 
+ Step 6: npm run dev-client (Starting dev-client) 
+ Step 7: Navigate to http://localhost:8089 for client
+ Step 8: Navigate to http://localhost:8080/docs for Swagger docs


# API Information

## Get Country Info  [GET] [/api/v1/country/{countryName}]
  
+ Request JSON Message (application/json)

+ Response 200 (application/json)

    + Body

            {
                "result": [
                    {
                    "name": "<string_countryName>",
                    "currencies": [
                        {
                        "code": "<string_currencyCode>",
                        "name": "<string_currencyName>",
                        "symbol": "<string_currencysymbol>"
                        },
                        "exchangeRate": {
                            "timestamp": <timestamp>,
                            "baseCurrency": <base_currency_string>,
                            "date": <date>,
                            "rates": <exchange_rate_number>
                        },
                    ],
                    "population": "<number_population>"
                    }
                ]
            }


## Get Currency Info  [GET] [/api/v1/currency/{from}/{to}/{amount}]
  
+ Request JSON Message (application/json)

+ Response 200 (application/json)

    + Body

            {
                "result": [
                    {
                      "timestamp": "<timestamp>",
                      "baseCurrency": "<string_base_currency>",
                      "convertedCurrency": "<string_converted_currency>",
                      "date": "<date>",
                      "rates": "<number_conversion_rate>",
                      "convertedRate": "<number_converted_rate>"
                   },
               ]
            }

## Get Swagger Docs  [GET] [/docs]


## Limitations

+ Currently free sunscription only allwos EUR country as base. 
