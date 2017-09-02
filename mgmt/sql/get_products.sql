-- stored procedure to get 10 random products
DELIMITER //
CREATE PROCEDURE getProductsForUser(in userId varchar(80), in minPrice int, in maxPrice int)
select
	b.name as category,
	c.asin as asin,
	d.title as title,
	d.amount as amount,
	d.price as price,
	d.click as click,
	d.smallImage as smallIcon,
	d.bigImage as largeIcon,
	e.asin as isFavourite
from
((
	select
		a1.categId,
        b1.name
	from boxxit.UserCategories a1
    left join boxxit.Categories b1 on a1.categId = b1.categId
    left join boxxit.Forbidden c1 on a1.categId = c1.categId
    where
		a1.userId = userId  and
        b1.isGenre = false and
        c1.categId is null
	order by rand() limit 5
)
union all
(
	select
		a1.categId,
        b1.name
	from boxxit.UserCategories a1
    left join boxxit.Categories b1 on a1.categId = b1.categId
    left join boxxit.Forbidden c1 on a1.categId = c1.categId
    where
		a1.userId = userId  and
        b1.isGenre = true and
        c1.categId is null
	order by rand() limit 5
)
union all
(
	select
		a1.categId,
        a1.name
	from boxxit.Categories a1
    left join boxxit.Forbidden c1 on a1.categId = c1.categId
    where
		a1.isGenre = true and
        c1.categId is null
	order by rand() limit 5
)) b
left join boxxit.CategoriesProducts c on b.categId = c.categId
left join boxxit.Products d on c.asin = d.asin
left join boxxit.Favourites e on d.asin = e.asin
where d.amount > minPrice and d.amount < maxPrice
order by rand();
END //
DELIMITER ;
