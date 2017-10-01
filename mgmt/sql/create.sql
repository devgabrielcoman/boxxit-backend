/**
 * Select Main Db
 */
use boxxit;


/**
 * Set this to false!
 */
set FOREIGN_KEY_CHECKS = 0;

/**
 * Create the main Users table
 */
create table if not exists Users (
	userId varchar(80) not null unique,
  name varchar(255) character set utf8 collate utf8_unicode_ci,
  email varchar(255),
  birthday date,
  isMale bool,
  token text,
  joinDate timestamp not null default current_timestamp,
  primary key (userId)
);

/**
 * Create the main Products table
 */
 create table if not exists Products (
	asin varchar(20) not null unique,
    title text character set utf8 collate utf8_unicode_ci,
    amount int,
    price varchar(10),
    click text character set utf8 collate utf8_unicode_ci,
    smallImage text character set utf8 collate utf8_unicode_ci,
    bigImage text character set utf8 collate utf8_unicode_ci,
		lastUpdated timestamp not null default current_timestamp,
    primary key (asin)
 );

 /**
  * Create the main Categories Table
  */
create table if not exists Categories (
	categId varchar(80) not null unique,
    name varchar(255) character set utf8 collate utf8_unicode_ci,
    category varchar(255) character set utf8 collate utf8_unicode_ci,
    searchIndex varchar(50) character set utf8 collate utf8_unicode_ci,
    isGenre bool default false,
    isValuable bool default true,
    primary key (categId)
);

/**
 * Create forbidden Categories Table
 */
create table if not exists Forbidden (
	forbidId int not null auto_increment,
	categId varchar(80) not null,
	primary key (forbidId),
	foreign key (categId) references Categories(categId) on update cascade
);

-- insert into Forbidden (categId) values ('rated PG-13');

/********************************************************
 * Create linker tables
 *******************************************************/

/**
 * Create the main Friends table
 */
create table if not exists Friends (
	pairId int not null auto_increment,
    user1Id varchar(80) not null,
    user2Id varchar(80) not null,
    primary key (pairId),
    foreign key (user1Id) references Users(userId) on update cascade,
    foreign key (user2Id) references Users(userId) on update cascade,
    check (user1Id <> user2Id),
    unique key user1user2 (user1Id, user2Id)
);

/**
 * Create the User-Categories link table
 */
 create table if not exists UserCategories (
	pairId int not null auto_increment,
    userId varchar(80) not null,
    categId varchar(80) not null,
    primary key (pairId),
    foreign key (userId) references Users(userId) on update cascade,
    foreign key (categId) references Categories(categId) on update cascade,
    unique key userIdcategId (userId, categId)
 );

 /**
  * Create the Categories-Products table
  */
  create table if not exists CategoriesProducts (
	pairId int not null auto_increment,
	categId varchar(80) not null,
    asin varchar(20) not null,
    primary key (pairId),
    foreign key (categId) references Categories(categId),
    foreign key  (asin) references Products(asin),
    unique key categIdasin (categId, asin)
  );

  /**
   * Create the Favourites table
   */
create table if not exists Favourites (
	pairId int not null auto_increment,
    userId varchar(80) not null,
    asin varchar(20) not null,
    primary key (pairId),
    foreign key (userId) references Users(userId),
    foreign key (asin) references Products(asin),
    unique key useridasin (userId, asin)
);

/**
 * Temporary holds Fb tokens
 */
create table if not exists boxxit.AccessTokens (
	pairId int not null auto_increment,
  userId varchar(80) not null,
  accessToken text not null,
  primary key (pairId),
  foreign key(userId) references Users(userId),
	unique key usrIdCon (userId)
);

/********************************************************
 * Views
 *******************************************************/

/*
 * Create a view that contains nr products for each category
 */
create view CategoryNrProducts
as
select
	a.categId as id,
    a.isValuable as isValuable,
    a.category as category,
    a.searchIndex as searchIndex,
    a.name as name,
    count(b.asin) as nrProducts
from boxxit.Categories a
left join boxxit.CategoriesProducts b on a.categId = b.categId
left join boxxit.Forbidden c on a.categId = c.categId
where c.categId is null
group by a.categId
