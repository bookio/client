###Roadmap to First Public Release

> By _user_ we mean the one using the product in his/hers business. _Customer_ is the users customer, the one who's address is in the reservation.

To get a quick understanding of how the client works from a user perspective, check out <a href="https://github.com/bookio/client/wiki/Introduction-to-the-client-from-a-user-perspective">this wiki-page</a>.

The goal of the system is to work for three categories of reservations:

* Hardware (houses, boats, tools, sport equipment, ..)
* Resources (doctors, therapists, hairdressers, stand-up comedians, ..)
* Activities (Seminars, adventure tours, tastings, courses, ..)

For 1.0 we exclude Activities due to more complex handling. Resources will be handled as hardware initially.

The following user stories must be done for 1.0:

####Build a Rental Space in the Desktop
The user should be able to add symbols that represents his business. The symbols have a set of propertys that defines how and when the symbol can be booked.

#####Change Views
The user can view the rental space in three different ways. As symbols, as calendars or as a list of rows.

#####See Status for Chosen Time Period
The rental symbols should show their status depending on the chosen time period, by specifically show if they are:
* free
* reserved
* ongoing reservation
* ongoing reservation with "no show-up"
* unavailable

When going back in time, the historical status should be shown (i.e. going back and check who rented the 'red car' last friday). The chosen time period is controlled by the ruler with the scrollable thumb or by entering a specific time.

####Setup a Price List
The user should be able to build price lists and attach these to any symbol and rental period. Price can be different depending on the customer (student, senior, member, ..) and the time of day and year. 

####Define Rental Periods
The user should be able to define the time slots in which the rental objects are reserved (i.e. Squash 45 minutes, Car 24 Hours).

####Send Confirmations
After a reservation is made a confirmation should be sent to the customer via e-mail, SMS, Twitter, Facebook. (E-mail enough for 1.0?)

####Make a Reservation
Both the user and the customer should be able to make a reservation. The user through the Desktop and the customer through the Mobile interface. To make a reservation as a customer no registration should be required. A customer database should be built in the background, adding more data about the customer when new data gets known.  

####Search and Find
The user should be able to search for everything in a "Google-style" search. The search result can be a:
* reservation
* customer
* rental object
