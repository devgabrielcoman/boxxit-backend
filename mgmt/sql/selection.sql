-- stored procedure to get 10 random products
DELIMITER //
CREATE PROCEDURE getProductsForUser(in userId varchar(80), in minPrice int, in maxPrice int)
select distinct
		b.name as category,
		c.asin as asin,
		d.title as title,
		d.amount as amount,
		d.price as price,
		d.click as click,
		d.smallImage as smallIcon,
		d.bigImage as largeIcon,
		e.asin as isFavourite
from 	boxxit.UserCategories a
left join boxxit.Categories b on a.categId = b.categId
left join boxxit.CategoriesProducts c on a.categId = c.categId
left join boxxit.Products d on c.asin = d.asin
left join boxxit.Favourites e on d.asin = e.asin
where
 		a.userId = userId and
		d.amount > minPrice and
		d.amount < maxPrice and
		c.asin <> '000000'
order by rand()
limit 10;
END //
DELIMITER ;

-- stored prodedure to get favourite products
DELIMITER //
CREATE PROCEDURE getFavouriteProductsForUser(in userId varchar(80))
select
	a.asin,
  b.title as title,
	b.amount as amount,
	b.price as price,
	b.click as click,
	b.smallImage as smallIcon,
	b.bigImage as largeIcon
from boxxit.Favourites a
left join boxxit.Products b on a.asin = b.asin
where
	a.userId = userId;
END //
DELIMITER ;

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
