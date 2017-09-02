-- stored procedure to get birthday users to be norified
DELIMITER //
create procedure getUsersToBeNotifiedOfUpcomingBirthdays()
select
-- 	b.user2Id as birthdayWisherId,
--  	c.name as birthdayWisherName,
--  	c.token as birthdayWisherToken,
--  	c.email as birthdayWisherEmail,
--  	a.userId as birthdayUserId,
--  	a.name as birthdayUserName,
--  	a.daysTillBirthday,
    c.token as wisherToken,
 --    c.email as email,
    a.userId as friendId,
    concat("Hey ", c.name, ", your friend ", a.name, " has a birthday coming up in ", a.daysTillBirthday, " days. Here's what gifts Boxxit recommends!") as message
from
	(select
		userId,
        name,
        (dayofyear(birthday) - dayofyear(now())) as daysTillBirthday
	 from boxxit.Users where (dayofyear(birthday) - dayofyear(now())) between 0 and 100) a
left join boxxit.Friends b on a.userId = b.user1Id
left join boxxit.Users c on b.user2Id = c.userId;
END //
DELIMITER ;
