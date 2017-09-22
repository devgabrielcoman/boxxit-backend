CREATE VIEW Report_UserStatus as
SELECT
	a.name as Name,
	if (a.email <> '', a.email, 'Not available') as `Email address`,
  	if (b.NrCategs <> '', b.NrCategs, '0') as `Available likes`,
	if (a.birthday <> '', a.birthday, 'Not available') as Birthday,
	a.joinDate as `Joining date`
FROM Users a
LEFT JOIN (
  SELECT
    a.userId,
    COUNT(a.categId) as NrCategs
   FROM `UserCategories` a
   left join `Categories` b on a.categId = b.categId
   WHERE b.isValuable = TRUE
   GROUP BY a.userId
) b	on a.userId = b.userId

CREATE VIEW Report_CategoryProducts as
SELECT
	b.name as `Like`,
  b.category as `Facebook category`,
  b.searchIndex as `Amazon category`,
  COUNT(a.asin) as `Available products`
FROM `CategoriesProducts` a
LEFT JOIN `Categories` b on a.categId = b.categId
GROUP BY a.categId

CREATE VIEW Report_Products as
SELECT
	c.name as `Like`,
    a.title as `Product`,
    if (a.price <> '', a.price, '£0.00') as `Price`
FROM `Products` a
LEFT JOIN `CategoriesProducts` b on a.asin = b.asin
LEFT JOIN `Categories` c on b.categId = c.categId

CREATE VIEW Report_Friends as
SELECT
	b.name as `User`,
  c.name AS `Is friends with`
FROM `Friends` a
LEFT JOIN Users b on a.user1Id = b.userId
LEFT JOIN Users c on a.user2Id = c.userId
WHERE b.name <> '' and c.name <> ''

CREATE VIEW Report_Birthdays as
SELECT
	c.name as `Should notify`,
    a.name AS `Friend birthday`,
    a.daysTillBirthday as `Days until birthday`,
    if(c.token <> '', 'YES', 'NO') as `Can send notification`,
    IF(c.email <> '', 'YES', 'NO') as `Can send email`
FROM
	(SELECT
		userId,
        name,
        (dayofyear(birthday) - dayofyear(now())) as daysTillBirthday
	FROM boxxit.Users where (dayofyear(birthday) - dayofyear(now())) BETWEEN 0 AND 100) a
LEFT JOIN boxxit.Friends b on a.userId = b.user1Id
LEFT JOIN boxxit.Users c on b.user2Id = c.userId;
