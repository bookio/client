##Roadmap First Public Release

#####Prerequisites
> By _user_ we mean the one using the product in his/hers business. _Customer_ is the users customer, the one who's address is in the reservation.

To get a quick understanding of how the client works (and terminology used below), check out <a href="https://github.com/bookio/client/wiki/Introduction-to-the-client-from-a-user-perspective">this wiki-page</a>.

#####Initial Scope
The final goal of the system is to work for three categories of reservations:

* Hardware (houses, boats, tools, sport equipment, ..)
* Resources (doctors, therapists, hairdressers, stand-up comedians, ..)
* Activities (Seminars, adventure tours, tastings, courses, ..)

For 1.0 we exclude Activities due to more complex handling. Resources will be handled as hardware initially.

##User stories for 1.0

###Build a Rental Space in the Desktop
The user should be able to add symbols that represents his business. The symbols have a set of propertys to define their behavior:
* Name
* Notes
* Booking Depth, number of reservations that can be made in the same time slot
* Available, open for reservations
* Category, if the object is member of a booking category (group)
* Symbol
* Rental periods with prices

#####Change Views
The user can view the rental space in three different ways. 
* Symbols
* Calendars
* List of rows

#####See Status for Chosen Time Period
The rental symbols should show their status depending on the chosen time period, by specifically show if they are:
* free
* reserved
* ongoing reservation
* ongoing reservation with "no show-up"
* unavailable

When going back in time, the historical status should be shown (i.e. going back and check who rented the 'red car' last friday). The chosen time period is controlled by the ruler with the scrollable thumb or by entering a specific time.

#####Zoomable Ruler
The ruler should be zoomable according to the time slots assigned to the rental symbols (i.e. If the user has a tennis hall he can chose days on the ruler, scroll forward a week, and then zoom down to hours to make a reservation.)

###Setup a Price List
The user should be able to build price lists and attach these to any symbol and rental period. Price can be different depending on the customer (student, senior, member, ..) and the time of day and year (high season, early bird). 

###Define Rental Periods
The user should be able to define the time slots in which the rental objects are reserved (i.e. Squash 45 minutes, Car 24 hours). For now the only slot length supported is day.

###Send Confirmations
After a reservation is made a confirmation should be sent to the customer via e-mail, SMS, Twitter, Facebook. (E-mail enough for 1.0?)

###Make a Reservation
Both the user and the customer should be able to make a reservation. The user through the Desktop and the customer through the Mobile interface. To make a reservation as a customer no registration should be required. A customer database should be built in the background, adding more data about the customer when new data gets known.  

###Search and Find
The user should be able to search for everything in a "Google-style" search. The search result can be a:
* reservation (future or past)
* customer
* rental object
