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
	b.bigImage as largeIcon,
    true as isFavourite
from boxxit.Favourites a
left join boxxit.Products b on a.asin = b.asin
where
	a.userId = userId;
END //
DELIMITER ;
 