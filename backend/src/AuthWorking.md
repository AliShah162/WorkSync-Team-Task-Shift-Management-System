* The simple thing which i undersood is that we created tow methods like "register" and "login" in the services file. Now in the controller file, we said that "auth" will be our root endpoint. Now if someone visits auth/register the register method which is defined in the service file will do his work, same if someone visits auth/login, the login method will do his work.

* now we have DTOs for both register and login methods, like rules user cant violate.

* so thats how we keep creating more methods for different enpoints