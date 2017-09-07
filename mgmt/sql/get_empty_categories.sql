-- stored prodedure to get favourite products
DELIMITER //
CREATE PROCEDURE getEmptyCategories()
select
	id,
	name,
	category,
	searchIndex
from
	boxxit.CategoryNrProducts
where
	nrProducts = 0 and
	isValuable = true and
	name <> 'null' and
	name <> ''
	limit 10;
END //
DELIMITER ;
