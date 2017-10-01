-- stored prodedure to get favourite products
DELIMITER //
CREATE PROCEDURE getProductsToUpdate()
	select
		asin
	from
		boxxit.Products
	where lastUpdated < curdate() - interval 7 day
	order by rand()
	limit 10;
END //
DELIMITER ;
