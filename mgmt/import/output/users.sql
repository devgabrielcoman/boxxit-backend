use boxxit;
set FOREIGN_KEY_CHECKS = 0;

replace into Users (userId, name, email, isMale, birthday) values
("682939218565803", "Sorin Cucu", "sorin.cucu84@gmail.com", True, '1984-11-18'),
("1675817612435345", "Cristi Nedelciu", "cristi_florentin@yahoo.ca", True, '1987-04-13'),
("1587019804664865", "Anca-Cristina Vrinceanu", NULL, False, '2017-12-24'),
("114695425740841", "Gabriel-Liviu Coman", "test.gabriel.coman@gmail.com", True, '1987-09-18'),
("10211675294590866", "Sebastian Gabor", "s.gabor@me.com", True, '1990-04-04'),
("10210377903217064", "Liviu Coman", "liviu.coman10@gmail.com", True, '1987-09-18'),
("10203560643491925", "Carmen Apetrei", "apetreicarmen89@gmail.com", False, '1989-12-25'),
("10155472193364294", "Horia Coman", NULL, True, '1987-09-18'),
("10100612427833520", "Nadine Ahmed", NULL, False, '2017-10-02'),

set FOREIGN_KEY_CHECKS = 1;