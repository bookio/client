###Draft for syntax when booking through SMS, Twitter and Mail
Below you see a sample conversation between a customer and the reservation server at _Wendys Massage_ (iPhone SMS).

![text](https://f.cloud.github.com/assets/4263707/1930691/22bc6f96-7eb2-11e3-97dd-9a7d10891833.png)

The goal is to make the server part stateless, which will make the usage of the client side slightly more complex (you have to refer to reservation ID).

####COMMAND - get a list of bookable resources 
```
? | any unrecognized text
```
#####REPLY
```
Available for reservation:
1: [Name of booking category 1] [reservation slot length for category 1], [price for category 1]
2: [Name of booking category 2] [reservation slot length for category 2], [price for category 2]
3: ...

To book reply with: B# date/time, your name
Sample: B2 10am, John Doe -> Reserve tennis for John Doe at 10 am
(reply ?? for more samples)
```

>######Sample  
>Available for reservation:  
>1: Squash 45 min, 11$  
>2: Tennis 60 min, 21$  
>3: Badminton 60 min, 8$  
>  
>To book reply with: B# date/time, your name  
>Sample: B2 10am, John Doe -> Reserve tennis for John Doe at 10 am  
>(reply ?? for more samples)

Better sample text??  
_SAMPLE: Replying "B2 10am, john doe" means "Reserve tennis for John Doe at 10 am"_ 

======

####COMMAND - get more samples of using date/time 
```
??
```
#####REPLY (three samples of how date/time can be expressed)
```
B1 10/25/14 7.15pm, Jane (book squash 7.15 pm 10/25/2014 for Jane)
B3 th 11am, john (book badminton 11.00 am next thursday for John)
B2 ASAP, @edward_s (book tennis first free slot for @edward_s)
```

======

####COMMAND - make reservation
```
B[#] (ASAP) | ((åå)mmdd) hh(:mm) | (dd) hh:mm-hh:mm, [name]
```

#####REPLY (if requested time free)
```
Confirmed [description] mm/dd/yyyy hh:mm-hh:mm (ID)

(reply C [ID] to cancel reservation) 
```

>######Sample  
>Confirmed Squash 10/25/2014 09.30am-10.15am (AQ53E)  
>(reply C AQ53E to cancel reservation)  
 
#####REPLY (if requested time is fully booked)
```
FULL, see alternatives:
Squash dd/mm hh:mm (ID-1)
Squash dd/mm hh:mm (ID-2)

Reply B ID[1|2] to book or <[ID-1] or >[ID-2] for earlier or later suggestions 
```

>######Sample  
>Full, see alternatives:   
>Squash 22/1 08:00 (AQ53E)  
>Squash 22/1 11:00 (AQ67F)  
>
>Reply B ID to book or &#60;AQ53E or &#62;AQ67F for earlier or later suggestions

The alternative reservations above are reserved in the database for a limited time (minute/minutes). This allows the customer to respond immediately and book a slot without making a new reservation request (and to be sure its available). 
