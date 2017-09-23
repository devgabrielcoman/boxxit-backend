use boxxit;

create view Report_TotalUsers as
select
 count(userId) as Total_Users
from Users;

CREATE VIEW Report_UserStatus as
SELECT
	a.name as Name,
	if (a.email <> '', a.email, 'Not available') as `Email_Address`,
  	if (b.NrCategs <> '', b.NrCategs, '0') as `Available_Likes`,
	if (a.birthday <> '', date_format(a.birthday, '%d %b %Y'), 'Not available') as Birthday,
	date_format(a.joinDate, '%d %b %Y') as `Joining_Date`
FROM Users a
LEFT JOIN (
	SELECT
		a.userId,
		COUNT(a.categId) as NrCategs
   FROM `UserCategories` a
   LEFT JOIN `Categories` b on a.categId = b.categId
   WHERE b.isValuable = TRUE
   GROUP BY a.userId
) b on a.userId = b.userId;

create view Report_NewJoiners as
select
 date_format(joinDate, "%d %b %Y") as Join_Date,
 count(userId) as Joiners
from Users
group by Join_Date;

create view Report_NewJoiners_Today as
select
 count(joinDate) as Joiners_Today
from Users a
where date_format(joinDate, '%d %b %Y') = date_format(now(), '%d %b %Y');

CREATE VIEW Report_Friends as
SELECT
	b.name as `User`,
  c.name AS `Is_Friends_With`
FROM `Friends` a
LEFT JOIN Users b on a.user1Id = b.userId
LEFT JOIN Users c on a.user2Id = c.userId
WHERE b.name <> '' and c.name <> '';

CREATE VIEW Report_Birthdays as
SELECT
	c.name as `Should_Notify`,
    a.name AS `Friend_Birthday`,
    a.daysTillBirthday as `Days_Until_Birthday`,
    if(c.token <> '', 'YES', 'NO') as `Can_Send_Notification`,
    IF(c.email <> '', 'YES', 'NO') as `Can_Send_Email`
FROM
	(SELECT
		userId,
        name,
        (dayofyear(birthday) - dayofyear(now())) as daysTillBirthday
	FROM boxxit.Users where (dayofyear(birthday) - dayofyear(now())) BETWEEN 0 AND 100) a
LEFT JOIN boxxit.Friends b on a.userId = b.user1Id
LEFT JOIN boxxit.Users c on b.user2Id = c.userId;

CREATE VIEW Report_CategoryProducts as
SELECT
	b.name as `Category`,
	b.category as `Facebook_Category`,
	b.searchIndex as `Amazon_Category`,
	COUNT(a.asin) as `Available_Products`
FROM `CategoriesProducts` a
LEFT JOIN `Categories` b on a.categId = b.categId
GROUP BY a.categId;

CREATE VIEW Report_Products as
SELECT
	c.name as `Category`,
    a.title as `Product`,
    if (a.price <> '', a.price, '£0.00') as `Price`
FROM `Products` a
LEFT JOIN `CategoriesProducts` b on a.asin = b.asin
LEFT JOIN `Categories` c on b.categId = c.categId;
