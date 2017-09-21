-- stored procedure to get birthday users to be norified
DELIMITER //
create procedure getUsersToBeNotifiedOfUpcomingBirthdays()
select
    c.userId,
    c.token as wisherToken,
    a.userId as friendId,
    concat("Hey ", a.name, "'s birthday is near. Here's what Boxxit recommends!") as message
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
