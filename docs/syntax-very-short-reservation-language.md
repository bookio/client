###Draft for syntax when booking through SMS, Twitter and Mail

####COMMAND - get a list of bookable resources 
```
? | any text
```
####REPLY
```
Available for reservation:
1 [Name of booking category 1] [reservation length for category 1], [price for category 1]
2 [Name of booking category 2] [reservation length for category 2], [price for category 2]
3 ...

To make a reservation reply with: B# date/time, your name
Sample: B2 10am, John Doe -> Reserve tennis for John Doe at 10 am
(reply ?? for more samples)
```

>######Sample  
>Available for reservation:  
>[1] Squash 45 min, 11$  
>[2] Tennis 60 min, 21$  
>[3] Badminton 60 min, 8$  
>  
>To make a reservation reply with: B# date/time, your name  
>Sample: B2 10am, John Doe -> Reserve tennis for John Doe at 10 am  
>(reply ?? for more samples)

======

####COMMAND - get more samples of using date/time 
```
??
```
####REPLY (three samples of how date/time can be expressed)
```
B1 10/25/14 7.15pm, Jane (book squash 7.15 pm 10/25/2014 for Jane)
B3 th 11am, john (book badminton 11.00 am next thursday for John)
B2 ASAP, edward s (book tennis first free slot for Edward S)
```

======

####COMMAND - make reservation
```
B[#] (ASAP) | ((åå)mmdd) hh(:mm) | (dd) hh:mm-hh:mm, [name]
```

####REPLY (if requested time free)
```
Confirmed [description] mm/dd/yyyy hh:mm-hh:mm (ID)

(reply C [ID] to cancel reservation) 
```

>######Sample  
>Confirmed Squash 10/25/2014 09.30am-10.15am (AQ53E)  
>Reply C AQ53E to cancel reservation  
 
####REPLY (if requested time is fully booked)
```
FULL, see alternatives:
Squash 08:00 (AQ53E)
Squash 11:00 (AQ67F)

Reply B(id) to book or <AQ53E or >AQ67F for earlier or later suggestions 
```